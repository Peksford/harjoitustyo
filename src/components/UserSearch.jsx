import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import userService from '../services/users';

const styles = {
  userContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  UserInfoAndButtons: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '200px',
    height: '250px',
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
};

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

const useUser = (name) => {
  const [userSearched, setUserSearched] = useState([]);

  useEffect(() => {
    if (!name) {
      setUserSearched([]);
      return;
    }
    if (!name) return;

    const searchUser = async () => {
      try {
        const response = await userService.getUser(name);
        setUserSearched(response);
      } catch (error) {
        console.error(error);
      }
    };

    searchUser();
  }, [name]);

  return userSearched;
};

const User = ({ userSearched }) => {
  if (userSearched === null || userSearched === undefined) {
    return <div>not found</div>;
  }

  const albumRatings = userSearched.albums
    ? userSearched.albums.filter((album) => album.rating !== null)
    : null;
  const movieRatings = userSearched.movies
    ? userSearched.movies.filter((movie) => movie.rating !== null)
    : null;
  const bookRatings = userSearched.books
    ? userSearched.books.filter((book) => book.rating !== null)
    : null;
  const gameRatings = userSearched.games
    ? userSearched.games.filter((game) => game.rating !== null)
    : null;

  return (
    <div style={styles.userContainer}>
      <div style={styles.UserInfoAndButtons}>
        <div style={styles.userInfo}>
          <h2>
            <Link to={`/${userSearched.username}`}>
              {userSearched.username}
            </Link>
          </h2>
          {userSearched.albums &&
            (userSearched.albums.length > 0 ? (
              <p>
                Reviewed {userSearched.albums.length} albums, with average
                rating of{' '}
                {Math.round(
                  (albumRatings.reduce((a, b) => a + b.rating, 0) /
                    albumRatings.length) *
                    100
                ) / 100 || 0}
              </p>
            ) : (
              ''
            ))}
          {userSearched.movies && (
            <p>
              Reviewed {userSearched.movies.length} movies, with average rating
              of{' '}
              {Math.round(
                (movieRatings.reduce((a, b) => a + b.rating, 0) /
                  movieRatings.length) *
                  100
              ) / 100 || 0}
            </p>
          )}
          {userSearched.books &&
            (userSearched.books.length > 0 ? (
              <p>
                Reviewed {userSearched.books.length} books, with average rating
                of{' '}
                {Math.round(
                  (bookRatings.reduce((a, b) => a + b.rating, 0) /
                    bookRatings.length) *
                    100
                ) / 100 || 0}
              </p>
            ) : (
              <p>Reviewed 0 books</p>
            ))}
          {userSearched.games &&
            (userSearched.games.length > 0 ? (
              <p>
                Reviewed {userSearched.games.length} games, with average rating
                of{' '}
                {Math.round(
                  (gameRatings.reduce((a, b) => a + b.rating, 0) /
                    gameRatings.length) *
                    100
                ) / 100 || 0}
              </p>
            ) : (
              <p>Reviewed 0 games</p>
            ))}
        </div>
      </div>
    </div>
  );
};

const UserSearch = () => {
  const userInput = useField('text');
  const debouncedUser = useDebounce(userInput.value, 1000);
  const user = useUser(debouncedUser);

  return (
    <>
      <div style={{ width: '70%' }}>
        <input
          className="search-input"
          {...userInput}
          data-testid="Search user"
          placeholder="Search for an user"
        />
        <User userSearched={user} />
      </div>
    </>
  );
};

User.propTypes = {
  userSearched: PropTypes.object.isRequired,
};

export default UserSearch;
