import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserMenu from './UserMenu';

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

const MyListMovies = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  // if (!movies || movies.length === 0) {
  //   return <h2>No movies added yet</h2>;
  // }

  console.log('MYLIST', username);
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
              <Link to={`/${username}/movies/${movie.id}`}>
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
    return <div>No movies yet :'(</div>;
  }
};

export default MyListMovies;
