import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import groupService from '../services/groups';
import { addGroup, updateGroup } from '../reducers/groupReducer';
import userService from '../services/users';
import { Link } from 'react-router-dom';
import discogsButton from '../assets/discogsButton.webp';
import { setNotification } from '../reducers/notificationReducer';

const styles = {
  albumContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  albumInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '150px',
    height: '150px',
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

const AlbumGroups = ({ sortedAlbums }) => {
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
        discogs_id: groupObject.discogs_id,
        group_id: groupResponse.id,
      },
    ]);

    return groupObject;
  };

  return (
    <div>
      {sortedAlbums &&
        sortedAlbums.map((album) => (
          <React.Fragment key={album.id}>
            <div style={styles.albumContainer}>
              <img src={album.thumbnail} style={styles.thumbnail} />
              <div style={styles.albumInfo}>
                {album.whole_title}
                <div>
                  {!groups.some(
                    (group) => group.discogs_id === album.discogs_id
                  ) &&
                  !added.find(
                    (alreadyAdded) =>
                      alreadyAdded.discogs_id === album.discogs_id
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
                            backgroundImage: `url(${album.thumbnail})`,
                            backgroundSize: '30%',
                            // backgroundRepeat: 'no-repeat',
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
                                // background: 'transparent',
                                // border: 'none',
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
                            &apos;{album.whole_title}&apos; Rating club{' '}
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

                              <button
                                onClick={() =>
                                  createGroup(
                                    {
                                      name: album.whole_title,
                                      item_id: album.id,
                                      item_type: 'album',
                                      created_at: Date.now(),
                                      updated_at: Date.now(),
                                      friends: friends,
                                      discogs_id: album.discogs_id,
                                      thumbnail: album.thumbnail,
                                    },
                                    close()
                                  )
                                }
                              >
                                Create a club
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
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    <div>
                      {groups.find(
                        (item) => item.discogs_id === album.discogs_id
                      ) && (
                        <Link
                          to={`/clubs/${
                            groups.find(
                              (item) => item.discogs_id === album.discogs_id
                            )?.id
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
                {album.url && (
                  <p>
                    <a
                      href={`https://www.discogs.com${album.url}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        style={{
                          backgroundColor: 'black',
                          padding: '6px 14px',
                          marginTop: '10px',
                        }}
                      >
                        <img
                          src={discogsButton}
                          style={{
                            width: '100%',
                            maxWidth: '60px',
                            height: 'auto',
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

AlbumGroups.propTypes = {
  sortedAlbums: PropTypes.array,
  added: PropTypes.object,
};

export default AlbumGroups;
