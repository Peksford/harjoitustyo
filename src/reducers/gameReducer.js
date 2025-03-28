import { createSlice } from '@reduxjs/toolkit';
import gameService from '../services/games';

const gameSlice = createSlice({
  name: 'games',
  initialState: [],
  reducers: {
    appendGame(state, action) {
      state.push(action.payload);
    },
    setGames(state, action) {
      return action.payload;
    },
    setHeart(state, action) {
      const id = action.payload;
      return state.map((game) =>
        game.id === id ? { ...game, heart: true } : game
      );
    },
    deleteGameId(state, action) {
      const gameIdToDelete = action.payload;
      return state.filter((game) => game.id !== gameIdToDelete);
    },
  },
});

export const { appendGame, setGames, setHeart, deleteGameId } =
  gameSlice.actions;

export const addGame = (content) => {
  return async (dispatch) => {
    const newGame = await gameService.create(content);
    dispatch(appendGame(newGame));
    return newGame;
  };
};

export const gameHeart = (game) => {
  return async (dispatch) => {
    const heartChange = await gameService.heartClick(game.id, {
      ...game,
      heart: true,
    });
    dispatch(setHeart(heartChange.id));
  };
};

export const deleteGame = (id) => {
  return async (dispatch) => {
    await gameService.deleteGame(id);
    dispatch(deleteGameId(id));
  };
};

export default gameSlice.reducer;
