import React from 'react';
import { useParams } from 'react-router-dom';
import groupService from '../services/groups';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import bookService from '../services/books';
import userService from '../services/users';
import GroupComments from './GroupComments';

const UserGroupBook = ({ onUpdateGroup, createBook }) => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState('');
  const [rating, setRating] = useState(0);
  const [book, setBook] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [followed, setFollowed] = useState(null);
  const [friend, setFriend] = useState('');
  const user = useSelector((state) => state.user);
  const books = useSelector((state) => state.books);

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
        const fetchBook = async () => {
          const response = await bookService.getBook(groupData?.item_id);
          setBook(response);
        };
        fetchBook();
      } catch (error) {
        console.error(error);
      }
    }
  }, [groupData?.item_id]);

  useEffect(() => {
    const fetchOtherUserBooks = async () => {
      try {
        if (groupData) {
          const fetchedBooks = [];

          for (const member of groupData.group_members) {
            const userBook = await userService.getUserBooks(
              member.user.username
            );
            fetchedBooks.push(userBook);
          }

          setUserBooks(fetchedBooks);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };
    fetchOtherUserBooks();
  }, [groupData, book]);

  const changeRating = async (newRating) => {
    setRating(newRating);

    try {
      const updatedRating = await bookService.updatedBook(book.id, {
        ...groupData,
        rating: newRating,
      });

      setBook(updatedRating);

      if (onUpdateGroup) {
        onUpdateGroup(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNew = async ({ book }) => {
    try {
      const newBook = await createBook({
        type: 'book',
        title: book.title,
        url: book.url,
        release_date: book.release_date,
        thumbnail: book.thumbnail,
        whole_title: book.whole_title,
        discogs_id: book.discogs_id,
        heart: false,
        rating: null,
        tmdb_id: book.tmdb_id,
        overview: book.overview,
        pick_of_the_week: null,
      });
      setBook(newBook);
      return newBook;
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

  let groupUserBooks = [];

  for (const user of userBooks) {
    const groupUserBook = user.find((book) => book.key === groupData.book_id);
    groupUserBooks.push(groupUserBook);
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
              {book?.source === 'ISBNDB' ? (
                <img src={book.thumbnail} style={styles.thumbnail} />
              ) : (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book?.thumbnail}-L.jpg`}
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
                    <div key={member.id}>{member.user.username}</div>
                  ))}
                </div>
                {books &&
                books.find((item) => item?.tmdb_id === book?.tmdb_id) ? (
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
                        <div className="modal-header">{book?.title}</div>
                        {book && (
                          <div style={styles.circle}>
                            <span style={styles.circleText}>{book.rating}</span>
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
                    onClick={() => createNew({ book })}
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
          {groupUserBooks &&
            groupUserBooks.map((member) =>
              member ? (
                <div key={member.id}>
                  {member.rating ? (
                    <>
                      <div>
                        {
                          groupData.group_members.find(
                            (group_member) =>
                              group_member.user_id === member.user_id
                          ).user.username
                        }{' '}
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

UserGroupBook.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateGroup: PropTypes.func,
  createBook: PropTypes.func.isRequired,
};

export default UserGroupBook;
