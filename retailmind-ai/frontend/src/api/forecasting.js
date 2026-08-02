import api from './axios';

export const predictDemand = async (payload) => {
  const response = await api.post('/forecasting/predict/', payload);
  return response.data;
};

export const getForecastHistory = async (params = {}) => {
  const response = await api.get('/forecasting/history/', { params });
  return response.data;
};
