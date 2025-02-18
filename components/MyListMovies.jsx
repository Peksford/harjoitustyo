import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';

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
    border: '2px solid rgb(255, 255, 255)',
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
    color: 'black',
  },
};

const MyListMovies = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  if (userData) {
    return (
      <>
        <UserMenu user={user} />
        <div>
          <h2>Movies/tv</h2>
        </div>
        <div style={styles.container}>
          {userData.movies.map((movie) => (
            <div key={movie.id} style={styles.card}>
              <Link
                data-testid="movieTest"
                to={`/${username}/movies/${movie.id}`}
              >
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
      </>
    );
  } else {
    // eslint-disable-next-line react/no-unescaped-entities
    return null;
  }
};

MyListMovies.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default MyListMovies;
