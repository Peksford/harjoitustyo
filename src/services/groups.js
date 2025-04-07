import axios from 'axios';
const baseUrl = '/api/groups';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getGroup = async (id) => {
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

const createMembers = async ({ group_id, user_id }) => {
  console.log('testing', group_id);
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(
    `${baseUrl}/${group_id}/members`,
    { userId: user_id },
    config
  );
  return response.data;
};

export default {
  getAll,
  setToken,
  create,
  createMembers,
  getGroup,
};
