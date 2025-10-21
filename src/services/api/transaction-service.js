import apiClient from '../api-client';

export const transactionService = {
  async getTransactions(params) {
    try {
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
    }
  },

  async getTransactionById(id) {
    try {
      const response = await apiClient.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transaction');
    }
  },

  async getTransactionSummary(params) {
    try {
      const response = await apiClient.get('/transactions/summary', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch summary');
    }
  },

  async createTransaction(data) {
    try {
      const response = await apiClient.post('/transactions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create transaction');
    }
  },

  async updateTransaction(id, data) {
    try {
      const response = await apiClient.put(`/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update transaction');
    }
  },

  async deleteTransaction(id) {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete transaction');
    }
  },
};