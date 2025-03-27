import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import bookService from '../services/books';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import BookAdvancedSearch from './BookAdvancedSearch';
import isbndbLogo from '../assets/isbndb.png';
import openLibraryLogo from '../assets/openLibrarylogo.png';

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
    height: '330px',
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

const useBook = (name, type) => {
  const [bookSearched, setBookSearched] = useState([]);
  useEffect(() => {
    if (!name) {
      setBookSearched([]);
      return;
    }

    const searchBook = async () => {
      try {
        const baseURL =
          import.meta.env.MODE === 'development'
            ? 'http://localhost:3001'
            : 'https://im-only-rating.fly.dev';

        if (type === 'ISBNDB') {
          const response = await axios.get(
            `${baseURL}/api/books/search-book-isbndb`,
            // 'http://localhost:3001/api/books/search-book-isbndb',
            {
              params: {
                name: name,
              },
            }
          );

          setBookSearched(response.data.books);
        } else {
          const response = await axios.get(
            `${baseURL}/api/books/search-book`,
            // 'http://localhost:3001/api/books/search-book',
            {
              params: {
                name: name,
              },
            }
          );

          setBookSearched(response.data.docs);
        }
      } catch (error) {
        console.error(error);
      }
    };

    searchBook();
  }, [name]);

  return bookSearched;
};

