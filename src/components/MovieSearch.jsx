import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import movieService from '../services/movies';
import tmdbLogo from '../assets/tmdbLogo.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setMovies } from '../reducers/movieReducer';

const styles = {
  movieContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  movieInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '150px',
    height: '220px',
    marginRight: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
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
  circle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

const useMovie = (name) => {
  const [movieSearched, setMovieSearched] = useState([]);

  useEffect(() => {
    if (!name) {
      setMovieSearched([]);
      return;
    }
    if (!name) return;

    const searchMovie = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      try {
        const movieResponse = await axios.get(
          'https://api.themoviedb.org/3/search/multi',
          {
            params: {
              api_key: apiKey,
              query: name,
              page: 1,
            },
          }
        );
        setMovieSearched(movieResponse.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    searchMovie();
  }, [name]);

  return movieSearched;
};

const Movie = ({ movieSearched, createMovie }) => {
  if (movieSearched === null || movieSearched === undefined) {
    return <div>not found</div>;
  }
  const [rating, setRating] = useState(0);
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  const dispatch = useDispatch();

  const createNew = async (movie) => {
    try {
      const newMovie = await createMovie({
        title: movie.media_type === 'movie' ? movie.title : movie.name,
        url: movie.id,
        release_date:
          movie.media_type === 'movie'
            ? movie.release_date
            : movie.first_air_date || 'Unknown',
        thumbnail: movie.poster_path,
        whole_title: movie.media_type === 'movie' ? movie.title : movie.name,
        tmdb_id: movie.id,
        type: movie.media_type,
        overview: movie.overview,
        heart: false,
      });

      return newMovie;
    } catch (error) {
      console.error('Error adding movie or tv show', error);
    }
  };

  const changeRating = async (newRating, addedMovie) => {
    setRating(newRating);
    console.log('rating', rating);

    if (!addedMovie) return;

    try {
      const updatedMovie = await movieService.updatedMovie(addedMovie.id, {
        ...addedMovie,
        rating: newRating,
      });
      const updatedMovies = movies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      );

      dispatch(setMovies(updatedMovies));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    if (inputDate) return new Intl.DateTimeFormat('fi-FI').format(date);
  };

  console.log('movies', movies);

  return (
    <div>
      <h4>
        {movieSearched.map((movie) => {
          const alreadyAdded = movies.some(
            (added) => added.tmdb_id === movie.id
          );

          const movieFounded = movies.find((item) => item.tmdb_id === movie.id);

          console.log('movie added', alreadyAdded);

          return (
            <div key={movie.id}>
              <div style={styles.movieContainer}>
                <Link
                  to={
                    movieFounded &&
                    `/${user.username}/movies/${movieFounded.id}`
                  }
                >
                  {movie.poster_path && (
                    <img
                      src={`https://www.themoviedb.org/t/p/w1280/${movie.poster_path}`}
                      style={styles.thumbnail}
                    />
                  )}
                </Link>
                <div style={styles.movieInfo}>
                  {movie.media_type === 'movie'
                    ? movie.title
                    : movie.media_type === 'tv'
                    ? movie.name
                    : movie.media_type === 'person'
                    ? movie.name
                    : 'unknown'}

                  {movie.media_type === 'movie' && (
                    <>
                      <p>Release date: {formatDate(movie.release_date)}</p>
                      <div style={{ display: 'flex' }}>
                        <a
                          href={`https://themoviedb.org/movie/${movie.id}`}
                          target="blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={tmdbLogo}
                            style={{
                              width: '100%',
                              maxWidth: '70px',
                              height: 'auto',
                              backgroundColor: '#0d253f',
                              padding: '10px',
                              borderRadius: '8px',
                              marginBottom: '5px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                        {movieFounded && (
                          <div style={styles.circle}>
                            {movieFounded?.rating}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {movie.media_type === 'tv' && (
                    <>
                      <div>
                        First aired date: {formatDate(movie.first_air_date)}
                      </div>
                      <div style={{ display: 'flex' }}>
                        <a
                          href={`https://themoviedb.org/tv/${movie.id}`}
                          target="blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={tmdbLogo}
                            style={{
                              width: '100%',
                              maxWidth: '70px',
                              height: 'auto',
                              backgroundColor: '#0d253f',
                              padding: '10px',
                              borderRadius: '8px',
                              marginRight: '10px',
                              marginBottom: '10px',
                            }}
                          />
                        </a>
                        {movieFounded && (
                          <div style={styles.circle}>
                            {movieFounded?.rating}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {movie.media_type === 'person' && (
                    <>
                      <div>
                        Known for {movie.known_for_department}:{' '}
                        <ul>
                          {movie.known_for.map(
                            (known) =>
                              (known.media_type === 'movie' ||
                                known.media_type === 'tv') && (
                                <li key={known.id}>
                                  <span>{known.title}</span>
                                  {known.poster_path && (
                                    <img
                                      src={`https://www.themoviedb.org/t/p/w1280/${known.poster_path}`}
                                      style={styles.thumbnail}
                                    />
                                  )}
                                  <div>
                                    <a
                                      href={`https://themoviedb.org/${known.media_type}/${known.id}`}
                                      target="blank"
                                      rel="noopener noreferrer"
                                    >
                                      The Movie Database
                                    </a>
                                  </div>
                                  <button
                                    onClick={() => createNew(known)}
                                    className="button-text"
                                  >
                                    Add
                                  </button>
                                  <hr />
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                  {alreadyAdded ? (
                    <Popup
                      trigger={<button className="button-text">Rate</button>}
                      modal
                      nested
                      contentStyle={{ maxWidth: '95vw', width: '600px' }}
                    >
                      {(close) => (
                        <div className="modal-container">
                          <div className="modal-header">{movie.title}</div>
                          {movieFounded ? (
                            <div style={styles.circle}>
                              <span style={styles.circleText}>
                                {movieFounded?.rating}
                              </span>
                            </div>
                          ) : null}

                          <div className="modal-content">
                            <div style={styles.sliderContainer}>
                              <label htmlFor="rating-slider">Your Rating</label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={
                                  (movieFounded && movieFounded?.rating) || 0
                                }
                                onChange={(e) =>
                                  changeRating(
                                    parseFloat(e.target.value),
                                    movies.find(
                                      (added) => added.tmdb_id === movie.id
                                    )
                                  )
                                }
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
                          </div>
                          <div className="modal-actions">
                            <button onClick={() => close()}>Ok</button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    movie.media_type !== 'person' && (
                      <button
                        onClick={() => createNew(movie)}
                        className="button-text"
                      >
                        Add
                      </button>
                    )
                  )}
                </div>
              </div>
              <hr style={styles.separator} />
            </div>
          );
        })}
      </h4>
    </div>
  );
};

const MovieSearch = ({ createMovie }) => {
  const movieInput = useField('text');
  const debouncedMovie = useDebounce(movieInput.value, 1000);
  const movie = useMovie(debouncedMovie);
  const [showResults, setShowResults] = useState(true);

  const hideResults = () => setShowResults(!showResults);

  return (
    <>
      <div
        style={{
          width: '90%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <img
          src={tmdbLogo}
          style={{
            width: '100%',
            maxWidth: '70px',
            height: 'auto',
            backgroundColor: '#0d253f',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        />
        <input
          className="search-input"
          {...movieInput}
          data-testid="Search movie"
          placeholder="Search for a movie, tv show or person"
          onFocus={() => setShowResults(true)}
        />
      </div>
      {debouncedMovie && (
        <button style={{ marginBottom: '10px' }} onClick={hideResults}>
          {showResults ? 'Hide results' : 'Show results'}
        </button>
      )}

      <div style={{ width: '100%' }}>
        {showResults && (
          <Movie movieSearched={movie} createMovie={createMovie} />
        )}
      </div>
    </>
  );
};

Movie.propTypes = {
  movieSearched: PropTypes.array.isRequired,
  createMovie: PropTypes.func.isRequired,
};

MovieSearch.propTypes = {
  createMovie: PropTypes.func.isRequired,
};

export default MovieSearch;
