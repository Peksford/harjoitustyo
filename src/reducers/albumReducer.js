import { createSlice } from '@reduxjs/toolkit';
import albumService from '../services/albums';

const albumSlice = createSlice({
  name: 'albums',
  initialState: [],
  reducers: {
    appendAlbum(state, action) {
      state.push(action.payload);
    },
    setAlbums(state, action) {
      return action.payload;
    },
    setHeart(state, action) {
      const id = action.payload;
      return state.map((album) =>
        album.id === id ? { ...album, heart: true } : album
      );
    },
    deleteAlbumId(state, action) {
      const albumIdToDelete = action.payload;
      return state.filter((album) => album.id !== albumIdToDelete);
    },
  },
});

export const { appendAlbum, setAlbums, setHeart, deleteAlbumId } =
  albumSlice.actions;

export const addAlbum = (content) => {
  return async (dispatch) => {
    const newAlbum = await albumService.create(content);
    dispatch(appendAlbum(newAlbum));
    return newAlbum;
  };
};

export const albumHeart = (album) => {
  return async (dispatch) => {
    const heartChange = await albumService.heartClick(album.id, {
      ...album,
      heart: true,
    });
    dispatch(setHeart(heartChange.id));
  };
};

export const deleteAlbum = (id) => {
  return async (dispatch) => {
    await albumService.deleteAlbum(id);
    dispatch(deleteAlbumId(id));
  };
};

export default albumSlice.reducer;
