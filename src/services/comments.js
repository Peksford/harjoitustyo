import axios from 'axios';
const baseUrl = '/api/comments';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// const getAll = async () => {
//   const response = await axios.get(baseUrl);
//   return response.data;
// };

const getComments = async (id) => {
  const response = await axios.get(`${baseUrl}`, {
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    params: { group_id: id },
  });
  return response.data;
};

const create = async (groupId, comment) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log('group id: ', groupId);
  console.log('comment: ', comment);

  const response = await axios.post(
    baseUrl,
    { comment, group_id: groupId },
    config
  );
  return response.data;
};

export default {
  setToken,
  create,
  getComments,
};
