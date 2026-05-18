import api from './api';

export const fetchBuses = (params = {}) => api.get('/buses', { params }).then((res) => res.data);
export const fetchBus = (id) => api.get(`/buses/${id}`).then((res) => res.data);
export const fetchPopularRoutes = () => api.get('/buses/popular-routes').then((res) => res.data);

// When sending multipart FormData, ensure Authorization header is explicitly
// set from localStorage so token is always present even if other setups fail.
export const createBus = (payload) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	return api.post('/buses', payload, { headers }).then((res) => res.data);
};

export const updateBus = (id, payload) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	return api.put(`/buses/${id}`, payload, { headers }).then((res) => res.data);
};

export const deleteBus = (id) => api.delete(`/buses/${id}`).then((res) => res.data);