import { useParams } from 'react-router-dom';
import bookService from '../services/books';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Book = ({ user, onUpdateBook }) => {
  const { id } = useParams();
  const [bookData, setBookData] = useState('');
  const [rating, setRating] = useState(0);
  const [descriptionFetched, setDescriptionFetched] = useState(false);

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
        const data = await bookService.getBook(id);
        setBookData(data);
        setRating(data.rating);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, [id, user]);

  const [description, setDescription] = useState([]);

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
          console.log('what data here', data);
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

  console.log('book description', description);
  // console.log('user id', user);

  return (
    <div style={styles.albumContainer}>
      <div style={styles.albumInfo}>
        <h2>{bookData.whole_title}</h2>
        <h3>{bookData.year}</h3>
        {description.value ? (
          <p
            style={{
              fontSize: '14px',
              maxWidth: '400px',
              wordWrap: 'break-word',
            }}
          >
            {description.value}
          </p>
        ) : (
          <p
            style={{
              fontSize: '14px',
              maxWidth: '400px',
              wordWrap: 'break-end',
            }}
          >
            {description}
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
        {bookData.rating ? (
          <div>
            {/* {albumData.user_id}'s rating */}
            <div style={styles.circle}>
              <span style={styles.circleText}>{bookData.rating}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  albumContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  albumInfo: {
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
    width: '300px',
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

export default Book;
