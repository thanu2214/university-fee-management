import { api } from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response?.data?.token) {
      localStorage.setItem('feems_token', response.data.token);
      localStorage.setItem('feems_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('feems_token');
    localStorage.removeItem('feems_user');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('feems_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },
};
