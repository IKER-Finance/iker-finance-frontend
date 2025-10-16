import apiClient from '../api-client';

export const feedbackService = {
  async submitFeedback(data) {
    try {
      const response = await apiClient.post('/feedback', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit feedback');
    }
  },
};
