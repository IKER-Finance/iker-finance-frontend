import apiClient from '../api-client';
import { tokenService } from '../../utils/token';
import store from '../../redux/store';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  registerStart,
  registerSuccess, 
  registerFailure,
  logout as logoutAction,
  setAuthFromStorage 
} from '../../redux/feature/auth-slice';

export const authService = {
  async login(credentials) {
    store.dispatch(loginStart());

    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;

      tokenService.setToken(token);
      tokenService.setUser(user);

      store.dispatch(loginSuccess({ token, user }));

      return response.data;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || data.title || errorMessage;

        if (data.errors && typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors).flat();
          errorMessage = errorMessages.join('. ');
        }
      }

      store.dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  },

  async register(userData) {
    store.dispatch(registerStart());
    
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      
      tokenService.setToken(token);
      tokenService.setUser(user);
      
      store.dispatch(registerSuccess({ token, user }));
      
      return response.data;
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || data.title || errorMessage;

        if (data.errors && typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors).flat();
          errorMessage = errorMessages.join('. ');
        }
      }

      store.dispatch(registerFailure(errorMessage));
      throw new Error(errorMessage);
    }
  },

  logout() {
    tokenService.removeToken();
    store.dispatch(logoutAction());
  },

  initializeAuth() {
    const token = tokenService.getToken();
    const user = tokenService.getUser();
    
    if (token && user) {
      store.dispatch(setAuthFromStorage({ token, user }));
      return true;
    }
    
    return false;
  },

  getCurrentUser() {
    return tokenService.getUser();
  },

  isAuthenticated() {
    return tokenService.isAuthenticated();
  },
};