import apiClient from '../api-client';

export const currencyService = {
  async getActiveCurrencies() {
    try {
      const response = await apiClient.get('/currencies');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch currencies');
    }
  },
};