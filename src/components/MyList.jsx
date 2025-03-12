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
    marginBottom: '50px',
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
            (album2) => album2.whole_title === album1.whole_title
          );
        })
      : null;

  const highestAlbums = userData
    ? [...userData.albums].sort((a, b) => b.rating - a.rating)
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

  const displayAlbums = userData
    ? mutual
      ? mutualAlbums
      : highest
      ? highestAlbums
      : startDate && endDate
      ? dateAdded
      : userData.albums
    : null;

  const handleDateChange = (date, field) => {
    if (field === 'start') {
      setStartDate(date);
    } else if (field === 'end') {
      setEndDate(date);
    }
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
                ? 'Mutual albums'
                : highest
                ? 'Highest rating'
                : 'All albums'
            }
          >
            <Dropdown.Item
              onClick={() => {
                setMutual(false);
                setHighest(false);
              }}
            >
              All albums
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setMutual(true);
                setHighest(false);
              }}
            >
              Mutual albums
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
        </div>

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
