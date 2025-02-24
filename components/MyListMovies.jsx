import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
  container: {
    display: 'flex',
  },
  card: {
    maxWidth: '150px',

    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '130px',
    height: '180px',
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
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [mutual, setMutual] = useState(false);
  const [highest, setHighest] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${username}`
        );

        const loggedInResponse = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${user.username}`
        );

        setUserData(response.data);
        setLoggedInUserData(loggedInResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  const mutualMovies =
    userData && loggedInUserData
      ? userData.movies.filter((movie1) => {
          return loggedInUserData.movies.some(
            (movie2) => movie2.whole_title === movie1.whole_title
          );
        })
      : null;

  const highestMovies = userData
    ? [...userData.movies].sort((a, b) => b.rating - a.rating)
    : null;

  const displayMovies = userData
    ? mutual
      ? mutualMovies
      : highest
      ? highestMovies
      : userData.movies
    : null;

  if (userData) {
    return (
      <>
        {/* <UserMenu user={user} /> */}
        <div style={{ marginTop: '20px' }}>
          <DropdownButton
            id="dropdown-secondary-button"
            // data-testid="dropdown-list"
            title={
              mutual
                ? 'Mutual movies'
                : highest
                ? 'Highest rating'
                : 'All movies'
            }
          >
            <Dropdown.Item
              onClick={() => {
                setMutual(false);
                setHighest(false);
              }}
            >
              All movies
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setMutual(true);
                setHighest(false);
              }}
            >
              Mutual movies
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(true);
                setMutual(false);
              }}
            >
              Highest rating
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="album-container">
          {displayMovies.map((movie) => (
            <div key={movie.id} style={styles.card}>
              <Link
                data-testid="movieTest"
                to={`/${userData.username}/movies/${movie.id}`}
              >
                {movie.thumbnail && (
                  <img
                    src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
                    style={styles.thumbnail}
                  />
                )}
                {/* <img src={movie.thumbnail} style={styles.thumbnail} /> */}
              </Link>
              <div>{movie.title}</div>
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
    return null;
  }
};

MyListMovies.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default MyListMovies;
