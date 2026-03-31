import axios from 'axios';

// Get base URL from environment or default to production Railway backend
const baseURL = import.meta.env.VITE_API_URL || 'https://loan-sanju-production.up.railway.app/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error(`[API REQUEST ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle specialized data logging and 401 Unauthorized globally
api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API RESPONSE ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
