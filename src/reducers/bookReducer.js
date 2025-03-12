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
    // increaseLike(state, action) {
    //   const id = action.payload
    //   return state.map((book) =>
    //     book.id === id ? { ...book, likes: book.likes + 1 } : book
    //   )
    // },
    deleteBookId(state, action) {
      const bookIdToDelete = action.payload;
      return state.filter((book) => book.id !== bookIdToDelete);
    },
  },
});

export const { appendBook, setBooks, increaseLike, deleteBookId } =
  bookSlice.actions;

export const addBook = (content) => {
  return async (dispatch) => {
    const newBook = await bookService.create(content);
    dispatch(appendBook(newBook));
    return newBook;
  };
};

// export const bookLike = (book) => {
//   return async (dispatch) => {
//     const likeIncrease = await bookService.put(book.id, {
//       ...book,
//       likes: book.likes + 1,
//     })
//     dispatch(increaseLike(likeIncrease.id))
//   }
// }

export const deleteBook = (id) => {
  return async (dispatch) => {
    await bookService.deleteBook(id);
    dispatch(deleteBookId(id));
  };
};

export default bookSlice.reducer;
