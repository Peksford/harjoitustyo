import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';
import userService from '../services/users';

const Followers = ({ user }) => {
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

  if (userData) {
    return (
      <>
        <UserMenu user={user} />
        <div>
          <h2>Followers</h2>
        </div>
        {userData && userData.followers.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {userData.followers.map((follower) => (
              <li key={follower.follower_id} style={{ marginBottom: '10px' }}>
                <Link to={`/${follower.follower_username}`}>
                  {follower.follower_username}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  } else {
    return null;
  }
};

Followers.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Followers;
