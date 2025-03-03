import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducers/loginReducer';
import notificationReducer from '../reducers/notificationReducer';
import albumReducer from '../reducers/albumReducer';

const store = configureStore({
  reducer: {
    user: loginReducer,
    notification: notificationReducer,
    albums: albumReducer,
  },
});

export default store;
