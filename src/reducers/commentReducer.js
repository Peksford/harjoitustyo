import { createSlice } from '@reduxjs/toolkit';
import commentService from '../services/comments';

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments(state, action) {
      return action.payload;
    },
    appendComment(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setComments, appendComment } = commentSlice.actions;

export const addComment = (groupId, content) => {
  return async (dispatch) => {
    console.log('wadadp', content);
    const comment = await commentService.create(groupId, content);
    dispatch(appendComment(comment));
    const comments = await commentService.getComments(groupId);
    dispatch(setComments(comments));
  };
};

export default commentSlice.reducer;
