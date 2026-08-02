import api from './axios';

export const getInventory = async (params = {}) => {
  const response = await api.get('/inventory/', { params });
  return response.data;
};

export const createInventory = async (inventoryData) => {
  const response = await api.post('/inventory/', inventoryData);
  return response.data;
};

export const updateInventory = async (id, inventoryData) => {
  const response = await api.patch(`/inventory/${id}/`, inventoryData);
  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await api.delete(`/inventory/${id}/`);
  return response.data;
};
