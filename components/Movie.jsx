import React from 'react';
import { useParams } from 'react-router-dom';
import movieService from '../services/movies';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import Heart from 'react-heart';
import { Link } from 'react-router-dom';

const Movie = ({ user, onUpdateMovie }) => {
  const { username, id } = useParams();
  const [movieData, setMovieData] = useState('');
  const [rating, setRating] = useState(0);
  const [active, setActive] = useState(false);

  console.log('paramssit', username, id);

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
    console.log('moviei data', movieData);
    // const movie = movies.find((movie) => movie.id === Number(id));
  }, [id, username]);

  console.log('moviei data', movieData);

  // useEffect(() => {
  //   console.log('Movie.jsx', movies);
  //   const movie = movies.find((movie) => movie.id === Number(id));
  //   if (movie) {
  //     setMovieData(movie);
  //     setRating(movie.rating || 0);
  //   }
  // }, [movies, id]);

  const handleHeartClick = async () => {
    try {
      const updatedHeart = await movieService.heartClick(movieData.id, {
        ...movieData,
        heart: true,
      });

      console.log('The response of the heart ', updatedHeart);
      setMovieData(updatedHeart);
      setActive(updatedHeart.heart);

      if (onUpdateMovie) {
        onUpdateMovie(updatedHeart);
      }
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
    console.log(inputDate);
    return new Intl.DateTimeFormat('fi-FI').format(date);
  };

  if (movieData) {
    return (
      <>
        <div>
          <h10>
            back to <Link to={`/${username}`}>{username}</Link> home page
          </h10>
        </div>
        <div style={styles.movieContainer}>
          <div style={styles.movieInfo}>
            <h2>{movieData.whole_title}</h2>
            <p style={{ width: '4rem' }}>
              <Heart isActive={active || false} onClick={handleHeartClick} />
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
                  The Movie Database
                </a>
              </p>
            ) : (
              <p>
                <a
                  href={`https://themoviedb.org/tv/${movieData.tmdb_id}`}
                  target="blank"
                  rel="noopener noreferrer"
                >
                  The Movie Database
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

export default Movie;
