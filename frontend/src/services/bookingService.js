import api from './api';

export const createBooking = (payload) => api.post('/bookings', payload).then((res) => res.data);
export const fetchMyBookings = () => api.get('/bookings/me').then((res) => res.data);
export const fetchAllBookings = () => api.get('/bookings').then((res) => res.data);
export const updateBookingApproval = (id, payload) => api.patch(`/bookings/${id}/approval`, payload).then((res) => res.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then((res) => res.data);