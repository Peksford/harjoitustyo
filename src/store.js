import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducers/loginReducer';
import notificationReducer from '../reducers/notificationReducer';

const store = configureStore({
  reducer: {
    user: loginReducer,
    notification: notificationReducer,
  },
});

export default store;
