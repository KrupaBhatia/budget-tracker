// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://budget-tracker-backend-310226327961.asia-south1.run.app/api', // your API base URL
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;
