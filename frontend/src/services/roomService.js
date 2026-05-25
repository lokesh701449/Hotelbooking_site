import api from './api';

export const getAllRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const getRoomsByHotel = async (hotelId) => {
  const response = await api.get(`/rooms/hotel/${hotelId}`);
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

export const getAvailableRooms = async (checkIn, checkOut, hotelId = null) => {
  const response = await api.get('/rooms/available', {
    params: {
      checkIn,
      checkOut,
      ...(hotelId ? { hotelId } : {}),
    },
  });
  return response.data;
};

export const createRoom = async (roomDTO) => {
  const response = await api.post('/rooms', roomDTO);
  return response.data;
};

export const updateRoom = async (id, roomDTO) => {
  const response = await api.put(`/rooms/${id}`, roomDTO);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};
