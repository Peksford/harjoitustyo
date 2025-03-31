import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../services/users';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const styles = {
  container: {
    display: 'flex',
  },
  card: {
    maxWidth: '150px',

    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '130px',
    height: '180px',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: '110%',
    left: '46%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid rgb(255, 255, 255)',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
    color: 'black',
  },
};

const MyListBooks = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [mutual, setMutual] = useState(false);
  const [highest, setHighest] = useState(false);
  const userBooks = useSelector((state) => state.books);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alphabetical, setAlphabetical] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [sortedByYear, setSortedByYear] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUser(username);
        setUserData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username, userBooks]);

  const mutualBooks =
    userData && userBooks
      ? userData.books.filter((book1) => {
          return userBooks.some(
            (book2) => book2.whole_title === book1.whole_title
          );
        })
      : null;

  const highestBooks = userData
    ? [...userData.books].sort((a, b) => b.rating - a.rating)
    : null;

  const dateAdded = userData
    ? userData.books.filter((book) => {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        const addedDate = new Date(book.createdAt);
        if (startDate && addedDate < startDate) return false;
        if (endOfDay && addedDate > endOfDay) return false;
        return true;
      })
    : null;

  const sortedByYearBooks = userData
    ? [...userData.books].sort((a, b) => b.year - a.year)
    : null;

  const alphabeticalBooks = userData
    ? [...userData.books].sort((a, b) =>
        a.whole_title.localeCompare(b.whole_title)
      )
    : null;

  const searchBook = (searchWord) => {
    if (!userData) return [];
    const searchedBook = userData.books.filter((book) =>
      book.whole_title.toLowerCase().includes(searchWord.toLowerCase())
    );
    return searchedBook;
  };

  const displayBooks = userData
    ? mutual
      ? mutualBooks
      : highest
      ? highestBooks
      : startDate && endDate
      ? dateAdded
      : alphabetical
      ? alphabeticalBooks
      : searchWord
      ? searchBook(searchWord)
      : sortedByYear
      ? sortedByYearBooks
      : userData.books
    : null;

  const handleDateChange = (date, field) => {
    if (field === 'start') {
      setStartDate(date);
    } else if (field === 'end') {
      setEndDate(date);
    }
  };
  const onChange = (event) => {
    setSearchWord(event.target.value);
  };

  if (userData) {
    return (
      <>
        {/* <UserMenu user={user} /> */}
        <div style={{ marginTop: '20px' }}>
          <DropdownButton
            id="dropdown-secondary-button"
            // data-testid="dropdown-list"
            title={
              mutual
                ? 'Mutual books'
                : highest
                ? 'Highest rating'
                : alphabetical
                ? 'A-Ö'
                : 'All books'
            }
          >
            <Dropdown.Item
              onClick={() => {
                setMutual(false);
                setHighest(false);
              }}
            >
              All books
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setMutual(true);
                setHighest(false);
              }}
            >
              Mutual books
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(true);
                setMutual(false);
              }}
            >
              Highest rating
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(false);
                setMutual(false);
                setAlphabetical(true);
              }}
            >
              A-Ö
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setHighest(false);
                setMutual(false);
                setAlphabetical(false);
                setSortedByYear(true);
              }}
            >
              Newest releases
            </Dropdown.Item>
          </DropdownButton>
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            Sort by addition date:{' '}
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, 'start')}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
            <span> - </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, 'end')}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
          <div style={{ width: '50%' }}>
            <input
              className="search-input"
              onChange={onChange}
              value={searchWord}
              data-testid="Search book"
              placeholder="Search"
            />
          </div>
        </div>
        <h1>{username}&apos;s books</h1>
        <div className="album-container">
          {displayBooks.map((book) => (
            <div key={book.id} style={styles.card}>
              <Link
                data-testid="bookTest"
                to={`/${userData.username}/books/${book.id}`}
              >
                {book.source === 'ISBNDB' ? (
                  <img src={book.thumbnail} style={styles.thumbnail} />
                ) : (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.thumbnail}-L.jpg`}
                    style={styles.thumbnail}
                  />
                )}

                {/* <img src={book.thumbnail} style={styles.thumbnail} /> */}
              </Link>
              <Link to={`/${userData.username}/books/${book.id}`}>
                <div>{book.title}</div>
              </Link>
              {book.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{book.rating}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
};

MyListBooks.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default MyListBooks;
