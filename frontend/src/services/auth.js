import { api } from './api';

export const initiateGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
};

export const logout = () => api.post('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');
