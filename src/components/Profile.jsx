import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Search from './Search';
import userService from '../services/users';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import discogsButton from '../assets/discogsButton.webp';
import tmdbLogo from '../assets/tmdbLogo.svg';
import openLibraryLogo from '../assets/openLibrarylogo.png';
import isbndbLogo from '../assets/isbndb.png';
import igdbLogo from '../assets/IGDB_logo.svg.png';

const styles = {
  // albumContainer: {
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  containerInfo: {
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
    width: '170px',
    height: '220px',
    marginRight: '1rem',
  },
  bookThumbnail: {
    width: '150px',
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

const Profile = ({ createObject }) => {
  const [followersData, setFollowersData] = useState(null);
  const [albums, setAlbums] = useState(true);
  const [books, setBooks] = useState(false);
  const [games, setGames] = useState(false);
  const [movies, setMovies] = useState(false);
  const user = useSelector((state) => state.user);

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

  console.log('followers data', followersData);

  const followedUsernames = followersData.followedUsers;

  console.log('followed', followedUsernames);
  console.log(followedUsernames.find((username) => username.id === 6).username);

  return (
    <>
      {user && (
        <>
          <Search createObject={createObject} />
        </>
      )}
      {followersData ? (
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
              {followersData && (
                <div>
                  {albums && (
                    <>
                      <h3>Albums</h3>
                      {followersData.albums.map((album) => (
                        <div key={album.id}>
                          <Link
                            to={`/${
                              followedUsernames.find(
                                (username) => username.id === album.user_id
                              ).username
                            }`}
                          >
                            {
                              followedUsernames.find(
                                (username) => username.id === album.user_id
                              ).username
                            }
                          </Link>{' '}
                          {album.rating ? 'rated' : 'added'}
                          <div style={styles.containerInfo}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Link
                                to={`${
                                  followedUsernames.find(
                                    (username) => username.id === album.user_id
                                  ).username
                                }/albums/${album.id}`}
                              >
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
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{album.whole_title}</span>
                              {album.url && (
                                <p>
                                  <a
                                    href={`${album.url}`}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <button
                                      style={{
                                        backgroundColor: 'black',
                                        marginTop: '10px',
                                        padding: '6px 14px',
                                      }}
                                    >
                                      <img
                                        src={discogsButton}
                                        style={{
                                          width: '100%',
                                          maxWidth: '100px',
                                          height: 'auto',
                                        }}
                                      />
                                    </button>
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          <hr style={styles.separator} />
                        </div>
                      ))}
                    </>
                  )}
                  {movies && (
                    <>
                      <h3>Movies</h3>
                      {followersData.movies.map((movie) => (
                        <div key={movie.id}>
                          <Link
                            to={`/${
                              followedUsernames.find(
                                (username) => username.id === movie.user_id
                              ).username
                            }`}
                          >
                            {
                              followedUsernames.find(
                                (username) => username.id === movie.user_id
                              ).username
                            }
                          </Link>{' '}
                          {movie.rating ? 'rated' : 'added'}
                          <div style={styles.containerInfo}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <Link
                                to={`${
                                  followedUsernames.find(
                                    (username) => username.id === movie.user_id
                                  ).username
                                }/movies/${movie.id}`}
                              >
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
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{movie.whole_title}</span>
                              {movie.type === 'movie' ? (
                                <p>
                                  <a
                                    href={`https://themoviedb.org/movie/${movie.url}`}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={tmdbLogo}
                                      style={{
                                        width: '100%',
                                        maxWidth: '80px',
                                        height: 'auto',
                                        backgroundColor: '#0d253f',
                                        padding: '10px',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </a>
                                </p>
                              ) : (
                                <p>
                                  <a
                                    href={`https://themoviedb.org/tv/${movie.url}`}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={tmdbLogo}
                                      style={{
                                        width: '100%',
                                        maxWidth: '80px',
                                        height: 'auto',
                                        backgroundColor: '#0d253f',
                                        padding: '10px',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          <hr style={styles.separator} />
                        </div>
                      ))}
                    </>
                  )}
                  {games && (
                    <>
                      <h3>Games</h3>
                      {followersData.games.map((game) => (
                        <div key={game.id}>
                          <Link
                            to={`/${
                              followedUsernames.find(
                                (username) => username.id === game.user_id
                              ).username
                            }`}
                          >
                            {
                              followedUsernames.find(
                                (username) => username.id === game.user_id
                              ).username
                            }
                          </Link>{' '}
                          {game.rating ? 'rated' : 'added'}
                          <div style={styles.containerInfo}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Link
                                to={`${
                                  followedUsernames.find(
                                    (username) => username.id === game.user_id
                                  ).username
                                }/games/${game.id}`}
                              >
                                {game.thumbnail && (
                                  <img
                                    src={game.thumbnail.replace(
                                      /t_thumb/,
                                      't_cover_big'
                                    )}
                                    style={styles.gameThumbnail}
                                  />
                                )}
                              </Link>

                              {game.rating && (
                                <div style={styles.circle}>
                                  <span style={styles.circleText}>
                                    {game.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{game.whole_title}</span>
                              {game.url && (
                                <p>
                                  <a
                                    href={game.url}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={igdbLogo}
                                      style={{
                                        width: '100%',
                                        maxWidth: '100px',
                                        height: 'auto',
                                      }}
                                    />
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          <hr style={styles.separator} />
                        </div>
                      ))}
                    </>
                  )}

                  {books && (
                    <>
                      <h3>Books</h3>
                      {followersData.books.map((book) => (
                        <div key={book.id}>
                          <Link
                            to={`/${
                              followedUsernames.find(
                                (username) => username.id === book.user_id
                              ).username
                            }`}
                          >
                            {
                              followedUsernames.find(
                                (username) => username.id === book.user_id
                              ).username
                            }
                          </Link>{' '}
                          {book.rating ? 'rated' : 'added'}
                          <div style={styles.containerInfo}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Link
                                to={`${
                                  followedUsernames.find(
                                    (username) => username.id === book.user_id
                                  ).username
                                }/books/${book.id}`}
                              >
                                {book.source === 'openLibrary' ? (
                                  <img
                                    src={`https://covers.openlibrary.org/b/id/${book.thumbnail}-L.jpg`}
                                    style={styles.bookThumbnail}
                                  />
                                ) : (
                                  <img
                                    src={book.thumbnail}
                                    style={styles.bookThumbnail}
                                  />
                                )}
                              </Link>

                              {book.rating && (
                                <div style={styles.circle}>
                                  <span style={styles.circleText}>
                                    {book.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{book.whole_title}</span>
                              {book.source === 'openLibrary' ? (
                                <p>
                                  <a
                                    href={`https://openlibrary.org${book.key}`}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={openLibraryLogo}
                                      style={{
                                        width: '100%',
                                        maxWidth: '120px',
                                        height: 'auto',
                                        backgroundColor: 'white',
                                        padding: '8px',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </a>
                                </p>
                              ) : (
                                <p>
                                  <a
                                    href={`https://isbndb.com/book/${book.isbn13}`}
                                    target="blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={isbndbLogo}
                                      style={{
                                        width: '100%',
                                        maxWidth: '110px',
                                        height: 'auto',
                                        backgroundColor: 'black',
                                        padding: '8px',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          <hr style={styles.separator} />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

Profile.propTypes = {
  createObject: PropTypes.func.isRequired,
};

export default Profile;
