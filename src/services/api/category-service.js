import apiClient from '../api-client';

export const categoryService = {
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
  },

  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch category');
    }
  },

  async createCategory(data) {
    try {
      const response = await apiClient.post('/categories', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create category');
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await apiClient.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update category');
    }
  },

  async deleteCategory(id) {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete category');
    }
  },
};