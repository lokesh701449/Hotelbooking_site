import api from './api';

export const getPromotions = async () => {
  const response = await api.get('/promotions');
  return response.data;
};

export const getPromotionByCode = async (code) => {
  const response = await api.get(`/promotions/${code}`);
  return response.data;
};

export const createPromotion = async (promoDTO) => {
  const response = await api.post('/promotions', promoDTO);
  return response.data;
};
