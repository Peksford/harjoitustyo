import axios from 'axios';
const baseUrl = '/api/movies';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getMovie = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log('tv object', newObject);
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const updatedMovie = async (id, updatedData) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedData, config);
  return response.data;
};

const heartClick = async (id, updatedData) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/heart/${id}`,
    updatedData,
    config
  );
  return response.data;
};

const deleteMovie = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  setToken,
  create,
  getMovie,
  updatedMovie,
  heartClick,
  deleteMovie,
};
