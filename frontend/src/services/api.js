import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true
});

const persistedToken = localStorage.getItem('token');

if (persistedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;
}

// Attach latest token from localStorage before each request so the
// Authorization header is always present even if token was set later.
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export const setApiToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem('token');
  delete api.defaults.headers.common.Authorization;
};

export const clearApiToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common.Authorization;
};

// If the backend includes a dev-only token in `response.data.meta.token`,
// set an Authorization header fallback for subsequent requests. This helps
// when cookies are intermittently blocked in development.
api.interceptors.response.use(
  (response) => {
    try {
      const token = response?.data?.meta?.token;
      if (token && import.meta.env.MODE !== 'production') {
        setApiToken(token);
      }
    } catch (e) {
      // ignore
    }
    return response;
  },
  (error) => Promise.reject(error?.response?.data?.message || 'Something went wrong')
);

export default api;