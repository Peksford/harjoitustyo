import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducers/loginReducer';

const store = configureStore({
  reducer: {
    user: loginReducer,
  },
});

export default store;
