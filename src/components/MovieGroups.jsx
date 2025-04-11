import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import groupService from '../services/groups';
import { addGroup, updateGroup } from '../reducers/groupReducer';
import userService from '../services/users';
import { Link } from 'react-router-dom';
import tmdbLogo from '../assets/tmdbLogo.svg';

const styles = {
  movieContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  movieInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '140px',
    height: '170px',
    marginRight: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  sliderContainer: {
    marginTop: '10px',
  },
  slider: {
    width: '100%',
  },
  silderNumbers: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '14px',
  },
  rating: {
    margin: 0,
  },
  circle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const MovieGroups = ({ sortedMovies }) => {
  const [friend, setFriend] = useState('');
  const [followed, setFollowed] = useState(null);
  const [friends, setFriends] = useState([]);
  const [added, setAdded] = useState([]);

  const groups = useSelector((state) => state.groups);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return null;
      try {
        const response = await userService.getUser(user.username);
        setFollowed(response.followed);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [user]);

  const createGroup = async (groupObject) => {
    const groupResponse = await dispatch(addGroup(groupObject));

    await groupService.createMembers({
      group_id: groupResponse.id,
      user_id: Number(user.id),
    });

    for (const friend of friends) {
      await groupService.createMembers({
        group_id: groupResponse.id,
        user_id: Number(friend),
      });
    }
    const updatedGroup = await groupService.getGroup(groupResponse.id);

    updatedGroup.group_member = {
      group_id: updatedGroup.id,
      user_id: user.id,
    };
    dispatch(updateGroup(updatedGroup));

    setAdded([
      ...added,
      {
        tmdb_id: groupObject.tmdb_id,
        group_id: groupResponse.id,
      },
    ]);

    return groupObject;
  };

  console.log('groups', groups);

  return (
    <div>
      {sortedMovies &&
        sortedMovies.map((movie) => (
          <React.Fragment key={movie.id}>
            <div style={styles.movieContainer}>
              <img
                src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
                style={styles.thumbnail}
              />
              <div style={styles.movieInfo}>
                {movie.whole_title}
                <div>
                  {!groups.some((group) => group.item_id === movie.id) &&
                  !added.find(
                    (alreadyAdded) => alreadyAdded.tmdb_id === movie.tmdb_id
                  ) ? (
                    <Popup
                      trigger={
                        <button className="button-text">
                          Create a Rating club
                        </button>
                      }
                      modal
                      nested
                      onClose={() => setFriends([])}
                      contentStyle={{
                        background: 'transparent',
                        border: 'none',
                        width: '80%',
                        height: '50%',
                      }}
                    >
                      {(close) => (
                        <div
                          className="modal-container"
                          style={{
                            backgroundImage: `url(https://www.themoviedb.org/t/p/w1280/${movie.thumbnail})`,
                            backgroundSize: '30%',
                            // backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <div
                            className="modal-header"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              textAlign: 'center',
                              fontSize: '0.7rem',
                              padding: '5px 15px',
                              borderRadius: '10px',
                              width: '40%',
                            }}
                          >
                            &apos;{movie.whole_title}&apos; Rating club{' '}
                          </div>

                          <div>
                            <select
                              value={friend}
                              onChange={({ target }) => setFriend(target.value)}
                            >
                              <option value="">Invite a friend</option>
                              {followed &&
                                followed.map((user) => (
                                  <option
                                    key={user.id}
                                    value={user.followed_id}
                                  >
                                    {user.followed_username}
                                  </option>
                                ))}
                            </select>
                            <div>
                              <button
                                onClick={() =>
                                  !friends.find(
                                    (already) => already === friend
                                  ) &&
                                  setFriends((prevFriends) => [
                                    ...prevFriends,
                                    friend,
                                  ])
                                }
                                style={{
                                  marginTop: '10px',
                                  marginRight: '10px',
                                }}
                              >
                                Invite
                              </button>
                              {friends.length > 0 && (
                                <button
                                  onClick={() =>
                                    createGroup(
                                      {
                                        name: movie.whole_title,
                                        item_id: movie.id,
                                        item_type: 'movie',
                                        created_at: Date.now(),
                                        updated_at: Date.now(),
                                        friends: friends,
                                        tmdb_id: movie.tmdb_id,
                                      },
                                      close()
                                    )
                                  }
                                >
                                  Create a club
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            {friends.length > 0 && (
                              <div
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  textAlign: 'left',
                                  fontSize: '0.8rem',
                                  padding: '5px 15px',
                                  borderRadius: '10px',
                                  width: '100%',
                                  marginTop: '10px',
                                }}
                              >
                                Added:
                                {friends.map((friendId) => {
                                  const user = followed.find(
                                    (user) =>
                                      Number(user.followed_id) ===
                                      Number(friendId)
                                  );
                                  return user ? (
                                    <div key={user.followed_id}>
                                      {user.followed_username}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>

                          <div className="modal-actions">
                            <button onClick={() => close()}>Close</button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    <div>
                      {groups.find(
                        (item) => item.tmdb_id === movie.tmdb_id
                      ) && (
                        <Link
                          to={`/clubs/${
                            groups.find(
                              (item) => item.tmdb_id === movie.tmdb_id
                            )?.group_member?.group_id
                          }`}
                        >
                          <button style={{ padding: '10px' }}>
                            Into Da Club
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {movie.url && (
                  <p>
                    <a
                      href={`https://themoviedb.org/${
                        movie.type === 'tv' ? 'tv' : 'movie'
                      }/${movie.url}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        style={{
                          backgroundColor: '#0d253f',
                          //   padding: '6px 14px',
                          marginTop: '10px',
                        }}
                      >
                        <img
                          src={tmdbLogo}
                          style={{
                            width: '100%',
                            maxWidth: '70px',
                            height: 'auto',
                            backgroundColor: '#0d253f',
                            padding: '10px',
                            borderRadius: '8px',
                          }}
                        />
                      </button>
                    </a>
                  </p>
                )}
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
    </div>
  );
};

MovieGroups.propTypes = {
  sortedMovies: PropTypes.array,
  added: PropTypes.object,
};

export default MovieGroups;
