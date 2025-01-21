import { useParams } from 'react-router-dom';
import albumService from '../services/albums';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Heart from 'react-heart';

const Album = ({ user, albums, onUpdateAlbum }) => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState('');
  const [rating, setRating] = useState(0);
  const [trackListFetched, setTrackListFetched] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const album = albums.find((album) => album.id === Number(id));
    if (album) {
      setAlbumData(album);
      setActive(album.heart || false);
      setRating(album.rating || 0);
    }
  }, [albums, id]);

  const handleHeartClick = async () => {
    try {
      const updatedHeart = await albumService.heartClick(albumData.id, {
        ...albumData,
        heart: true,
      });

      console.log('The response of the heart ', updatedHeart);
      setAlbumData(updatedHeart);
      setActive(updatedHeart.heart);

      if (onUpdateAlbum) {
        onUpdateAlbum(updatedHeart);
      }
    } catch (error) {
      console.error('error pressing heart', error);
    }
  };

  const changeRating = async (newRating) => {
    setRating(newRating);
    try {
      const updatedRating = await albumService.updatedAlbum(albumData.id, {
        ...albumData,
        rating: newRating,
      });
      setAlbumData(updatedRating);
      if (onUpdateAlbum) {
        onUpdateAlbum(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [tracklist, setTracklist] = useState([]);

  useEffect(() => {
    const releaseInfo = async () => {
      if (trackListFetched) return;
      const token = import.meta.env.VITE_TOKEN;
      try {
        if (albumData) {
          const data = await axios.get(
            `https://api.discogs.com/releases/${albumData.discogs_id}`,
            {
              headers: {
                Authorization: `Discogs token=${token}`,
              },
            }
          );
          console.log('what data here', data);
          const fetchedTracklist = data.data.tracklist;
          setTracklist(fetchedTracklist);
          setTrackListFetched(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    releaseInfo();
  }, [albumData, trackListFetched]);

  return (
    <div style={styles.albumContainer}>
      <div style={styles.albumInfo}>
        <h2>{albumData.whole_title}</h2>
        <p style={{ width: '4rem' }}>
          <Heart isActive={active || false} onClick={handleHeartClick} />
        </p>
        <h3>{albumData.year}</h3>
        <ol>
          {tracklist.map((track) => (
            <li key={track.title}>{track.title}</li>
          ))}
        </ol>
        {albumData.user_id === (user?.id || 0) ? (
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
            href={`https://www.discogs.com${albumData.url}`}
            target="blank"
            rel="noopener noreferrer"
          >
            Discogs
          </a>
        </p>
        <img src={albumData.thumbnail} style={styles.thumbnail} />
        {albumData.rating ? (
          <div>
            <div style={styles.circle}>
              <span style={styles.circleText}>{albumData.rating}</span>
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
