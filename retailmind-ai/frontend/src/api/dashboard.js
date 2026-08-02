import api from './axios';

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary/');
  return response.data;
};

export const getStockAlerts = async () => {
  const response = await api.get('/dashboard/alerts/');
  return response.data;
};

export const getDashboardCharts = async () => {
  const response = await api.get('/dashboard/charts/');
  return response.data;
};
