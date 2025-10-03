import apiClient from '../api-client';

export const budgetService = {
  async getBudgets(params) {
    try {
      const response = await apiClient.get('/budgets', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch budgets');
    }
  },

  async getBudgetById(id) {
    try {
      const response = await apiClient.get(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch budget');
    }
  },

  async createBudget(data) {
    try {
      const response = await apiClient.post('/budgets', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create budget');
    }
  },

  async updateBudget(id, data) {
    try {
      const response = await apiClient.put(`/budgets/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update budget');
    }
  },

  async deleteBudget(id) {
    try {
      await apiClient.delete(`/budgets/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete budget');
    }
  },
};