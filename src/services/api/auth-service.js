import apiClient from '../api-client';
import { tokenService } from '../token';
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
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
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
      const errorMessage = error.response?.data?.error || 'Registration failed';
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