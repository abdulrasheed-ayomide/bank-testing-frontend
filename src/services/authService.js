import { api } from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  resendOtp: (payload) => api.post('/auth/resend-otp', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  changePassword: (payload) => api.post('/auth/change-password', payload),
  getMe: () => api.get('/auth/me'),
};
