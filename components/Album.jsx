import { useParams } from 'react-router-dom';
import albumService from '../services/albums';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const Album = ({ user }) => {
  //   if (!albums || albums.length === 0) {
  //     return <h2>No albums added yet</h2>;
  //   }
  const { id } = useParams();
  console.log('id', id);
  const [albumData, setAlbumData] = useState('');
  const [rating, setRating] = useState(0);

  // useEffect(() => {
  //   if (albumData && albumData.rating !== undefined) {
  //     setRating(albumData.rating);
  //   }
  // }, [albumData]);

  console.log(id);

  const changeRating = async (newRating) => {
    setRating(newRating);

    try {
      const updatedRating = await albumService.updatedAlbum(albumData.id, {
        ...albumData,
        rating: newRating,
      });
      setAlbumData(updatedRating);
    } catch (error) {
      console.error(error);
    }

    console.log(newRating);
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await albumService.getAlbum(id, user.token);
        setAlbumData(data);
        setRating(data.rating);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAlbum();
  }, [id, user]);

  console.log('album data', albumData.rating);

  return (
    <div style={styles.albumContainer}>
      <div style={styles.albumInfo}>
        <h2>{albumData.whole_title}</h2>
        <h2>{albumData.year}</h2>
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
          {/* <span>{rating}/10</span> */}
          {/* // <StarRatings
          rating={rating}
          changeRating={changeRating}
          starRatedColor="gold"
          numberOfStars={10}
          name="rating"
        /> */}
        </div>
      </div>
      <div style={styles.thumbNailContainer}>
        <img src={albumData.thumbnail} style={styles.thumbnail} />
        <div style={styles.circle}>
          <span style={styles.circleText}>{albumData.rating}/10</span>
        </div>
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
    objectFit: 'cover',
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

export default Album;
