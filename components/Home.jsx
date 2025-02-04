import SignUp from './SignUp';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const Home = () => {
  const { username } = useParams();
  console.log('user', username);
  // if (!albums || albums.length === 0) {
  //   return <h2>{`${user.username} has not reviewed anything yet`}!</h2>;
  // }
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('does this render', username);
    const fetchUser = async () => {
      try {
        console.log('testing');
        const response = await axios.get(
          `http://localhost:3001/api/users/${username}`
        );
        console.log('reponse', response);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  console.log('user data', userData);

  const currentMonth = () => {
    const currentDate = new Date();
    console.log('Current date', currentDate);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[currentDate.getMonth()];
  };

  // console.log('albums here', userData.albums);
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

  if (userData) {
    return (
      <>
        <h1>{username}</h1>
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
    return <div>Not found</div>;
  }
};

export default Home;
