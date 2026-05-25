import api from './api';

export const getHotels = async (location = '') => {
  const response = await api.get('/hotels', {
    params: location ? { location } : {},
  });
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};

export const getLocations = async () => {
  const response = await api.get('/hotels/locations');
  return response.data;
};

export const createHotel = async (hotelDTO) => {
  const response = await api.post('/hotels', hotelDTO);
  return response.data;
};

export const updateHotel = async (id, hotelDTO) => {
  const response = await api.put(`/hotels/${id}`, hotelDTO);
  return response.data;
};

export const deleteHotel = async (id) => {
  const response = await api.delete(`/hotels/${id}`);
  return response.data;
};
