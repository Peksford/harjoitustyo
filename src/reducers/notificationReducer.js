import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationShow(state, action) {
      state = action.payload;
      return state;
    },
    notificationHide() {
      return null;
    },
  },
});

export const { notificationShow, notificationHide } = notificationSlice.actions;

export const setNotification = (text, time) => {
  return (dispatch) => {
    dispatch(notificationShow(text));
    setTimeout(() => dispatch(notificationHide('')), time * 1000);
  };
};

export default notificationSlice.reducer;
