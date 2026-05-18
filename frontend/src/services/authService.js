import api from './api';

export const registerUser = (payload) => api.post('/auth/register', payload).then((res) => res.data);
export const loginUser = (payload) => api.post('/auth/login', payload).then((res) => res.data);
export const logoutUser = () => api.post('/auth/logout').then((res) => res.data);
export const fetchMe = () => api.get('/auth/me').then((res) => res.data);
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload).then((res) => res.data);
export const resetPassword = (token, payload) => api.post(`/auth/reset-password/${token}`, payload).then((res) => res.data);