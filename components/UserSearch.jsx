import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
    if (!name) return;
    if (!name) {
      setUserSearched([]);
      return;
    }
    const searchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${name}`
        );
        setUserSearched(response.data);
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

  {
    /* {user.username} has reviewed{' '}
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
          </ul> */
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
          {userSearched.albums && (
            <p>
              Reviewed {userSearched.albums.length} albums, with average rating
              of{' '}
              {albumRatings.reduce((a, b) => a + b.rating, 0) /
                albumRatings.length}
            </p>
          )}
          {userSearched.movies && (
            <p>
              Reviewed {userSearched.movies.length} movies, with average rating
              of{' '}
              {movieRatings.reduce((a, b) => a + b.rating, 0) /
                movieRatings.length}{' '}
            </p>
          )}
          {userSearched.books && (
            <p>
              Reviewed {userSearched.books.length} books, with average rating of{' '}
              {bookRatings.reduce((a, b) => a + b.rating, 0) /
                bookRatings.length}
            </p>
          )}
          {userSearched.games && (
            <p>
              Reviewed {userSearched.games.length} games, with average rating of{' '}
              {gameRatings.reduce((a, b) => a + b.rating, 0) /
                gameRatings.length}
            </p>
          )}
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
    <div style={{ width: '300px' }}>
      <input
        className="search-input"
        {...userInput}
        data-testid="Search user"
        placeholder="Search for an user"
      />
      <User userSearched={user} />
    </div>
  );
};

// User.propTypes = {
//   userSearched: PropTypes.object.isRequired,
// };

export default UserSearch;
