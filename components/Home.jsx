import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import followService from '../services/follow';
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '50px',
  },
  item: {
    textAlign: 'center',
    flex: '1',
  },
  circle: {
    margin: '10px auto 0',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const Home = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  if (!username) return null;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  // const currentMonth = () => {
  //   const currentDate = new Date();
  //   console.log('Current date', currentDate);
  //   const months = [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July',
  //     'August',
  //     'September',
  //     'October',
  //     'November',
  //     'December',
  //   ];
  //   return months[currentDate.getMonth()];
  // };

  const heartAlbum = userData
    ? userData.albums.find((album) => album.heart === true)
    : null;
  const heartMovie = userData
    ? userData.movies.find((movie) => movie.heart === true)
    : null;
  const heartBook = userData
    ? userData.books.find((book) => book.heart === true)
    : null;
  const heartGame = userData
    ? userData.games.find((game) => game.heart === true)
    : null;

  const testi = async (event) => {
    event.preventDefault();
    try {
      followService.newFollow(user, userData);
    } catch (error) {
      console.error(error);
    }
  };

  if (userData) {
    return (
      <>
        <h1>{username}</h1>
        {user && <button onClick={testi}> Follow</button>}

        <div className="links-container">
          <div>
            <Link to={`/${username}/albums`}>albums</Link>
          </div>
          <div>
            <Link to={`/${username}/books`}>books</Link>
          </div>
          <div>
            <Link to={`/${username}/movies`}>movies</Link>
          </div>
          <div>
            <Link to={`/${username}/games`}>games</Link>
          </div>
          <div>
            <Link to={`/${username}/followers`}>followers</Link>
          </div>
          <div>
            <Link to={`/${username}/following`}>following</Link>
          </div>
        </div>
        <h2>Recommendations</h2>
        <div>
          {heartAlbum || heartMovie || heartBook || heartGame ? (
            <div>
              <div style={styles.container}>
                {heartAlbum ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <Link to={`/${username}/albums/${heartAlbum.id}`}>
                          <img
                            src={heartAlbum.thumbnail}
                            style={{ width: '170px' }}
                          />
                        </Link>
                      </p>
                      <div>{heartAlbum.title}</div>
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
                            style={{ width: '150px' }}
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
                          <img
                            src={`https://covers.openlibrary.org/b/id/${heartBook.thumbnail}-L.jpg`}
                            style={{ width: '140px' }}
                          />
                        </Link>
                      </p>
                      <div>{heartBook.title}</div>
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
                            style={{ width: '150px' }}
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
            <div>{username} has not reviewed anything yet!</div>
          )}
          {/* {user.username} has reviewed{' '}
          <ul>
            <li>
              {albums.length > 1 ? (
                <div>{albums.length} albums</div>
              ) : (
                <div>{albums.length} album</div>
              )}
            </li>
            <li>
              with average rating of{' '}
              {albums.reduce((a, b) => a + b.rating, 0) / albums.length}
            </li>
          </ul> */}
        </div>
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
