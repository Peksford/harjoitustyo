import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
    width: '200px',
    height: '200px',
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
    if (!name) return;
    const searchMovie = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      try {
        const movieResponse = await axios.get(
          'https://api.themoviedb.org/3/search/movie',
          {
            params: {
              api_key: apiKey,
              query: name,
              page: 1,
            },
          }
        );

        const tvResponse = await axios.get(
          'https://api.themoviedb.org/3/search/tv',
          {
            params: {
              api_key: apiKey,
              query: name,
              page: 1,
            },
          }
        );

        const movieAndTvCombined = [
          ...movieResponse.data.results.map((item) => ({
            ...item,
            type: 'movie',
          })),
          ...tvResponse.data.results.map((item) => ({
            ...item,
            type: 'tv',
          })),
        ];

        console.log('TMDB search data', movieAndTvCombined);
        setMovieSearched(movieAndTvCombined);
      } catch (error) {
        console.error(error);
      }
    };

    searchMovie();
  }, [name]);

  console.log('what happens here', movieSearched);
  return movieSearched;
};

const Movie = ({ movieSearched, createMovie }) => {
  if (movieSearched === null || movieSearched === undefined) {
    return <div>not found</div>;
  }

  const createNew = ({ movie }) => {
    console.log('Testing movie', movie.id);

    if (movie.type === 'movie') {
      createMovie({
        title: movie.title,
        url: movie.id,
        release_date: movie.release_date,
        thumbnail: movie.poster_path,
        whole_title: movie.title,
        tmdb_id: movie.id,
        type: movie.type,
        overview: movie.overview,
        heart: false,
      });
    } else {
      createMovie({
        title: movie.name,
        url: movie.id,
        release_date: movie.first_air_date,
        thumbnail: movie.poster_path,
        whole_title: movie.name,
        tmdb_id: movie.id,
        type: movie.type,
        overview: movie.overview,
        heart: false,
      });
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    console.log('TIME VALUE', inputDate);
    if (inputDate) return new Intl.DateTimeFormat('fi-FI').format(date);
  };

  return (
    <div>
      <h4>
        {movieSearched.map((movie) => (
          <div key={movie.id}>
            <div style={styles.movieContainer}>
              <img
                src={`https://www.themoviedb.org/t/p/w1280/${movie.poster_path}`}
                style={styles.thumbnail}
              />
              <div style={styles.movieInfo}>
                {movie.type === 'movie' ? (
                  <p>{movie.title}</p>
                ) : (
                  <p>{movie.name}</p>
                )}
                {movie.type === 'movie' ? (
                  <p>Release date: {formatDate(movie.release_date)}</p>
                ) : (
                  <p>First aired date: {formatDate(movie.first_air_date)}</p>
                )}
                {/* {movie.release_date && (
                  <p>Release date: {formatDate(movie.release_date)}</p>
                )} */}
                {movie.type === 'movie' ? (
                  <p>
                    <a
                      href={`https://themoviedb.org/movie/${movie.id}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      The Movie Database
                    </a>
                  </p>
                ) : (
                  <p>
                    <a
                      href={`https://themoviedb.org/tv/${movie.id}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      The Movie Database
                    </a>
                  </p>
                )}
                {/* {movie.id && (
                  <p>
                    <a
                      href={`https://themoviedb.org/movie/${movie.id}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      The Movie Database
                    </a>
                  </p>
                )} */}
              </div>
              <div style={styles.buttonContainer}>
                <button onClick={() => createNew({ movie })}>
                  Add to My List
                </button>
              </div>
            </div>
            <hr style={styles.separator} />
          </div>
        ))}
      </h4>
    </div>
  );
};

const MovieSearch = ({ createMovie }) => {
  const movieInput = useField('text');
  const debouncedMovie = useDebounce(movieInput.value, 1000);
  const movie = useMovie(debouncedMovie);

  return (
    <div>
      <input {...movieInput} placeholder="Search for an movie" />
      <Movie movieSearched={movie} createMovie={createMovie} />
    </div>
  );
};

export default MovieSearch;
