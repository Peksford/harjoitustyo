import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserMenu from './UserMenu';
import userService from '../services/users';
import { useSelector } from 'react-redux';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '50px',
    paddingLeft: '24px',
    marginLeft: '24px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '12px',
    width: '150px',
  },
  item: {
    textAlign: 'center',
    flex: '1',
  },
  thumbnailAlbum: {
    width: '180px',
    height: '180px',
    objectFit: 'cover',
    padding: '10px',
  },
  thumbnailBook: {
    width: '150px',
    height: '200px',
    objectFit: 'cover',
    padding: '10px',
  },
  thumbnailMovie: {
    width: '180px',
    height: '270px',
    padding: '15px',
    objectFit: 'cover',
  },
  thumbnailGame: {
    width: '220px',
    height: '280px',
    objectFit: 'cover',
    padding: '30px',
  },
  circle: {
    margin: '10px auto 0',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: '2px solid rgb(255, 255, 255)',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
    color: 'black',
  },
  title: {
    display: 'block',
    textAlign: 'center',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    whiteSpace: 'normal',
  },
};

const Home = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUser(username);
        setUserData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  if (!username) return null;

  const getWeekNumber = (date = new Date()) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
  };

  const heartAlbum = userData
    ? userData?.albums?.find((album) => album.heart === true)
    : null;
  const heartMovie = userData
    ? userData?.movies?.find((movie) => movie.heart === true)
    : null;
  const heartBook = userData
    ? userData?.books?.find((book) => book.heart === true)
    : null;
  const heartGame = userData
    ? userData?.games?.find((game) => game.heart === true)
    : null;

  const sortedByDateAlbums = userData?.albums
    ?.filter((album) => album.rating !== null)
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.slice(0, 5);

  const sortedByDateBooks = userData?.books
    ?.filter((book) => book.rating !== null)
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.slice(0, 4);

  const sortedByDateMovies = userData?.movies
    ?.filter((movie) => movie.rating !== null)
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.slice(0, 4);

  const sortedByDateGame = userData?.games
    ?.filter((game) => game.rating !== null)
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.slice(0, 4);

  if (userData) {
    return (
      <>
        <UserMenu />
        {user?.username === username ? (
          <h1 style={{ textAlign: 'center' }}>
            Your top picks for the week {getWeekNumber()}
          </h1>
        ) : (
          <h1 style={{ textAlign: 'center' }}>
            {username}&apos;s top picks for the week {getWeekNumber()}
          </h1>
        )}

        <div>
          {heartAlbum || heartMovie || heartBook || heartGame ? (
            <div>
              <div className="home-container">
                {heartAlbum ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <Link to={`/${username}/albums/${heartAlbum.id}`}>
                          <img
                            src={heartAlbum.thumbnail}
                            style={{ width: '140px' }}
                          />
                        </Link>
                      </p>
                      <div>{heartAlbum.whole_title}</div>
                      {heartAlbum.rating ? (
                        <p style={styles.circle}>
                          <span style={styles.circleText}>
                            {heartAlbum.rating}
                          </span>
                        </p>
                      ) : (
                        <div>{null}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>{null}</div>
                )}
                {heartMovie ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <Link to={`/${username}/movies/${heartMovie.id}`}>
                          <img
                            src={`https://www.themoviedb.org/t/p/w1280/${heartMovie.thumbnail}`}
                            style={{ width: '140px' }}
                          />
                        </Link>
                      </p>
                      <div>{heartMovie.whole_title}</div>
                      {heartMovie.rating ? (
                        <p style={styles.circle}>
                          <span style={styles.circleText}>
                            {heartMovie.rating}
                          </span>
                        </p>
                      ) : (
                        <div>{null}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>{null}</div>
                )}
                {heartBook ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <Link to={`/${username}/books/${heartBook.id}`}>
                          {heartBook.source === 'openLibrary' ? (
                            <img
                              src={`https://covers.openlibrary.org/b/id/${heartBook.thumbnail}-L.jpg`}
                              style={{ width: '110px' }}
                            />
                          ) : (
                            <img
                              src={heartBook.thumbnail}
                              style={{ width: '110px' }}
                            />
                          )}
                        </Link>
                      </p>
                      <div>{heartBook.whole_title}</div>
                      {heartBook.rating ? (
                        <p style={styles.circle}>
                          <span style={styles.circleText}>
                            {heartBook.rating}
                          </span>
                        </p>
                      ) : (
                        <div>{null}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>{null}</div>
                )}
                {heartGame ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <Link to={`/${username}/games/${heartGame.id}`}>
                          <img
                            src={heartGame.thumbnail.replace(
                              /t_thumb/,
                              't_cover_big'
                            )}
                            style={{ width: '140px' }}
                          />
                        </Link>
                      </p>
                      <div>{heartGame.title}</div>
                      {heartGame.rating ? (
                        <p style={styles.circle}>
                          <span style={styles.circleText}>
                            {heartGame.rating}
                          </span>
                        </p>
                      ) : (
                        <div>{null}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>{null}</div>
                )}
              </div>
            </div>
          ) : (
            <div>{username} has no top picks </div>
          )}
          <hr />
        </div>

        {user?.username === username ? (
          <h1 style={{ textAlign: 'center' }}>Your latest albums</h1>
        ) : (
          <h1 style={{ textAlign: 'center' }}>{username}&apos;s Albums</h1>
        )}
        <div className="album-container">
          {sortedByDateAlbums.map((album) => (
            <div key={album.id} style={styles.card}>
              <Link
                data-testid="albumTest"
                to={`/${username}/albums/${album.id}`}
              >
                <img src={album.thumbnail} style={styles.thumbnailAlbum} />
              </Link>
              <div style={styles.title}>{album.whole_title}</div>
              {album.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{album.rating}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <Link
          style={{ fontSize: '20px', textAlign: 'center', display: 'block' }}
          to={`/${username}/albums`}
        >
          Show all
        </Link>

        <hr />
        {user?.username === username ? (
          <h1 style={{ textAlign: 'center' }}>Your latest books</h1>
        ) : (
          <h1 style={{ textAlign: 'center' }}>
            {username}&apos;s latest Books
          </h1>
        )}
        <div className="album-container">
          {sortedByDateBooks.map((book) => (
            <div key={book.id} style={styles.card}>
              <Link
                style={{
                  fontSize: '20px',
                  textAlign: 'center',
                  display: 'block',
                }}
                data-testid="albumTest"
                to={`/${username}/books/${book.id}`}
              >
                {book.source === 'ISBNDB' ? (
                  <img src={book.thumbnail} style={styles.thumbnailBook} />
                ) : (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.thumbnail}-L.jpg`}
                    style={styles.thumbnailBook}
                  />
                )}
              </Link>
              <div style={styles.title}>{book.whole_title}</div>
              {book.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{book.rating}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Link
          style={{ fontSize: '20px', textAlign: 'center', display: 'block' }}
          to={`/${username}/books`}
        >
          Show all
        </Link>
        <hr />

        {user?.username === username ? (
          <h1 style={{ textAlign: 'center' }}>Your movies/tv</h1>
        ) : (
          <h1 style={{ textAlign: 'center' }}>
            {username}&apos;s latest Movies
          </h1>
        )}
        <div className="album-container">
          {sortedByDateMovies.map((movie) => (
            <div key={movie.id} style={styles.card}>
              <Link
                style={{
                  fontSize: '20px',
                  textAlign: 'center',
                  display: 'block',
                }}
                data-testid="albumTest"
                to={`/${username}/movies/${movie.id}`}
              >
                {movie.thumbnail && (
                  <img
                    src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
                    style={styles.thumbnailMovie}
                  />
                )}
              </Link>
              <div style={styles.title}>{movie.title}</div>
              {movie.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{movie.rating}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <Link
          style={{ fontSize: '20px', textAlign: 'center', display: 'block' }}
          to={`/${username}/movies`}
        >
          Show all
        </Link>

        <hr />
        {user?.username === username ? (
          <h1 style={{ textAlign: 'center' }}>Your games</h1>
        ) : (
          <h1 style={{ textAlign: 'center' }}>
            {username}&apos;s latest Games
          </h1>
        )}

        <div className="album-container">
          {sortedByDateGame.length > 0 ? (
            sortedByDateGame.map((game) => (
              <div key={game.id} style={styles.card}>
                <Link
                  data-testid="albumTest"
                  to={`/${username}/games/${game.id}`}
                >
                  {game.thumbnail && (
                    <img
                      src={game.thumbnail.replace(/t_thumb/, 't_cover_big')}
                      style={styles.thumbnailGame}
                    />
                  )}
                </Link>
                <div style={styles.title}>{game.title}</div>
                {game.rating ? (
                  <div style={styles.circle}>
                    <span style={styles.circleText}>{game.rating}</span>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p>{username} is not much of a gamer</p>
          )}
        </div>
        <Link
          style={{
            fontSize: '20px',
            textAlign: 'center',
            display: 'block',
          }}
          to={`/${username}/games`}
        >
          Show all
        </Link>
        <hr />
      </>
    );
  } else {
    return null;
  }
};

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Home;
