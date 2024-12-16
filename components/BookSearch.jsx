import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';

const styles = {
  BookContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  BookInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '250px',
    height: '300px',
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
    console.log('Testing album', book);
    createBook({
      author: book.author_name?.[0] || 'Unknown',
      title: book.title || 'Untitled',
      url: book.key,
      year: book.publish_year?.[0] || 'Unknown Year',
      thumbnail: book.cover_i,
      whole_title: book.author_name[0] + ' - ' + book.title,
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
              <div style={styles.bookInfo}>
                <p>{book.title}</p>
                {book.publish_year?.[0] && <p>Year: {book.publish_year[0]}</p>}
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
            <hr style={styles.separator} />
          </div>
        ))}
      </h4>
    </div>
  );
};

const BookSearch = ({ createBook }) => {
  const bookInput = useField('text');
  const debouncedBook = useDebounce(bookInput.value, 500);
  const book = useBook(debouncedBook);

  return (
    <div>
      <input {...bookInput} placeholder="Search for a book" />
      <Book bookSearched={book} createBook={createBook} />
    </div>
  );
};

export default BookSearch;
