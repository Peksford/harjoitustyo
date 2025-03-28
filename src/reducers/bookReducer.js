import { createSlice } from '@reduxjs/toolkit';
import bookService from '../services/books';

const bookSlice = createSlice({
  name: 'books',
  initialState: [],
  reducers: {
    appendBook(state, action) {
      state.push(action.payload);
    },
    setBooks(state, action) {
      return action.payload;
    },
    setHeart(state, action) {
      const id = action.payload;
      return state.map((book) =>
        book.id === id ? { ...book, heart: true } : book
      );
    },
    deleteBookId(state, action) {
      const bookIdToDelete = action.payload;
      return state.filter((book) => book.id !== bookIdToDelete);
    },
  },
});

export const { appendBook, setBooks, setHeart, deleteBookId } =
  bookSlice.actions;

export const addBook = (content) => {
  return async (dispatch) => {
    const newBook = await bookService.create(content);
    dispatch(appendBook(newBook));
    return newBook;
  };
};

export const bookHeart = (book) => {
  return async (dispatch) => {
    const heartChange = await bookService.heartClick(book.id, {
      ...book,
      heart: true,
    });
    dispatch(setHeart(heartChange.id));
  };
};

export const deleteBook = (id) => {
  return async (dispatch) => {
    await bookService.deleteBook(id);
    dispatch(deleteBookId(id));
  };
};

export default bookSlice.reducer;
