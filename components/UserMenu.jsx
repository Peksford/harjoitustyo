import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import followService from '../services/follow';

const UserMenu = (user) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [follow, setFollow] = useState(false);

  if (!username) return null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${username}`
        );

        setUserData(response.data);
        if (user.user && response.data) {
          const isFollowing = response.data.followers.some(
            (follower) => follower.follower_id === user.user.id
          );

          setFollow(isFollowing);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username, user]);

  const Follow = async (event) => {
    event.preventDefault();
    try {
      if (follow === false) {
        followService.newFollow(user, userData);
        setFollow(true);
      } else {
        followService.unFollow(user, userData);
        setFollow(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userData) {
    return (
      <>
        <h1>{username}</h1>
        {user.user && (
          <button onClick={Follow}>{follow ? 'Unfollow' : 'Follow'}</button>
        )}

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
