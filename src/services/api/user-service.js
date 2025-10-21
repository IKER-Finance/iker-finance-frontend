import apiClient from '../api-client';

/**
 * User Service
 * Handles all user profile and settings related API calls
 */
export const userService = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile (firstName and lastName)
   * @param {Object} data - Profile data
   * @param {string} data.firstName - User's first name
   * @param {string} data.lastName - User's last name
   * @returns {Promise} Updated user profile
   */
  async updateProfile(data) {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} data - Password data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise} Success response
   */
  async changePassword(data) {
    const response = await apiClient.put('/users/password', data);
    return response.data;
  },

  /**
   * Get user settings
   * @returns {Promise} User settings (currencies and timezone)
   */
  async getSettings() {
    const response = await apiClient.get('/users/settings');
    return response.data;
  },

  /**
   * Update user settings
   * @param {Object} data - Settings data
   * @param {number|null} data.defaultTransactionCurrencyId - Default transaction currency ID
   * @param {string} data.timeZone - User's timezone
   * @returns {Promise} Updated settings
   */
  async updateSettings(data) {
    const response = await apiClient.put('/users/settings', data);
    return response.data;
  },
};
