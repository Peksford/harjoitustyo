import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import bookService from '../services/books';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const styles = {
  bookContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  BookInfoAndButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  bookInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '200px',
    height: '340px',
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
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

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

const useBook = (name) => {
  const [bookSearched, setBookSearched] = useState([]);

  useEffect(() => {
    if (!name) {
      setBookSearched([]);
      return;
    }
    const searchBook = async () => {
      try {
        const response = await axios.get(
          'https://im-only-rating.fly.dev/api/books/search-book',
          {
            params: {
              name: name,
            },
          }
        );

        setBookSearched(response.data.docs);
      } catch (error) {
        console.error(error);
      }
    };

    searchBook();
  }, [name]);

  return bookSearched;
};

const Book = ({ bookSearched, createBook }) => {
  if (bookSearched === null || bookSearched === undefined) {
    return <div>not found</div>;
  }

  const [addedBooks, setAddedBooks] = useState([]);
  const [ratings, setRatings] = useState({});

  const createNew = async ({ book }) => {
    try {
      const newBook = await createBook({
        author: book.author_name?.[0] || 'Unknown',
        title: book.title || 'Untitled',
        url: book.key,
        year: book.first_publish_year || null,
        thumbnail: book.cover_i,
        whole_title: book.author_name[0] + ' - ' + book.title,
        key: book.key,
        heart: false,
      });
      newBook && setAddedBooks((prevBooks) => [...prevBooks, newBook]);

      return addedBooks;
    } catch (error) {
      console.error(error);
    }
  };

  const changeRating = async (newRating, addedBook) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [addedBook.id]: newRating,
    }));
    if (!addedBook) return;

    try {
      const updatedBook = await bookService.updatedBook(addedBook.id, {
        ...addedBook,
        rating: newRating,
      });
      setAddedBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {bookSearched.map((book) => {
        const alreadyAdded =
          addedBooks.length > 0 &&
          addedBooks.some(
            (added) =>
              added.title === book.title &&
              added.year === Number(book.first_publish_year)
          );
        const book_rating = addedBooks.find(
          (added) => added.title === book.title
        );
        return (
          <div key={book.key}>
            <div style={styles.bookContainer}>
              {book.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                  style={styles.thumbnail}
                />
              )}
              <div style={styles.BookInfoAndButtons}>
                <div style={styles.bookInfo}>
                  <h4>{book.title}</h4>
                  {book.author_name &&
                    (book.author_name.length < 2 ? (
                      <p>
                        Author: <i>{book.author_name.join(', ')}</i>
                      </p>
                    ) : (
                      <p>
                        Authors: <i>{book.author_name.join(', ')}</i>
                      </p>
                    ))}
                  {book.first_publish_year && (
                    <p>Year: {book.first_publish_year}</p>
                  )}
                  {book.key && (
                    <p>
                      <a
                        href={`https://openlibrary.org${book.key}`}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        Open Library
                      </a>
                    </p>
                  )}
                </div>
                <div style={styles.buttonContainer}>
                  {alreadyAdded ? (
                    <Popup
                      trigger={<button className="button-text">Rate</button>}
                      modal
                      nested
                      contentStyle={{ maxWidth: '95vw', width: '600px' }}
                    >
                      {(close) => (
                        <div className="modal-container">
                          <div className="modal-header">{book.title}</div>
                          {book_rating && ratings[book_rating.id] ? (
                            <div style={styles.circle}>
                              <span style={styles.circleText}>
                                {ratings[book_rating.id]}
                              </span>
                            </div>
                          ) : null}
                          <div className="modal-content">
                            <div style={styles.sliderContainer}>
                              <label htmlFor="rating-slider">Your Rating</label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={
                                  (book_rating && ratings[book_rating.id]) || 0
                                }
                                onChange={(e) =>
                                  changeRating(
                                    parseFloat(e.target.value),
                                    addedBooks.find(
                                      (added) => added.title === book.title
                                    )
                                  )
                                }
                                style={styles.slider}
                              />
                              <div style={styles.silderNumbers}>
                                <span>0</span>
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
                          </div>
                          <div className="modal-actions">
                            <button
                              className="close-btn"
                              onClick={() => close()}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    /* // onClick={() =>
                      //   navigate(
                      //     `/${user.username}/books/${
                      //       addedBooks.find(
                      //         (added) =>
                      //           added.whole_title === book.title &&
                      //           added.year === Number(book.year)
                      //       ).id
                      //     }`
                      //   )
                      // } */
                    /* className="button-text" */

                    // Rate this book
                    // </button>}
                    <button
                      onClick={() => createNew({ book })}
                      className="button-text"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
            <hr style={styles.separator} />
          </div>
        );
      })}
    </div>
  );
};

const BookSearch = ({ createBook }) => {
  const bookInput = useField('text');
  const debouncedBook = useDebounce(bookInput.value, 500);
  const book = useBook(debouncedBook);
  const [showResults, setShowResults] = useState(true);

  const hideResults = () => {
    if (showResults === true) {
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <>
      <div style={{ width: '70%' }}>
        <input
          className="search-input"
          {...bookInput}
          data-testid="Search book"
          placeholder="Search for an book"
          onFocus={() => setShowResults(true)}
        />
        {debouncedBook && (
          <button onClick={hideResults}>
            {showResults ? 'Hide results' : 'Show results'}
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showResults && <Book bookSearched={book} createBook={createBook} />}
      </div>
    </>
  );
};

Book.propTypes = {
  bookSearched: PropTypes.array.isRequired,
  createBook: PropTypes.func.isRequired,
};

BookSearch.propTypes = {
  createBook: PropTypes.func.isRequired,
};

export default BookSearch;
