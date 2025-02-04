import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';

const styles = {
  bookContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  BookInfoAndButtons: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  bookInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '200px',
    height: '250px',
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
    if (!name) return;
    const searchBook = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/books/search-book',
          {
            params: {
              name: name,
            },
          }
        );
        console.log('book data works?', response.data);
        setBookSearched(response.data.docs);
      } catch (error) {
        console.error(error);
      }
    };

    searchBook();
  }, [name]);

  console.log('what happens here', bookSearched);
  return bookSearched;
};

const Book = ({ bookSearched, createBook }) => {
  if (bookSearched === null || bookSearched === undefined) {
    return <div>not found</div>;
  }

  const createNew = ({ book }) => {
    console.log('Testing book', book);
    createBook({
      author: book.author_name?.[0] || 'Unknown',
      title: book.title || 'Untitled',
      url: book.key,
      year: book.publish_year?.[0] || null,
      thumbnail: book.cover_i,
      whole_title: book.author_name[0] + ' - ' + book.title,
      key: book.key,
      heart: false,
    });
  };

  return (
    <div>
      <h4>
        {bookSearched.map((book) => (
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
                  <p>{book.title}</p>
                  {book.publish_year?.[0] && (
                    <p>Year: {book.publish_year[0]}</p>
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
                  <button onClick={() => createNew({ book })}>
                    Add to My List
                  </button>
                </div>
              </div>
            </div>
            <hr style={styles.separator} />
          </div>
        ))}
      </h4>
    </div>
  );
};

const BookSearch = ({ createBook }) => {
  const bookInput = useField('text');
  const debouncedBook = useDebounce(bookInput.value, 1000);
  const book = useBook(debouncedBook);

  return (
    <div>
      <input {...bookInput} placeholder="Search for a book" />
      <Book bookSearched={book} createBook={createBook} />
    </div>
  );
};

export default BookSearch;
