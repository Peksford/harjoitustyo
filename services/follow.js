import axios from 'axios';
const baseUrl = '/api/follow';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const newFollow = async (user, userData) => {
  const newObject = {
    followed_id: userData.id,
    followed_username: userData.username,
    follower_username: user.username,
  };

  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const unFollow = async (user, userData) => {
  const config = {
    headers: {
      Authorization: token,
      followed_id: userData.id,
    },
  };

  const response = await axios.delete(baseUrl, config);
  return response.data;
};

export default {
  newFollow,
  setToken,
  unFollow,
};
