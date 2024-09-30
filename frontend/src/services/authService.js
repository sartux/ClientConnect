import axios from 'axios';

const API_URL = 'http://localhost:8000';

const login = async ({ company, username, password }) => {
  const response = await axios.post(`${API_URL}/login`, {
    company,
    username,
    password,
  });
  return response.data;
};

const requestPasswordReset = async (username) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { username });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { token, new_password: newPassword });
  return response.data;
};

export default {
  login,
  requestPasswordReset,
  resetPassword,
};
