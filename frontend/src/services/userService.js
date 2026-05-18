import api from './api';

export const getAllUsers = (params) => api.get('/users', { params }).then((res) => res.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((res) => res.data);
export const updateProfile = (formData) => api.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data);

export default { getAllUsers, deleteUser, updateProfile };
