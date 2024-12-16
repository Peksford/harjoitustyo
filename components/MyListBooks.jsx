import { Link } from 'react-router-dom';

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
    height: '150px',
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

const MyListBooks = ({ books, user }) => {
  console.log('is ther books?', books);
  if (!books || books.length === 0) {
    return <h2>No books added yet</h2>;
  }
  console.log('mylist', books);
  return (
    <div style={styles.container}>
      {books.map((book) => (
        <div key={book.id} style={styles.card}>
          <Link to={`${user.username}/${book.id}`}>
            {book.thumbnail && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.thumbnail}-L.jpg`}
                style={styles.thumbnail}
              />
            )}
            {/* <img src={book.thumbnail} style={styles.thumbnail} /> */}
          </Link>

          {book.rating ? (
            <div style={styles.circle}>
              <span style={styles.circleText}>{book.rating}</span>
            </div>
          ) : null}
          {book.title}
        </div>
      ))}
    </div>
  );
};

export default MyListBooks;
