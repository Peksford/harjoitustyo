import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import followService from '../services/follow';

const UserMenu = (user) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  const testi = async (event) => {
    event.preventDefault();
    try {
      console.log('sending follow data', userData);
      followService.newFollow(user, userData);
    } catch (error) {
      console.error(error);
    }
    console.log('testing button home page');
  };

  if (userData) {
    return (
      <>
        <h1>{username}</h1>
        {user && <button onClick={testi}> Follow</button>}

        <div className="links-container">
          <div>
            <Link to={`/${username}`}>recommendations</Link>
          </div>
          <div>
            <Link to={`/${username}/albums`}>albums</Link>
          </div>
          <div>
            <Link to={`/${username}/books`}>books</Link>
          </div>
          <div>
            <Link to={`/${username}/movies`}>movies</Link>
          </div>
          <div>
            <Link to={`/${username}/games`}>games</Link>
          </div>
          <div>
            <Link to={`/${username}/followers`}>followers</Link>
          </div>
          <div>
            <Link to={`/${username}/following`}>following</Link>
          </div>
        </div>
      </>
    );
  }
};

export default UserMenu;
