import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../services/users';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import tmdbLogo from '../assets/tmdbLogo.svg';

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

const MyListMovies = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [mutual, setMutual] = useState(false);
  const [highest, setHighest] = useState(false);
  const userMovies = useSelector((state) => state.movies);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alphabetical, setAlphabetical] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [sortedByYear, setSortedByYear] = useState(false);

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
  }, [username, userMovies]);

  const mutualMovies =
    userData && userMovies
      ? userData.movies.filter((movie1) => {
          return userMovies.some(
            (movie2) => movie2.whole_title === movie1.whole_title
          );
        })
      : null;

  const highestMovies = userData
    ? [...userData.movies].sort((a, b) => b.rating - a.rating)
    : null;

  const dateAdded = userData
    ? userData.movies.filter((movie) => {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const addedDate = new Date(movie.createdAt);
        if (startDate && addedDate < startDate) return false;
        if (endOfDay && addedDate > endOfDay) return false;
        return true;
      })
    : null;

  const sortedByYearMovies = userData
    ? [...userData.movies].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      )
    : null;

  const alphabeticalMovies = userData
    ? [...userData.movies].sort((a, b) =>
        a.whole_title.localeCompare(b.whole_title)
      )
    : null;

  const searchMovie = (searchWord) => {
    if (!userData) return [];
    const searchedMovie = userData.movies.filter((movie) =>
      movie.whole_title.toLowerCase().includes(searchWord.toLowerCase())
    );
    return searchedMovie;
  };

  const displayMovies = userData
    ? mutual
      ? mutualMovies
      : highest
      ? highestMovies
      : startDate && endDate
      ? dateAdded
      : alphabetical
      ? alphabeticalMovies
      : searchWord
      ? searchMovie(searchWord)
      : sortedByYear
      ? sortedByYearMovies
      : userData.movies
    : null;

  const handleDateChange = (date, field) => {
    if (field === 'start') {
      setStartDate(date);
    } else if (field === 'end') {
      setEndDate(date);
    }
  };

  const onChange = (event) => {
    setSearchWord(event.target.value);
  };

  if (userData) {
    return (
      <>
        <div style={{ marginTop: '20px' }}>
          <DropdownButton
            id="dropdown-secondary-button"
            title={
              mutual
                ? 'Mutual movies'
                : highest
                ? 'Highest rating'
                : alphabetical
                ? 'A-Ö'
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
            <Dropdown.Item
              onClick={() => {
                setHighest(false);
                setMutual(false);
                setAlphabetical(true);
              }}
            >
              A-Ö
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(false);
                setMutual(false);
                setAlphabetical(false);
                setSortedByYear(true);
              }}
            >
              Newest releases
            </Dropdown.Item>
          </DropdownButton>
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            Sort by addition date:{' '}
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, 'start')}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
            <span> - </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, 'end')}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
          <div style={{ width: '50%' }}>
            <input
              className="search-input"
              onChange={onChange}
              value={searchWord}
              data-testid="Search movie"
              placeholder="Search"
            />
          </div>
        </div>
        <Link to={'https://www.themoviedb.org/'}>
          <img
            src={tmdbLogo}
            style={{
              width: '100%',
              maxWidth: '70px',
              height: 'auto',
              backgroundColor: '#0d253f',
              padding: '10px',
              borderRadius: '8px',
              marginTop: '10px',
            }}
          />
        </Link>
        <h1>{username}&apos;s movies and tv</h1>
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
