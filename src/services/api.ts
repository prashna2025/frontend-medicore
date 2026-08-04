import axios from 'axios';
import { API_URL } from '../constants';
import { getStoredToken, removeStoredToken, removeStoredUser } from '../utils/token';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const lowerMsg = message.toLowerCase();

    if (status === 401 || status === 403 || lowerMsg.includes('jwt expired') || lowerMsg.includes('expired')) {
      removeStoredToken();
      removeStoredUser();
      localStorage.removeItem('medicore_token');
      localStorage.removeItem('medicore_user');
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
