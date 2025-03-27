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
import igdbLogo from '../assets/IGDB_logo.svg.png';

const styles = {
  card: {
    maxWidth: '150px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '120px',
    height: '170px',
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

const MyListGames = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [mutual, setMutual] = useState(false);
  const [highest, setHighest] = useState(false);
  const userGames = useSelector((state) => state.games);
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
  }, [username, userGames]);

  const mutualGames =
    userData && userGames
      ? userData.games.filter((game1) => {
          return userGames.some(
            (game2) => game2.whole_title === game1.whole_title
          );
        })
      : null;

  const highestGames = userData
    ? [...userData.games].sort((a, b) => b.rating - a.rating)
    : null;

  const dateAdded = userData
    ? userData.games.filter((game) => {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const addedDate = new Date(game.createdAt);
        if (startDate && addedDate < startDate) return false;
        if (endOfDay && addedDate > endOfDay) return false;
        return true;
      })
    : null;

  const sortedByYearGames = userData
    ? [...userData.games].sort((a, b) => b.release_date - a.release_date)
    : null;

  const alphabeticalGames = userData
    ? [...userData.games].sort((a, b) =>
        a.whole_title.localeCompare(b.whole_title)
      )
    : null;

  const searchGame = (searchWord) => {
    if (!userData) return [];
    const searchedGame = userData.games.filter((game) =>
      game.whole_title.toLowerCase().includes(searchWord.toLowerCase())
    );
    return searchedGame;
  };

  const displayGames = userData
    ? mutual
      ? mutualGames
      : highest
      ? highestGames
      : startDate && endDate
      ? dateAdded
      : alphabetical
      ? alphabeticalGames
      : searchWord
      ? searchGame(searchWord)
      : sortedByYear
      ? sortedByYearGames
      : userData.games
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
        {/* <UserMenu user={user} /> */}
        <div style={{ marginTop: '20px' }}>
          <DropdownButton
            id="dropdown-secondary-button"
            // data-testid="dropdown-list"
            title={
              mutual
                ? 'Mutual games'
                : highest
                ? 'Highest rating'
                : alphabetical
                ? 'A-Ö'
                : 'All games'
            }
          >
            <Dropdown.Item
              onClick={() => {
                setMutual(false);
                setHighest(false);
              }}
            >
              All games
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setMutual(true);
                setHighest(false);
              }}
            >
              Mutual games
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
          <img
            src={igdbLogo}
            style={{
              width: '100%',
              maxWidth: '100px',
              height: 'auto',
              marginTop: '10px',
            }}
          />
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
              data-testid="Search game"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="album-container">
          {displayGames.map((game) => (
            <div key={game.id} style={styles.card}>
              <Link
                data-testid="gameTest"
                to={`/${userData.username}/games/${game.id}`}
              >
                {game.thumbnail && (
                  <img
                    src={game.thumbnail.replace(/t_thumb/, 't_cover_big')}
                    style={styles.thumbnail}
                  />
                )}

                {/* <img src={game.thumbnail} style={styles.thumbnail} /> */}
              </Link>
              <div>{game.title}</div>
              {game.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{game.rating}</span>
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

MyListGames.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default MyListGames;
