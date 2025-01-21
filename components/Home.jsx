import SignUp from './SignUp';

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

const Home = ({ user, albums, movies, books }) => {
  console.log('user', user);
  // if (!albums || albums.length === 0) {
  //   return <h2>{`${user.username} has not reviewed anything yet`}!</h2>;
  // }

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

  console.log('albums here', albums);
  const heartAlbum = albums.find((album) => album.heart === true);
  const heartMovie = movies.find((movie) => movie.heart === true);
  const heartBook = books.find((book) => book.heart === true);

  if (user) {
    return (
      <>
        <h2>
          {user.username}'s top picks for {currentMonth()}!
        </h2>

        <div>
          {heartAlbum || heartMovie || heartBook ? (
            <div>
              <div style={styles.container}>
                {heartAlbum ? (
                  <div style={styles.item}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        <img
                          src={heartAlbum.thumbnail}
                          style={{ width: '170px' }}
                        />
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
                        <img
                          src={`https://www.themoviedb.org/t/p/w1280/${heartMovie.thumbnail}`}
                          style={{ width: '150px' }}
                        />
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
                        <img
                          src={`https://covers.openlibrary.org/b/id/${heartBook.thumbnail}-L.jpg`}
                          style={{ width: '140px' }}
                        />
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
              </div>
            </div>
          ) : (
            <div>{user.username} has not reviewed anything yet!</div>
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
  }
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default Home;
