import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/follow';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const newFollow = async (user, userData) => {
  console.log('FOLLOw', user.username);
  const newObject = {
    followed_id: userData.id,
    followed_username: userData.username,
    follower_username: user.user.username,
  };
  console.log('tokeni', token);
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const unFollow = async (user, userData) => {
  console.log('UNFOLLOw');
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
