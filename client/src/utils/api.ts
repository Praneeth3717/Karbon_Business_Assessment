import axios from 'axios';

export const API_BASE_URL = 'https://karbon-business-assessment.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
