import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('havenkey_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing user token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
