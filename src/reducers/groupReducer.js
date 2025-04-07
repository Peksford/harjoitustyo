import { createSlice } from '@reduxjs/toolkit';
import groupService from '../services/groups';

const groupSlice = createSlice({
  name: 'groups',
  initialState: [],
  reducers: {
    appendGroup(state, action) {
      state.push(action.payload);
    },
    setGroups(state, action) {
      return action.payload;
    },
    setHeart(state, action) {
      const id = action.payload;
      return state.map((group) =>
        group.id === id ? { ...group, heart: true } : group
      );
    },
    deleteGroupId(state, action) {
      const groupIdToDelete = action.payload;
      return state.filter((group) => group.id !== groupIdToDelete);
    },
  },
});

export const { appendGroup, setGroups, setHeart, deleteGroupId } =
  groupSlice.actions;

export const addGroup = (content) => {
  return async (dispatch) => {
    const newGroup = await groupService.create(content);
    dispatch(appendGroup(newGroup));
    return newGroup;
  };
};

export const groupHeart = (group) => {
  return async (dispatch) => {
    const heartChange = await groupService.heartClick(group.id, {
      ...group,
      heart: true,
    });
    dispatch(setHeart(heartChange.id));
  };
};

export const deleteGroup = (id) => {
  return async (dispatch) => {
    await groupService.deleteGroup(id);
    dispatch(deleteGroupId(id));
  };
};

export default groupSlice.reducer;
