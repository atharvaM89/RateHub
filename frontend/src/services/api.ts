import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected error occurred.',
      errorCode: 'UNKNOWN_ERROR',
    };
    return Promise.reject(customError);
  },
);

export default api;
