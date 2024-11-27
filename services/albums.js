import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/albums';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getAlbum = async (id, token) => {
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

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const updatedAlbum = async (id, updatedData) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedData, config);
  return response.data;
};

export default { getAll, setToken, create, getAlbum, updatedAlbum };
