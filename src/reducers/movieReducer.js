import { createSlice } from '@reduxjs/toolkit';
import movieService from '../services/movies';

const movieSlice = createSlice({
  name: 'movies',
  initialState: [],
  reducers: {
    appendMovie(state, action) {
      state.push(action.payload);
    },
    setMovies(state, action) {
      return action.payload;
    },
    setHeart(state, action) {
      const id = action.payload;
      return state.map((movie) =>
        movie.id === id ? { ...movie, heart: true } : movie
      );
    },
    deleteMovieId(state, action) {
      const movieIdToDelete = action.payload;
      return state.filter((movie) => movie.id !== movieIdToDelete);
    },
  },
});

export const { appendMovie, setMovies, setHeart, deleteMovieId } =
  movieSlice.actions;

export const addMovie = (content) => {
  return async (dispatch) => {
    const newMovie = await movieService.create(content);
    dispatch(appendMovie(newMovie));
    return newMovie;
  };
};

export const movieHeart = (movie) => {
  return async (dispatch) => {
    const heartChange = await movieService.heartClick(movie.id, {
      ...movie,
      heart: true,
    });
    dispatch(setHeart(heartChange.id));
  };
};

export const deleteMovie = (id) => {
  return async (dispatch) => {
    await movieService.deleteMovie(id);
    dispatch(deleteMovieId(id));
  };
};

export default movieSlice.reducer;
