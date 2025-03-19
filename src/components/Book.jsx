import React from 'react';
import { useParams } from 'react-router-dom';
import bookService from '../services/books';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Heart from 'react-heart';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const Book = ({ onUpdateBook, createBook }) => {
  const { username, id } = useParams();
  const [bookData, setBookData] = useState('');
  const [rating, setRating] = useState(0);
  const [descriptionFetched, setDescriptionFetched] = useState(false);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleHeartClick = async () => {
    try {
      const updatedHeart = await bookService.heartClick(bookData.id, {
        ...bookData,
        heart: true,
      });

      setBookData(updatedHeart);
      setActive(updatedHeart.heart);

      if (onUpdateBook) {
        onUpdateBook(updatedHeart);
      }
    } catch (error) {
      console.error('error pressing heart', error);
    }
  };

  const changeRating = async (newRating) => {
    setRating(newRating);

    try {
      const updatedRating = await bookService.updatedBook(bookData.id, {
        ...bookData,
        rating: newRating,
      });
      setBookData(updatedRating);
      if (onUpdateBook) {
        onUpdateBook(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchBook = async () => {
      try {
        const book = await bookService.getBook(id);
        const user = await userService.getUserBooks(username);

        if (user[0].user_id === book.user_id) {
          setBookData(book);
          setActive(book.heart || false);
        } else {
          return null;
        }
        setRating(book.rating);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, [id, user]);

  const [description, setDescription] = useState([]);

  console.log('book data', bookData);

  if (bookData.source !== 'ISBNDB') {
    useEffect(() => {
      const releaseInfo = async () => {
        if (descriptionFetched) return;
        //   const token = import.meta.env.VITE_TOKEN;
        try {
          if (bookData) {
            const data = await axios.get(
              `https://openlibrary.org${bookData.url}.json`,
              {
                //   headers: {
                //     Authorization: `Discogs token=${token}`,
                //   },
              }
            );
            const fetchedDescription = data.data.description || '';
            setDescription(fetchedDescription);
            setDescriptionFetched(true);
          }
        } catch (error) {
          console.error(error);
        }
      };
      releaseInfo();
    }, [bookData, descriptionFetched]);
  }

  const deleteBook = async (id) => {
    try {
      setOpen(true);
      await bookService.deleteBook(id);
      setBookData(null);
      dispatch(
        setNotification(`${bookData.title} was removed from your list`, 5)
      );
      navigate(`/${username}/books`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createNew = async ({ bookData }) => {
    try {
      console.log('bobokad', bookData);
      if (bookData.source !== 'ISBNDB') {
        const newBook = await createBook({
          type: 'book',
          source: 'openLibrary',
          author: bookData.author || 'Unknown',
          title: bookData.title || 'Untitled',
          url: bookData.url,
          year: bookData.year || null,
          thumbnail: bookData.thumbnail,
          whole_title: bookData.whole_title,
          key: bookData.key,
          heart: false,
        });

        return newBook;
      } else {
        console.log('adding bookData', bookData);
        const newBook = await createBook({
          type: 'bookData',
          source: 'ISBNDB',
          author: bookData.author || 'Unknown',
          title: bookData.title || 'Untitled',
          url: bookData.url,
          year: bookData.year || null,
          thumbnail: bookData.thumbnail,
          whole_title: bookData.whole_title,
          key: bookData.key,
          synopsis: bookData.synopsis,
          heart: false,
        });

        return newBook;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <div>
          back to <Link to={`/${username}`}>{username}</Link> Home page
        </div>
      </div>
      <div className="container">
        <div style={styles.bookInfo}>
          <h2>{bookData.whole_title}</h2>
          <div>
            {username} added this on{' '}
            {new Date(bookData.createdAt).toLocaleDateString()}
          </div>
          <p data-testid="heart" style={{ width: '4rem' }}>
            <Heart isActive={active || false} onClick={handleHeartClick} />
          </p>
          <h3>{bookData.year}</h3>
          {description.value || bookData.synopsis ? (
            <p
              style={{
                fontSize: '14px',
                maxWidth: '400px',
                wordWrap: 'break-word',
              }}
            >
              {description.value
                ? description.value
                : bookData?.synopsis.replace(/<br\s*\/?>/g, '\n')}
            </p>
          ) : (
            <p
              style={{
                fontSize: '14px',
                maxWidth: '400px',
                wordWrap: 'break-end',
              }}
            >
              {description && description}
            </p>
          )}
          {bookData.user_id === (user?.id || 0) ? (
            <div style={styles.sliderContainer}>
              <label htmlFor="rating-slider">Your Rating</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={rating || 0}
                onChange={(e) => changeRating(parseFloat(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.silderNumbers}>
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          ) : null}
        </div>
        <div style={styles.thumbNailContainer}>
          {bookData.source !== 'ISBNDB' ? (
            <>
              <p>
                <a
                  href={`https://openlibrary.org${bookData.key}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  Open Library
                </a>
              </p>
              <img
                src={`https://covers.openlibrary.org/b/id/${bookData.thumbnail}-L.jpg`}
                style={styles.thumbnail}
              />
            </>
          ) : (
            <>
              <p>
                <a
                  href={`https://isbndb.com/book/${bookData.url}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  ISBNDB
                </a>
              </p>
              <img src={bookData.thumbnail} style={styles.thumbnail} />
            </>
          )}

          {bookData.rating ? (
            <div>
              {/* {bookData.user_id}'s rating */}
              <div style={styles.circle}>
                <span style={styles.circleText}>{bookData.rating}</span>
              </div>
            </div>
          ) : null}
          <div style={styles.buttonContainer}></div>
          <div>
            {user && user.id === bookData.user_id ? (
              <>
                <button onClick={handleClickOpen}>Remove</button>

                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {`Do you want to remove ${bookData.title} from your list?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={() => deleteBook(bookData.id)} autoFocus>
                      {' '}
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <>
                <button
                  onClick={() => createNew({ bookData })}
                  className="button-text"
                >
                  Add to your list
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  bookContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  bookInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '100px',
  },
  thumbNailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    width: '240px',
    height: '300px',
    // objectFit: 'cover',
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
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  circle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

Book.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateBook: PropTypes.func,
  createBook: PropTypes.func.isRequired,
};

export default Book;
