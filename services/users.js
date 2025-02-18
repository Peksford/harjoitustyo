import axios from 'axios';
const baseUrl = '/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserAlbums = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data.albums;
};

const getUserMovies = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data.movies;
};

const getUserBooks = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data.books;
};

const getUserGames = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data.games;
};

const newUser = async ({ username, name, password }) => {
  const response = await axios.post(`${baseUrl}`, { username, name, password });
  return response.data;
};

export default {
  getAll,
  getUserAlbums,
  newUser,
  getUserBooks,
  getUserMovies,
  getUserGames,
};
