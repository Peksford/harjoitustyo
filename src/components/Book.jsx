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
import isbndbLogo from '../assets/isbndb.png';
import openLibraryLogo from '../assets/openLibrarylogo.png';
import { bookHeart } from '../reducers/bookReducer';

const Book = ({ onUpdateBook, createBook }) => {
  const { username, id } = useParams();
  const [bookData, setBookData] = useState('');
  const [rating, setRating] = useState(0);
  const [descriptionFetched, setDescriptionFetched] = useState(false);
  const [description, setDescription] = useState([]);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openHeart, setOpenHeart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const books = useSelector((state) => state.books);

  useEffect(() => {
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
  }, [id, username]);

  useEffect(() => {
    const releaseInfo = async () => {
      if (descriptionFetched) return;
      try {
        if (bookData.source === 'openLibrary') {
          const data = await axios.get(
            `https://openlibrary.org${bookData.url}.json`
          );
          const fetchedDescription = data?.data?.description || '';
          setDescription(fetchedDescription);
          setDescriptionFetched(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    releaseInfo();
  }, [bookData, descriptionFetched]);

  if (!bookData) return null;
  if (!user) return null;

  const handleHeartClick = async () => {
    try {
      setOpenHeart(true);
      const updatedHeart = await bookService.heartClick(bookData.id, {
        ...bookData,
        heart: true,
      });

      setBookData(updatedHeart);
      setActive(updatedHeart.heart);
      dispatch(bookHeart(bookData));

      if (onUpdateBook) {
        onUpdateBook(updatedHeart);
      }
      setOpenHeart(false);
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

  const handleClickHeartOpen = () => {
    setOpenHeart(true);
  };
  const handleHeartClose = () => {
    setOpenHeart(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveConfirm = () => {
    deleteBook(bookData.id);
    setOpen(false);
  };

  const createNew = async ({ bookData }) => {
    try {
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
        const newBook = await createBook({
          type: 'book',
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
      <div>
        <div style={styles.bookInfo}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h2>{bookData?.whole_title}</h2>

            <div
              data-testid="heart"
              style={{
                width: '3.5rem',
                marginLeft: '10px',
              }}
            >
              <Heart
                isActive={active || false}
                onClick={() => {
                  if (!books.find((album) => album.heart === true)) {
                    handleClickHeartOpen();
                  } else {
                    dispatch(
                      setNotification(
                        `You have already selected book of the week`,
                        5
                      )
                    );
                  }
                }}
                style={{
                  fontSize: '3rem',
                  display: 'block',
                  textAlign: 'cenSorrter',
                }}
              />
              <Dialog
                open={openHeart}
                onClose={handleHeartClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {`Do you want to make ${bookData.title} your book of the week?`}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleHeartClose}>No</Button>
                  <Button onClick={handleHeartClick} autoFocus>
                    {' '}
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <h3>{<i>{bookData.year}</i>}</h3>
          {bookData?.source === 'openLibrary' ? (
            <>
              <p>
                <a
                  href={`https://openlibrary.org${bookData.key}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={openLibraryLogo}
                    style={{
                      width: '100%',
                      maxWidth: '100px',
                      height: 'auto',
                      backgroundColor: 'white',
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  />
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
                  <img
                    src={isbndbLogo}
                    style={{
                      width: '100%',
                      maxWidth: '100px',
                      height: 'auto',
                      backgroundColor: 'black',
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  />
                </a>
              </p>
              <img src={bookData.thumbnail} style={styles.thumbnail} />
            </>
          )}

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
          {bookData?.user_id === (user?.id || 0) ? (
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
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          ) : null}
        </div>
        <div style={styles.thumbNailContainer}>
          {bookData.rating ? (
            <div>
              <div style={styles.circle}>
                <span style={styles.circleText}>{bookData.rating}</span>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          {username} added this on{' '}
          {new Date(bookData.createdAt).toLocaleDateString()}
        </div>

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
                  <Button onClick={handleRemoveConfirm} autoFocus>
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
  },
  thumbNailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    width: '240px',
    height: '300px',
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
