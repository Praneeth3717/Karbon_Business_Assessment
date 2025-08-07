import axios from 'axios';

const api = axios.create({
  baseURL: 'https://karbon-business-assessment.onrender.com',
  withCredentials: true,
});

export default api;
