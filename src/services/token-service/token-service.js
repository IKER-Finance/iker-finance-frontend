export const tokenService = {
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
    }
  },

  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-data', JSON.stringify(user));
    }
  },

  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  isAuthenticated() {
    return this.getToken() !== null;
  },
};