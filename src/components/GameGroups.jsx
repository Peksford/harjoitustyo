import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import groupService from '../services/groups';
import { addGroup, updateGroup } from '../reducers/groupReducer';
import userService from '../services/users';
import { Link } from 'react-router-dom';
import igdbLogo from '../assets/IGDB_logo.svg.png';
import { setNotification } from '../reducers/notificationReducer';

const styles = {
  gameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '150px',
    height: '180px',
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

const GameGroups = ({ sortedGames }) => {
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
    dispatch(
      setNotification(`New rating club '${groupObject.name}' created`, 5)
    );
    setAdded([
      ...added,
      {
        igdb_id: groupObject.igdb_id,
        group_id: groupResponse.id,
      },
    ]);

    return groupObject;
  };

  return (
    <div>
      {sortedGames &&
        sortedGames.map((game) => (
          <React.Fragment key={game.id}>
            <div style={styles.gameContainer}>
              <img
                src={game.thumbnail.replace(/t_thumb/, 't_cover_big')}
                style={styles.thumbnail}
              />
              <div style={styles.gameInfo}>
                {game.whole_title}

                <div>
                  {!groups.some((group) => group.igdb_id === game.igdb_id) &&
                  !added.find(
                    (alreadyAdded) => alreadyAdded.igdb_id === game.igdb_id
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
                            position: 'relative',
                            backgroundImage: `url(${game.thumbnail.replace(
                              /t_thumb/,
                              't_cover_big'
                            )})`,
                            backgroundSize: '30%',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <div className="modal-actions">
                            <button
                              onClick={() => close()}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'black',
                                cursor: 'pointer',
                              }}
                            >
                              x
                            </button>
                          </div>
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
                            &apos;{game.whole_title}&apos; Rating club{' '}
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

                            <button
                              style={{ marginTop: '10px' }}
                              onClick={() =>
                                createGroup(
                                  {
                                    name: game.whole_title,
                                    item_id: game.id,
                                    item_type: 'game',
                                    created_at: Date.now(),
                                    updated_at: Date.now(),
                                    friends: friends,
                                    igdb_id: game.igdb_id,
                                    thumbnail: game.thumbnail,
                                  },
                                  close()
                                )
                              }
                            >
                              Create a club
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    <div>
                      {groups.find((item) => item.igdb_id === game.igdb_id) && (
                        <Link
                          to={`/clubs/${
                            groups.find((item) => item.igdb_id === game.igdb_id)
                              ?.id
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

                {game.url && (
                  <p>
                    <Link to={game.url}>
                      <img
                        src={igdbLogo}
                        style={{
                          width: '100%',
                          maxWidth: '80px',
                          height: 'auto',
                          marginTop: '10px',
                        }}
                      />
                    </Link>
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

GameGroups.propTypes = {
  sortedGames: PropTypes.array,
  added: PropTypes.object,
};

export default GameGroups;
