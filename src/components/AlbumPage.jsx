import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faHeart,
  faPauseCircle,
  faPlay,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./CSS/AlbumPage.css";
import { Image, Alert, Table, Spinner, Row } from "react-bootstrap";

export class AlbumPage extends Component {
  state = {
    album: {},
    tracks: [],
    loading: true,
    error: false,
  };
  duration = (time) => {
    const min = time / 60;
    return min <= 60
      ? `${Math.floor(min)} MIN`
      : `${Math.floor(min / 60)} HR ${min} MIN}`;
  };

  durationTrack = (time) => {
    let min = Math.floor(time / 60);
    if (min < 10) {
      min = `0${min.toString()}`;
    }
    let sec = (time % 60).toString();
    if (sec < 10) {
      sec = `0${sec.toString()}`;
    }
    return min + ":" + sec;
  };
  fetchAlbum = async () => {
    let albumID = this.props.match.params.id;
    console.log(albumID);
    try {
      let response = await fetch(
        "https://deezerdevs-deezer.p.rapidapi.com/album/" + albumID,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "91cbdcb779mshb25e7872769b4fcp110c07jsnbcf1d17bc30b",
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          },
        }
      );
      if (response.ok) {
        let album = await response.json();
        this.setState({
          album: album,
          loading: false,
        });
      } else {
        this.setState({ loading: false, error: true });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false, error: true });
    }
  };

  componentDidMount = () => {
    this.fetchAlbum();
  };

  render() {
    const { album, loading } = this.state;
    return (
      <>
        {loading ? (
          <Spinner animation="border" variant="white" size="lg" />
        ) : (
          album && (
            <Row>
              <div className="albums-holder col-9" style={{ padding: "0px" }}>
                <section id="albums-section">
                  <div className="album row">
                    <div className="col-12 col-md-6 col-lg-4">
                      <Image
                        className="album-cover img-fluid"
                        src={album.cover_big}
                        alt="album cover"
                      />
                    </div>
                    <div className="album-details col-12 col-md-6 col-lg-8">
                      <h4 className="mt-2">album</h4>
                      <h2 id="albumName">{album.title}</h2>
                      <div className="mt-4 last-line">
                        <Link to={`/artist/${album.artist.id}`}>
                          <img
                            src={album.artist.picture_small}
                            alt={album.artist.name}
                            className="group-img"
                          />
                          <h6>
                            <span lassName="group-name">
                              {` ${album.artist.name}`}
                            </span>
                          </h6>
                        </Link>
                        <p className="album-length">
                          {album.release_date.substr(0, 4) + " • "}
                          {album.nb_tracks + " SONGS"}
                          {", " + this.duration(album.duration)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="playlist" style={{ width: "100%" }}>
                    <div className="playlist-btns mt-3 mb-3">
                      <faPauseCircle
                        icon={faPauseCircle}
                        className="fas fa-pause-circle fa-3x"
                      />
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="far fa-heart fa-2x mr-3 ml-3"
                      />
                      <FontAwesomeIcon
                        icon={faEllipsisH}
                        className="fa fa-ellipsis-h fa-2x"
                      />
                    </div>

                    <Table className="playlist-table">
                      <thead className="table table-borderless">
                        <tr>
                          <th scope="col th-sm">#</th>
                          <th scope="col th-sm">Title</th>
                          <th scope="col th-sm">
                            <FontAwesomeIcon icon={faClock} />
                          </th>
                          <th scope="col th-sm"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {album.tracks.data.map((track, index) => (
                          <tr key={track.id} className="songRow">
                            <td style={{ verticalAlign: "middle" }}>{index}</td>
                            <td>
                              <>
                                <strong className="song">{track.title}</strong>
                                <br />
                                <p>
                                  <Link
                                    to={`/artist/${track.artist.id}/${track.artist.name}`}
                                  >
                                    {track.artist.name}
                                  </Link>
                                </p>
                              </>
                            </td>
                            <td>
                              {(track.duration / 60)
                                .toFixed(2)
                                .toString()
                                .replace(".", ":")}
                            </td>
                            <td>
                              <FontAwesomeIcon icon={faPlay} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </section>
              </div>
            </Row>
          )
        )}
      </>
    );
  }
}

export default AlbumPage;