const Book = ({ bookSearched, createBook, type }) => {
  if (bookSearched === null || bookSearched === undefined) {
    return <div>not found</div>;
  }

  const [addedBooks, setAddedBooks] = useState([]);
  const [ratings, setRatings] = useState({});

  const createNew = async ({ book }) => {
    try {
      if (type === 'openLibrary') {
        const newBook = await createBook({
          type: 'book',
          source: 'openLibrary',
          author: book.author_name?.join(', ') || 'Unknown',
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
      } else {
        const newBook = await createBook({
          type: 'book',
          source: 'ISBNDB',
          author: book.authors?.join(', ') || 'Unknown',
          title: book.title || 'Untitled',
          url: book.isbn13,
          year: book.date_published.split('-')[0] || null,
          thumbnail: book.image,
          whole_title: book.authors?.join(', ') + ' - ' + book.title,
          key: book.isbn,
          synopsis: book.synopsis,
          heart: false,
        });
        newBook && setAddedBooks((prevBooks) => [...prevBooks, newBook]);

        return addedBooks;
      }
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
              (added.year === Number(book.first_publish_year) ||
                (book.date_published &&
                  added.year === Number(book.date_published.split('-')[0])))
            //   Number(book.first_publish_year)) ||
            // (book.date_published && Number(book.date_published.split('-')[0]))
          );
        const book_rating = addedBooks.find(
          (added) => added.title === book.title
        );

        return (
          <div key={book.key || book.isbn}>
            {type === 'openLibrary' ? (
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
                          <img
                            src={openLibraryLogo}
                            style={{
                              width: '100%',
                              maxWidth: '120px',
                              height: 'auto',
                              backgroundColor: 'white',
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          />
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : type === 'ISBNDB' ? (
              <div style={styles.bookContainer}>
                {book.image && (
                  <img src={book.image} style={styles.thumbnail} />
                )}
                <div style={styles.BookInfoAndButtons}>
                  <div style={styles.bookInfo}>
                    <h4>{book.title}</h4>
                    {book.authors &&
                      (book.authors.length < 2 ? (
                        <p>
                          Author: <i>{book.authors.join(', ')}</i>
                        </p>
                      ) : (
                        <p>
                          Authors: <i>{book.authors.join(', ')}</i>
                        </p>
                      ))}
                    {book.date_published && (
                      <p>Year: {book.date_published.split('-')[0]}</p>
                    )}
                    {book.isbn13 && (
                      <p>
                        <a
                          href={`https://isbndb.com/book/${book.isbn13}`}
                          target="blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={isbndbLogo}
                            style={{
                              width: '100%',
                              maxWidth: '110px',
                              height: 'auto',
                              backgroundColor: 'black',
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          />
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>No book data available</p>
            )}
            <div style={styles.buttonContainer}>
              {alreadyAdded ? (
                <Popup
                  trigger={
                    <button style={{ width: '50%' }} className="button-text">
                      Rate
                    </button>
                  }
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
                  style={{ width: '50%' }}
                >
                  Add
                </button>
              )}
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
  const [type, setType] = useState('ISBNDB');
  const book = useBook(debouncedBook, type);
  const [showResults, setShowResults] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [bookSearched, setBookSearched] = useState([]);

  const hideResults = () => setShowResults(!showResults);
  const hideSearch = () => setShowAdvancedSearch(!showAdvancedSearch);

  const handleAdvancedSearch = async (searchParams) => {
    try {
      setBookSearched([]);
      const baseURL =
        import.meta.env.MODE === 'development'
          ? 'http://localhost:3001'
          : 'https://im-only-rating.fly.dev';

      if (type === 'openLibrary') {
        const response = await axios.get(
          `${baseURL}/api/books/search-book`,
          // 'http://localhost:3001/api/books/search-book',
          {
            params: {
              title: searchParams.title || '',
              author: searchParams.author || '',
              language: searchParams.language || '',
              subject: searchParams.subject,
              isbn: searchParams.isbn || '',
            },
          }
        );
        setBookSearched(response.data.docs);
      } else {
        const response = await axios.get(
          `${baseURL}/api/books/search-book-isbndb`,
          // 'http://localhost:3001/api/books/search-book-isbndb',
          {
            params: {
              query: searchParams.query,
              column: searchParams.column || '',
              year: searchParams.year || '',
              edition: searchParams.edition || '',
              title: searchParams.title || '',
              author: searchParams.author || '',
              language: searchParams.language || '',
              subject: searchParams.subject,
              isbn: searchParams.isbn || '',
            },
          }
        );
        response.data.books
          ? setBookSearched(response.data.books)
          : setBookSearched(
              Array.isArray(response.data.book)
                ? response.data.book
                : [response.data.book]
            );
      }
    } catch (error) {
      console.error('Error making advanced search', error);
    }
  };

  const handleTypeChange = (event) => {
    setBookSearched([]);
    setType(event.target.value);

    bookInput.onChange({ target: { value: '' } });
  };

  return (
    <>
      <div style={{ width: '70%' }}>
        <div className="radio-group">
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value="ISBNDB"
              data-testid="bookSource"
              checked={type === 'ISBNDB'}
              onChange={handleTypeChange}
            />{' '}
            <img
              src={isbndbLogo}
              style={{
                width: '100%',
                maxWidth: '110px',
                height: 'auto',
                backgroundColor: 'black',
                padding: '8px',
                borderRadius: '8px',
              }}
            />
          </label>
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value="openLibrary"
              data-testid="bookSource"
              checked={type === 'openLibrary'}
              onChange={handleTypeChange}
            />{' '}
            <img
              src={openLibraryLogo}
              style={{
                width: '100%',
                maxWidth: '120px',
                height: 'auto',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '8px',
              }}
            />
          </label>
        </div>
        <input
          className="search-input"
          value={bookInput.value}
          onChange={(e) => {
            bookInput.onChange(e);
          }}
          // {...bookInput}
          data-testid="Search book"
          placeholder="Search for a book"
          onFocus={() => setShowResults(true)}
        />
        <button
          onClick={hideSearch}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          {showAdvancedSearch ? 'Hide advanced search' : 'Advanced search'}
        </button>
        {showAdvancedSearch && (
          <BookAdvancedSearch onSearch={handleAdvancedSearch} type={type} />
        )}
        {debouncedBook && (
          <button onClick={hideResults}>
            {showResults ? 'Hide results' : 'Show results'}
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showResults && (
          <Book
            bookSearched={bookSearched.length ? bookSearched : book}
            createBook={createBook}
            type={type}
          />
        )}
      </div>
    </>
  );
};

Book.propTypes = {
  bookSearched: PropTypes.array.isRequired,
  createBook: PropTypes.func.isRequired,
  type: PropTypes.string,
};

BookSearch.propTypes = {
  createBook: PropTypes.func.isRequired,
};

export default BookSearch;
