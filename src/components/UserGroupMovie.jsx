import React from 'react';
import { useParams, Link } from 'react-router-dom';
import groupService from '../services/groups';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import movieService from '../services/movies';
import userService from '../services/users';
import GroupComments from './GroupComments';

const UserGroupMovie = ({ onUpdateGroup, createMovie }) => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState('');
  const [rating, setRating] = useState(0);
  const [movie, setMovie] = useState(null);
  const [userMovies, setUserMovies] = useState([]);
  const [followed, setFollowed] = useState(null);
  const [friend, setFriend] = useState('');
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const group = await groupService.getGroup(id);
        setGroupData(group);
        return group;
      } catch (error) {
        console.error(error);
      }
    };
    fetchGroup();
  }, [id]);

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

  useEffect(() => {
    if (groupData) {
      try {
        const fetchMovie = async () => {
          const response = await movieService.getMovie(groupData?.item_id);
          setMovie(response);
        };
        fetchMovie();
      } catch (error) {
        console.error(error);
      }
    }
  }, [groupData?.item_id]);

  useEffect(() => {
    const fetchOtherUserMovies = async () => {
      try {
        if (groupData) {
          const fetchedMovies = [];

          for (const member of groupData.group_members) {
            const userMovie = await userService.getUserMovies(
              member.user.username
            );
            fetchedMovies.push(userMovie);
          }

          setUserMovies(fetchedMovies);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };
    fetchOtherUserMovies();
  }, [groupData, movie]);

  const changeRating = async (newRating) => {
    setRating(newRating);

    const movieId = userMovies
      .flat()
      .find(
        (item) => item.tmdb_id === movie.tmdb_id && item.user_id === user.id
      );

    try {
      const updatedRating = await movieService.updatedMovie(movieId.id, {
        ...groupData,
        rating: newRating,
      });

      setMovie(updatedRating);

      if (onUpdateGroup) {
        onUpdateGroup(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNew = async ({ movie }) => {
    try {
      const newMovie = await createMovie({
        type: 'movie',
        title: movie.title,
        url: movie.url,
        release_date: movie.release_date,
        thumbnail: movie.thumbnail,
        whole_title: movie.whole_title,
        discogs_id: movie.discogs_id,
        heart: false,
        rating: null,
        tmdb_id: movie.tmdb_id,
        overview: movie.overview,
        pick_of_the_week: null,
      });
      setMovie(newMovie);
      return newMovie;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const inviteFriend = async ({ friend }) => {
    await groupService.createMembers({
      group_id: groupData.id,
      user_id: Number(friend),
    });
    const updatedGroup = await groupService.getGroup(groupData.id);
    setGroupData(updatedGroup);
  };

  let groupUserMovies = [];

  for (const user of userMovies) {
    const groupUserMovie = user.find(
      (movie) => movie.tmdb_id === groupData.tmdb_id
    );
    groupUserMovies.push(groupUserMovie);
  }

  if (groupData) {
    return (
      <div>
        <div style={styles.groupInfo}>
          <h2>{groupData.name}</h2>
          <div>
            created: {new Date(groupData.createdAt).toLocaleDateString()}
          </div>
          {
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {movie && (
                <img
                  src={`https://www.themoviedb.org/t/p/w1280/${movie.thumbnail}`}
                  style={styles.thumbnail}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '200px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff8dc',
                    padding: '10px',
                    borderRadius: '10px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '80%',
                  }}
                >
                  Club members:
                  {groupData.group_members.map((member) => (
                    <div key={member.id}>
                      {
                        <Link to={`/${member.user.username}`}>
                          {member.user.username}
                        </Link>
                      }
                    </div>
                  ))}
                </div>
                {movies &&
                movies.find((item) => item?.tmdb_id === movie?.tmdb_id) ? (
                  <Popup
                    trigger={
                      <button
                        style={{ padding: '5px', width: '50%' }}
                        className="button-text"
                      >
                        Rate
                      </button>
                    }
                    modal
                    nested
                    contentStyle={{
                      maxWidth: '95vw',
                      width: '600px',
                    }}
                  >
                    {(close) => (
                      <div className="modal-container">
                        <div className="modal-header">{movie.title}</div>
                        {movie && (
                          <div style={styles.circle}>
                            <span style={styles.circleText}>
                              {movie.rating}
                            </span>
                          </div>
                        )}

                        <div className="modal-content">
                          <div style={styles.sliderContainer}>
                            <label htmlFor="rating-slider">Your Rating</label>
                            <div>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={rating || 0}
                                onChange={(e) =>
                                  changeRating(parseFloat(e.target.value))
                                }
                                style={styles.slider}
                              />
                              <div style={styles.silderNumbers}>
                                {[...Array(11).keys()].map((num) => (
                                  <span key={num}>{num}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-actions">
                          <button className="close-btn" onClick={() => close()}>
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </Popup>
                ) : (
                  <button
                    onClick={() => createNew({ movie })}
                    className="button-text"
                  >
                    Add
                  </button>
                )}
                <select
                  style={{ marginTop: '10px', width: '70%' }}
                  value={friend}
                  onChange={({ target }) => setFriend(target.value)}
                >
                  <option value="">Invite a friend</option>
                  {followed &&
                    followed.map((user) => (
                      <option key={user.id} value={user.followed_id}>
                        {user.followed_username}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => inviteFriend({ friend })}
                  style={{
                    width: '50%',
                    marginTop: '10px',
                  }}
                >
                  Invite
                </button>
              </div>
            </div>
          }
          {groupUserMovies &&
            groupUserMovies.map((member) =>
              member ? (
                <div key={member.id}>
                  {member.rating ? (
                    <>
                      <div>
                        <Link
                          to={`/${
                            groupData.group_members.find(
                              (group_member) =>
                                group_member.user_id === member.user_id
                            ).user.username
                          }`}
                        >
                          {
                            groupData.group_members.find(
                              (group_member) =>
                                group_member.user_id === member.user_id
                            ).user.username
                          }
                        </Link>{' '}
                        gave this
                      </div>
                      <div style={styles.circle}>
                        {member.rating}
                        <hr />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null
            )}
        </div>
        <GroupComments />
      </div>
    );
  }
};

const styles = {
  groupContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  groupInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10%',
  },
  thumbNailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    width: '50%',
    height: '50%',
    objectFit: 'cover',
    marginBottom: '8px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sliderContainer: {
    marginTop: '10px',
  },
  slider: {
    width: '100%',
    margin: '0 auto',
    display: 'block',
  },
  silderNumbers: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '14px',
    width: '100%',
  },
  rating: {
    margin: 0,
  },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  circle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

UserGroupMovie.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateGroup: PropTypes.func,
  createMovie: PropTypes.func.isRequired,
};

export default UserGroupMovie;
