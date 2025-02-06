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
    width: '170px',
    height: '170px',
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

const MyList = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  // if (!albums || albums.length === 0) {
  //   return <h2>No albums added yet</h2>;
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
          <h2>Albums</h2>
        </div>
        <div style={styles.container}>
          {userData.albums.map((album) => (
            <div key={album.id} style={styles.card}>
              <Link to={`/${username}/albums/${album.id}`}>
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
    // eslint-disable-next-line react/no-unescaped-entities
    return <div>No albums yet :'(</div>;
  }
};

export default MyList;
