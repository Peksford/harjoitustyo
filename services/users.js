import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserAlbums = async (username) => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data.albums;
};

const newUser = async ({ username, name, password }) => {
  console.log('tulostuuko tunnukset?', username, name, password);
  const response = await axios.post(`${baseUrl}`, { username, name, password });
  return response.data;
};

export default { getAll, getUserAlbums, newUser };
