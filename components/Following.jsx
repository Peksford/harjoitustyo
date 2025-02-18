import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';

const Following = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  return (
    <div>
      <UserMenu user={user} />
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
