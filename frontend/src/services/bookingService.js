import api from './api';

export const createBooking = async (bookingRequest) => {
  const response = await api.post('/bookings', bookingRequest);
  return response.data;
};

export const getBookingsByUser = async (userId) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};
