import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserMenu from './UserMenu';
import PropTypes from 'prop-types';

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

const MyListBooks = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  // if (!books || books.length === 0) {
  //   return <h2>No books added yet</h2>;
  // }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://im-only-rating.fly.dev/api/users/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  if (userData) {
    return (
      <>
        <UserMenu user={user} />
        <div>
          <h2>Books</h2>
        </div>
        <div style={styles.container}>
          {userData.books.map((book) => (
            <div key={book.id} style={styles.card}>
              <Link
                data-testid="bookTest"
                to={`/${userData.username}/books/${book.id}`}
              >
                {book.thumbnail && (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.thumbnail}-L.jpg`}
                    style={styles.thumbnail}
                  />
                )}
                <div>{book.title}</div>

                {/* <img src={book.thumbnail} style={styles.thumbnail} /> */}
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
