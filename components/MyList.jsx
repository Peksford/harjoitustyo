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
    border: '1px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '150px',
    height: '150px',
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

const MyList = ({ user }) => {
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

  const mutualAlbums =
    userData && loggedInUserData
      ? userData.albums.filter((album1) => {
          return loggedInUserData.albums.some(
            (album2) => album2.whole_title === album1.whole_title
          );
        })
      : null;

  const highestAlbums = userData
    ? [...userData.albums].sort((a, b) => b.rating - a.rating)
    : null;

  const displayAlbums = userData
    ? mutual
      ? mutualAlbums
      : highest
      ? highestAlbums
      : userData.albums
    : null;

  if (userData) {
    return (
      <>
        <UserMenu user={user} />
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
        </div>
        <div style={styles.container}>
          {displayAlbums.map((album) => (
            <div key={album.id} style={styles.card}>
              <Link
                data-testid="albumTest"
                to={`/${username}/albums/${album.id}`}
              >
                <img src={album.thumbnail} style={styles.thumbnail} />
              </Link>
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
