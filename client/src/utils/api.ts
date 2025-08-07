import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:5000'
  : 'https://karbon-business-assessment.onrender.com';



// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true,
// });

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export default api;
