import axios from 'axios';
const baseUrl = '/api/logout';

const logout = async (username) => {
  const response = await axios.delete(baseUrl, {
    headers: { username },
  });
  return response.data;
};

export default { logout };
