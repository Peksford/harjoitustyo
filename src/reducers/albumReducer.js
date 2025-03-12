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
    // increaseLike(state, action) {
    //   const id = action.payload
    //   return state.map((album) =>
    //     album.id === id ? { ...album, likes: album.likes + 1 } : album
    //   )
    // },
    deleteAlbumId(state, action) {
      const albumIdToDelete = action.payload;
      return state.filter((album) => album.id !== albumIdToDelete);
    },
  },
});

export const { appendAlbum, setAlbums, increaseLike, deleteAlbumId } =
  albumSlice.actions;

export const addAlbum = (content) => {
  return async (dispatch) => {
    const newAlbum = await albumService.create(content);
    dispatch(appendAlbum(newAlbum));
    return newAlbum;
  };
};

// export const albumLike = (album) => {
//   return async (dispatch) => {
//     const likeIncrease = await albumService.put(album.id, {
//       ...album,
//       likes: album.likes + 1,
//     })
//     dispatch(increaseLike(likeIncrease.id))
//   }
// }

export const deleteAlbum = (id) => {
  return async (dispatch) => {
    await albumService.deleteAlbum(id);
    dispatch(deleteAlbumId(id));
  };
};

export default albumSlice.reducer;
