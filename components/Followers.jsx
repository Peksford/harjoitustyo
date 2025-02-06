import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Followers = (user) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  console.log('usernameanfadf', username);

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
  console.log('Follow', userData);
  return (
    <div>
      <UserMenu user={user} />
      <h2>Followers</h2>

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
    </div>
  );
};

export default Followers;
