import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Search from '../Search';
import userService from '../../services/users';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import discogsButton from '../../assets/discogsButton.webp';
import tmdbLogo from '../../assets/tmdbLogo.svg';
import openLibraryLogo from '../../assets/openLibrarylogo.png';
import isbndbLogo from '../../assets/isbndb.png';
import igdbLogo from '../../assets/IGDB_logo.svg.png';
import DropdownSelector from './DropdownSelector';

const styles = {
  containerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  albumsThumbnail: {
    width: '185px',
    height: '185px',
    marginRight: '1rem',
  },
  moviesThumbnail: {
    width: '190px',
    height: '250px',
    marginRight: '1rem',
  },
  gamesThumbnail: {
    width: '170px',
    height: '220px',
    marginRight: '1rem',
  },
  booksThumbnail: {
    width: '150px',
    height: '200px',
    marginRight: '1rem',
  },

  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  circle: {
    width: '65px',
    height: '65px',
    borderRadius: '50%',
    border: '2px solid rgb(0, 0, 0)',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
    color: 'black',
  },
};

const ActivityData = ({
  followersData,
  albums,
  movies,
  games,
  books,
  followedUsernames,
}) => {
  let itemName = '';

  if (albums) itemName = 'albums';
  else if (movies) itemName = 'movies';
  else if (books) itemName = 'books';
  else if (games) itemName = 'games';

  return followersData?.[itemName].map((item) => (
    <div key={item.id}>
      {console.log('item', item)}
      <Link
        to={`/${
          followedUsernames.find((username) => username.id === item.user_id)
            .username
        }`}
      >
        {
          followedUsernames.find((username) => username.id === item.user_id)
            .username
        }
      </Link>{' '}
      {item.rating ? 'rated' : 'added'}
      <div style={styles.containerInfo}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            to={`${
              followedUsernames.find((username) => username.id === item.user_id)
                .username
            }/items/${item.id}`}
          >
            <img src={item.thumbnail} style={styles[`${itemName}Thumbnail`]} />
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>{item.whole_title}</span>
          {item.url && (
            <p>
              <a href={`${item.url}`} target="blank" rel="noopener noreferrer">
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
                      maxWidth: '80px',
                      height: 'auto',
                    }}
                  />
                </button>
              </a>
            </p>
          )}
          {item.rating && (
            <div style={styles.circle}>
              <span style={styles.circleText}>{item.rating}</span>
            </div>
          )}
        </div>
      </div>
      <hr style={styles.separator} />
    </div>
  ));
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

  let followedUsernames = {};
  if (followersData) {
    followedUsernames = followersData.followedUsers;
  }

  return (
    <>
      {user && <Search createObject={createObject} />}
      <hr />
      {followersData ? (
        <div>
          <h2>Activity</h2>
          {followersData && (
            <div>
              <DropdownSelector
                albums={albums}
                movies={movies}
                books={books}
                games={games}
                setAlbums={setAlbums}
                setMovies={setMovies}
                setGames={setGames}
                setBooks={setBooks}
              />

              {followersData && (
                <div>
                  <ActivityData
                    followersData={followersData}
                    followedUsernames={followedUsernames}
                    albums={albums}
                    books={books}
                    movies={movies}
                    games={games}
                  />
                  {/* {albums && (
                    <>
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
                                          maxWidth: '80px',
                                          height: 'auto',
                                        }}
                                      />
                                    </button>
                                  </a>
                                </p>
                              )}
                              {album.rating && (
                                <div style={styles.circle}>
                                  <span style={styles.circleText}>
                                    {album.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <hr style={styles.separator} />
                        </div>
                      ))}
                    </>
                  )} */}
                  {movies && (
                    <>
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
