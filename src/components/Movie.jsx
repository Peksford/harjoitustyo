import React from 'react';
import { useParams } from 'react-router-dom';
import movieService from '../services/movies';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import Heart from 'react-heart';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import tmdbLogo from '../assets/tmdbLogo.svg';
import { movieHeart } from '../reducers/movieReducer';

const Movie = ({ onUpdateMovie, createMovie }) => {
  const { username, id } = useParams();
  const [movieData, setMovieData] = useState('');
  const [rating, setRating] = useState(0);
  const [active, setActive] = useState(false);

  const [open, setOpen] = useState(false);
  const [openHeart, setOpenHeart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movie = await movieService.getMovie(id);
        const user = await userService.getUserMovies(username);

        if (user[0].user_id === movie.user_id) {
          setMovieData(movie);
          setActive(movie.heart || false);
          setRating(movie.rating || 0);
        } else {
          return setMovieData(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, [id, username]);

  const handleHeartClick = async () => {
    try {
      setOpenHeart(true);
      const updatedHeart = await movieService.heartClick(movieData.id, {
        ...movieData,
        heart: true,
      });
      setMovieData(updatedHeart);
      setActive(updatedHeart.heart);
      dispatch(movieHeart(movieData));

      if (onUpdateMovie) {
        onUpdateMovie(updatedHeart);
      }
      setOpenHeart(false);
    } catch (error) {
      console.error('error pressing heart', error);
    }
  };

  const changeRating = async (newRating) => {
    setRating(newRating);
    try {
      const updatedRating = await movieService.updatedMovie(movieData.id, {
        ...movieData,
        rating: newRating,
      });
      setMovieData(updatedRating);
      if (onUpdateMovie) {
        onUpdateMovie(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return new Intl.DateTimeFormat('fi-FI').format(date);
  };

  const deleteMovie = async (id) => {
    try {
      setOpen(true);
      await movieService.deleteMovie(id);
      setMovieData(null);
      dispatch(
        setNotification(`${movieData.title} was removed from your list`, 5)
      );
      navigate(`/${username}/movies`);
    } catch (error) {
      console.error(error);
    }
  };

  const createNew = async ({ movieData }) => {
    try {
      const newMovie = await createMovie({
        title: movieData.title,
        url: movieData.url,
        release_date: movieData.release_date,
        thumbnail: movieData.thumbnail,
        whole_title: movieData.whole_title,
        tmdb_id: movieData.tmbd_id,
        type: movieData.type,
        overview: movieData.overview,
        heart: false,
      });
      return newMovie;
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
    deleteMovie(movieData.id);
    setOpen(false);
  };

  if (movieData) {
    return (
      <>
        <div>
          <div>
            back to <Link to={`/${username}`}>{username}</Link> home page
          </div>
        </div>
        <div>
          <div style={styles.movieInfo}>
            <h2>{movieData.whole_title}</h2>
            <div>
              {username} added this on{' '}
              {new Date(movieData.createdAt).toLocaleDateString()}
            </div>
            <p
              data-testid="heart"
              style={{
                width: '7rem',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <Heart
                isActive={active || false}
                onClick={() => {
                  if (!movies.find((movie) => movie.heart === true)) {
                    handleClickHeartOpen();
                  } else {
                    dispatch(
                      setNotification(
                        `You have already selected movie of the week`,
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
                  {`Do you want to make ${movieData.title} your movie of the week?`}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleHeartClose}>No</Button>
                  <Button onClick={handleHeartClick} autoFocus>
                    {' '}
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '0 5px',
                }}
              >
                {active ? 'Pick of the week' : ''}
              </span>
            </p>
            <h3>
              {movieData.release_date && (
                <p>{formatDate(movieData.release_date)}</p>
              )}
            </h3>
            {movieData.overview && (
              <p
                style={{
                  fontSize: '14px',
                  maxWidth: '400px',
                  wordWrap: 'break-word',
                }}
              >
                {movieData.overview}
              </p>
            )}
            {movieData.user_id === (user?.id || 0) ? (
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
            {movieData.type === 'movie' ? (
              <p>
                <a
                  href={`https://themoviedb.org/movie/${movieData.tmdb_id}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={tmdbLogo}
                    style={{
                      width: '100%',
                      maxWidth: '80px',
                      height: 'auto',
                      backgroundColor: '#0d253f',
                      padding: '10px',
                      borderRadius: '8px',
                    }}
                  />
                </a>
              </p>
            ) : (
              <p>
                <a
                  href={`https://themoviedb.org/tv/${movieData.tmdb_id}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={tmdbLogo}
                    style={{
                      width: '100%',
                      maxWidth: '80px',
                      height: 'auto',
                      backgroundColor: '#0d253f',
                      padding: '10px',
                      borderRadius: '8px',
                    }}
                  />
                </a>
              </p>
            )}
            <img
              src={`https://www.themoviedb.org/t/p/w1280/${movieData.thumbnail}`}
              style={styles.thumbnail}
            />
            {movieData.rating ? (
              <div>
                <div style={styles.circle}>
                  <span style={styles.circleText}>{movieData.rating}</span>
                </div>
              </div>
            ) : null}
            <div style={styles.buttonContainer}></div>
            <div>
              {user && user.id === movieData.user_id ? (
                <>
                  <button onClick={handleClickOpen}>Remove</button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {`Do you want to remove ${movieData.title} from your list?`}
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
                    onClick={() => createNew({ movieData })}
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
  movieContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  movieInfo: {
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
    height: '450px',
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

Movie.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateMovie: PropTypes.func,
  createMovie: PropTypes.func.isRequired,
};

export default Movie;
