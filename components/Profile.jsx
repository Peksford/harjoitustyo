import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserMenu from './UserMenu';
import Search from './Search';
import userService from '../services/users';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
  // albumContainer: {
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  albumInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  albumThumbnail: {
    width: '185px',
    height: '185px',
    marginRight: '1rem',
  },
  movieThumbnail: {
    width: '190px',
    height: '250px',
    marginRight: '1rem',
  },
  gameThumbnail: {
    width: '200px',
    height: '200px',
    marginRight: '1rem',
  },
  bookThumbnail: {
    width: '200px',
    height: '200px',
    marginRight: '1rem',
  },
  // buttonContainer: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   gap: '8px',
  // },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  circle: {
    // position: 'absolute',
    // bottom: '20px',
    // top: '150%',
    // left: '20%',
    // transform: 'translate(-50%, -50%)',
    width: '75px',
    height: '75px',
    borderRadius: '50%',
    border: '2px solid rgb(0, 0, 0)',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 'px',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
    color: 'black',
  },
};

const Profile = ({
  user,
  createAlbum,
  createBook,
  createGame,
  createMovie,
}) => {
  const [followersData, setFollowersData] = useState(null);
  const [albums, setAlbums] = useState(true);
  const [books, setBooks] = useState(false);
  const [games, setGames] = useState(false);
  const [movies, setMovies] = useState(false);

  console.log('Profile component', user);
  if (!user) return null;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getFollowersData();

        setFollowersData(response);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, []);

  console.log('Followers data', followersData);

  if (followersData) {
    return (
      <>
        {user && (
          <>
            <h2>Search stuff here</h2>
            <Search
              createAlbum={createAlbum}
              createBook={createBook}
              createMovie={createMovie}
              createGame={createGame}
            />
          </>
        )}
        <div>
          <h2>Activity</h2>
          {followersData && (
            <div>
              <DropdownButton
                id="dropdown-secondary-button"
                // data-testid="dropdown-list"
                title={
                  albums
                    ? 'Albums'
                    : movies
                    ? 'Movies'
                    : games
                    ? 'Games'
                    : books
                    ? 'Books'
                    : 'Albums'
                }
              >
                <Dropdown.Item
                  onClick={() => {
                    setAlbums(true);
                    setMovies(false);
                    setGames(false);
                    setBooks(false);
                  }}
                >
                  Albums
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setMovies(true);
                    setAlbums(false);
                    setGames(false);
                    setBooks(false);
                  }}
                >
                  Movies
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setGames(true);
                    setMovies(false);
                    setAlbums(false);
                    setBooks(false);
                  }}
                >
                  Games
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setBooks(true);
                    setMovies(false);
                    setGames(false);
                    setAlbums(false);
                  }}
                >
                  Books
                </Dropdown.Item>
              </DropdownButton>
              {followersData.map((item) => (
                <div key={item.id}>
                  {albums &&
                    item.albums.map((album) => (
                      <div key={album.id}>
                        <Link to={`/${item.username}`}>{item.username}</Link>{' '}
                        {album.rating ? 'rated' : 'added'}
                        <div style={styles.albumInfo}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Link to={`${item.username}/albums/${album.id}`}>
                              <img
                                src={album.thumbnail}
                                style={styles.albumThumbnail}
                              />
                            </Link>

                            {album.rating && (
                              <div style={styles.circle}>
                                <span style={styles.circleText}>
                                  {album.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span>{album.whole_title}</span>
                            {album.url && (
                              <p>
                                <a
                                  href={`${album.url}`}
                                  target="blank"
                                  rel="noopener noreferrer"
                                >
                                  Discogs
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                        <hr style={styles.separator} />
                      </div>
                    ))}
                  {movies &&
                    item.movies.map((movie) => (
                      <div key={movie.id}>
                        <Link to={`/${item.username}`}>{item.username}</Link>{' '}
                        {movie.rating ? 'rated' : 'added'}
                        <div style={styles.albumInfo}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <Link to={`${item.username}/movies/${movie.id}`}>
                              {movie.thumbnail && (
                                <img
                                  src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
                                  style={styles.movieThumbnail}
                                />
                              )}
                            </Link>
                            {movie.rating ? (
                              <div style={styles.circle}>
                                <span style={styles.circleText}>
                                  {movie.rating}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span>{movie.whole_title}</span>
                            {movie.type === 'movie' ? (
                              <p>
                                <a
                                  href={`https://themoviedb.org/movie/${movie.url}`}
                                  target="blank"
                                  rel="noopener noreferrer"
                                >
                                  The Movie Database
                                </a>
                              </p>
                            ) : (
                              <p>
                                <a
                                  href={`https://themoviedb.org/tv/${movie.url}`}
                                  target="blank"
                                  rel="noopener noreferrer"
                                >
                                  The Movie Database
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                        <hr style={styles.separator} />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  } else {
    return 'loading...';
  }
};

export default Profile;
