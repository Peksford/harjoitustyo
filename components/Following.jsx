import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Following = (user) => {
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
  console.log('Following', userData);
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

export default Following;
