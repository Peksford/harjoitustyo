import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/logout';

const logout = async (username) => {
  console.log('logout username', username);
  const response = await axios.delete(baseUrl, {
    headers: { username },
  });
  return response.data;
};

export default { logout };
