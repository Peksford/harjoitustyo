import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import followService from '../services/follow';
import userService from '../services/users';
import { useSelector } from 'react-redux';

const UserMenu = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [follow, setFollow] = useState(false);

  const user = useSelector((state) => state.user);

  if (!username) return null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUser(username);
        setUserData(response);
        if (user && response) {
          const isFollowing = response.followers.some(
            (follower) => follower.follower_id === user.id
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
        <h1>{username} </h1>
        {user && (
          <button onClick={Follow}>{follow ? 'Unfollow' : 'Follow'}</button>
        )}

        <div className="links-container">
          {/* <div>
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
          </div> */}
          <div>
            <Link to={`/${username}/followers`}>
              Followers ({userData.followers.length})
            </Link>
          </div>
          <div>
            <Link to={`/${username}/following`}>
              Following ({userData.followed.length})
            </Link>
          </div>
          {/* <div>
            <Link to={`/${username}`}>Recommendations</Link>
          </div> */}
        </div>
      </>
    );
  }
};

export default UserMenu;
