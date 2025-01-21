import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  card: {
    border: '1px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '150px',
    height: '200px',
    marginRight: '1rem',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: '110%',
    left: '46%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const MyListMovies = ({ movies, user }) => {
  if (!movies || movies.length === 0) {
    return <h2>No movies or tv added yet</h2>;
  }
  console.log('mylist', movies);
  return (
    <div style={styles.container}>
      {movies.map((movie) => (
        <div key={movie.id} style={styles.card}>
          <Link to={`${user.username}/${movie.id}`}>
            <img
              src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
              style={styles.thumbnail}
            />
          </Link>
          {movie.rating ? (
            <div style={styles.circle}>
              <span style={styles.circleText}>{movie.rating}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default MyListMovies;
