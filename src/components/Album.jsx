import React from 'react';
import { useParams } from 'react-router-dom';
import albumService from '../services/albums';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Heart from 'react-heart';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import discogsButton from '../assets/discogsButton.webp';
import { albumHeart } from '../reducers/albumReducer';

const Album = ({ onUpdateAlbum, createAlbum }) => {
  const { username, id } = useParams();
  const [albumData, setAlbumData] = useState('');
  const [rating, setRating] = useState(0);
  const [trackListFetched, setTrackListFetched] = useState(false);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openHeart, setOpenHeart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const albums = useSelector((state) => state.albums);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const album = await albumService.getAlbum(id);
        const user = await userService.getUserAlbums(username);

        if (album && user[0].user_id === album.user_id) {
          setAlbumData(album);
          setActive(album.heart || false);
          setRating(album.rating || 0);
        } else {
          return null;
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAlbum();
  }, [id, username]);

  const handleHeartClick = async () => {
    if (!albums.find((album) => album.heart === true)) {
      try {
        setOpenHeart(true);
        const updatedHeart = await albumService.heartClick(albumData.id, {
          ...albumData,
          heart: true,
        });

        setAlbumData(updatedHeart);
        setActive(updatedHeart.heart);
        dispatch(albumHeart(albumData));

        if (onUpdateAlbum) {
          onUpdateAlbum(updatedHeart);
        }
        setOpenHeart(false);
      } catch (error) {
        console.error('error pressing heart', error);
      }
    } else {
      dispatch(
        setNotification(`You have already selected album of the week`, 5)
      );
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
      if (!albumData || trackListFetched) return;
      const token = import.meta.env.VITE_TOKEN;
      try {
        if (albumData) {
          const type = albumData.url.includes('master')
            ? 'masters'
            : 'releases';

          const data = await axios.get(
            `https://api.discogs.com/${type}/${albumData.discogs_id}`,
            {
              headers: {
                Authorization: `Discogs token=${token}`,
              },
            }
          );
          const fetchedTracklist = data.data.tracklist;
          setTracklist(fetchedTracklist);
          setTrackListFetched(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    releaseInfo();
  }, [albumData]);

  const deleteAlbum = async (id) => {
    try {
      setOpen(true);
      await albumService.deleteAlbum(id);
      setAlbumData(null);
      dispatch(
        setNotification(`${albumData.title} was removed from your list`, 5)
      );
      navigate(`/${username}/albums`);
    } catch (error) {
      console.error(error);
    }
  };

  const createNew = async ({ albumData }) => {
    try {
      const newAlbum = await createAlbum({
        type: 'album',
        artist: albumData.artist,
        title: albumData.title,
        url: albumData.url,
        year: albumData.year,
        thumbnail: albumData.thumbnail,
        whole_title: albumData.whole_title,
        discogs_id: albumData.discogs_id,
        heart: false,
      });
      return newAlbum;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickHeartOpen = () => {
    setOpenHeart(true);
  };
  const handleHeartClose = () => {
    setOpenHeart(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveConfirm = () => {
    deleteAlbum(albumData.id);
    setOpen(false);
  };

  if (albumData) {
    return (
      <>
        <div>
          <div>
            Back to{' '}
            <Link data-testid="homePage" to={`/${username}`}>
              {username}
            </Link>{' '}
            home page
          </div>
        </div>
        <div>
          <div style={styles.albumInfo}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <h2>{albumData.whole_title}</h2>{' '}
              <div
                data-testid="heart"
                style={{
                  width: '3.5rem',
                  marginLeft: '10px',
                  display: 'inline-block',
                }}
              >
                <Heart
                  isActive={active || false}
                  onClick={() => {
                    if (albumData.user_id !== user.id) return;
                    if (!albums.find((album) => album.heart === true)) {
                      handleClickHeartOpen();
                    } else {
                      dispatch(
                        setNotification(
                          `You have already selected album of the week`,
                          5
                        )
                      );
                    }
                  }}
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    textAlign: 'cenSorrter',
                  }}
                />
                <Dialog
                  open={openHeart}
                  onClose={handleHeartClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {`Do you want to make ${albumData.title} your album of the week?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleHeartClose}>No</Button>
                    <Button onClick={handleHeartClick} autoFocus>
                      {' '}
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
            <h3>
              <i>{albumData.year}</i>
            </h3>
            <img src={albumData.thumbnail} style={styles.thumbnail} />
            <p>
              <a
                href={`https://www.discogs.com${albumData.url}`}
                target="blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{
                    backgroundColor: 'black',
                    padding: '8px 16px',
                    marginTop: '10px',
                  }}
                >
                  <img
                    src={discogsButton}
                    style={{
                      width: '100%',
                      maxWidth: '100px',
                      height: 'auto',
                    }}
                  />
                </button>
              </a>
            </p>
            <ol>
              {tracklist.map((track) => (
                <li key={track.title}>{track.title}</li>
              ))}
            </ol>
            <div style={styles.thumbNailContainer}>
              {albumData.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{albumData.rating}</span>
                </div>
              ) : null}

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
              ) : null}
            </div>

            <div>
              {username} added this on{' '}
              {new Date(albumData.createdAt).toLocaleDateString()}
            </div>

            <div style={styles.buttonContainer}></div>
            <div>
              {user && user.id === albumData.user_id ? (
                <>
                  <button onClick={handleClickOpen}>Remove</button>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {`Do you want to remove ${albumData.title} from your list?`}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose}>No</Button>
                      <Button onClick={handleRemoveConfirm} autoFocus>
                        {' '}
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <>
                  <button
                    onClick={() => createNew({ albumData })}
                    className="button-text"
                  >
                    Add to your list
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Not found</div>;
  }
};

const styles = {
  albumContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    gap: '20px',
  },
  albumInfo: {
    display: 'flex',
    flexDirection: 'column',
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
    width: '90%',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  circleText: {
    margin: 0,
  },
};

Album.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateAlbum: PropTypes.func,
  createAlbum: PropTypes.func.isRequired,
};

export default Album;
