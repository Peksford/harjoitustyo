import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  card: {
    border: '1px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
    marginBottom: '50px',
  },
  thumbnail: {
    width: '150px',
    height: '200px',
    marginRight: '1rem',
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
    border: '2px solid #646cff',
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
  },
};

const MyListBooks = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  // if (!books || books.length === 0) {
  //   return <h2>No books added yet</h2>;
  // }

  useEffect(() => {
    console.log('does this render', username);
    const fetchUser = async () => {
      try {
        console.log('testing');
        const response = await axios.get(
          `http://localhost:3001/api/users/${username}`
        );
        console.log('reponse', response);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  console.log('userdata', userData);

  if (userData) {
    return (
      <>
        <div>
          <h2>
            <Link to={`/${userData.username}`}>{userData.username}</Link> books
          </h2>
        </div>
        <div style={styles.container}>
          {userData.books.map((book) => (
            <div key={book.id} style={styles.card}>
              <Link to={`/${userData.username}/books/${book.id}`}>
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
    // eslint-disable-next-line react/no-unescaped-entities
    return <div>No books yet :'(</div>;
  }
};

export default MyListBooks;
