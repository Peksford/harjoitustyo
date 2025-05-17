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

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '5px',
    width: '150px',
    marginBottom: '65px',
    paddingBottom: '1px',
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
  },
  circle: {
    position: 'absolute',
    bottom: '5px',
    top: '115%',
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
  title: {
    textAlign: 'center',
    wordWrap: 'break-word',
  },
};

const MyList = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [mutual, setMutual] = useState(false);
  const [highest, setHighest] = useState(false);
  const userAlbums = useSelector((state) => state.albums);
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
  }, [username, userAlbums]);

  const mutualAlbums =
    userData && userAlbums
      ? userData.albums.filter((album1) => {
          return userAlbums.some(
            (album2) => album2.discogs_id === album1.discogs_id
          );
        })
      : null;

  const highestAlbums = userData
    ? [...userData.albums].sort((a, b) => b.rating - a.rating)
    : null;

  const sortedByYearAlbums = userData
    ? [...userData.albums].sort((a, b) => b.year - a.year)
    : null;

  const dateAdded = userData
    ? userData.albums.filter((album) => {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const addedDate = new Date(album.createdAt);
        if (startDate && addedDate < startDate) return false;
        if (endOfDay && addedDate > endOfDay) return false;
        return true;
      })
    : null;

  const alphabeticalAlbums = userData
    ? [...userData.albums].sort((a, b) =>
        a.whole_title.localeCompare(b.whole_title)
      )
    : null;

  const searchAlbum = (searchWord) => {
    if (!userData) return [];
    const searchedAlbum = userData.albums.filter((album) =>
      album.whole_title.toLowerCase().includes(searchWord.toLowerCase())
    );
    return searchedAlbum;
  };

  const displayAlbums = userData
    ? mutual
      ? mutualAlbums
      : highest
      ? highestAlbums
      : startDate && endDate
      ? dateAdded
      : alphabetical
      ? alphabeticalAlbums
      : searchWord
      ? searchAlbum(searchWord)
      : sortedByYear
      ? sortedByYearAlbums
      : userData.albums
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
                ? 'Mutual albums'
                : highest
                ? 'Highest rating'
                : alphabetical
                ? 'A-Ö'
                : 'All albums'
            }
          >
            <Dropdown.Item
              onClick={() => {
                setMutual(false);
                setHighest(false);
                setAlphabetical(false);
              }}
            >
              All albums
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setMutual(true);
                setHighest(false);
                setAlphabetical(false);
              }}
            >
              Mutual albums
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(true);
                setMutual(false);
                setAlphabetical(false);
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
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <input
              className="search-input"
              onChange={onChange}
              value={searchWord}
              data-testid="Search album"
              placeholder="Search"
            />
          </div>
        </div>
        <h1>{username}&apos;s albums</h1>
        <div className="album-container">
          {displayAlbums.map((album) => (
            <div key={album.id} style={styles.card}>
              <Link
                data-testid="albumTest"
                to={`/${username}/albums/${album.id}`}
              >
                <img src={album.thumbnail} style={styles.thumbnail} />
              </Link>
              <div style={styles.title}>{album.whole_title}</div>
              {album.year && (
                <div>
                  <i>{album.year}</i>
                </div>
              )}
              {album.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{album.rating}</span>
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

MyList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default MyList;
