import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer';
import notificationReducer from './reducers/notificationReducer';
import albumReducer from './reducers/albumReducer';
import bookReducer from './reducers/bookReducer';
import movieReducer from './reducers/movieReducer';
import gameReducer from './reducers/gameReducer';
import groupReducer from './reducers/groupReducer';
import commentReducer from './reducers/commentReducer';

const store = configureStore({
  reducer: {
    user: loginReducer,
    notification: notificationReducer,
    albums: albumReducer,
    books: bookReducer,
    movies: movieReducer,
    games: gameReducer,
    groups: groupReducer,
    comments: commentReducer,
  },
});

export default store;
