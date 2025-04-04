import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';
import userService from '../services/users';

const Following = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

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
  }, [username]);

  return (
    <div>
      <UserMenu />
      <h2>Following</h2>

      {userData && userData.followed.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {userData.followed.map((following) => (
            <li key={following.followed_id} style={{ marginBottom: '10px' }}>
              <Link to={`/${following.followed_username}`}>
                {following.followed_username}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

Following.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Following;
