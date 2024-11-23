import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser, setUserName, setPassword } = loginSlice.actions;

export const userLogin = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password });
    dispatch(setUser(user));
    return user;
  };
};

export default loginSlice.reducer;
