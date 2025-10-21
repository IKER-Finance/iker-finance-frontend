import { STORAGE_KEYS } from '@/constants/app-constants';

export const tokenService = {
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }
  },

  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  isAuthenticated() {
    return this.getToken() !== null;
  },
};
