import { api } from './api';

export const accountService = {
  getDashboard: () => api.get('/accounts/dashboard'),
  getMyAccount: () => api.get('/accounts/me'),
};

export const transactionService = {
  verifyRecipient: (accountNumber) => api.get('/transactions/verify-recipient', { params: { accountNumber } }),
  transfer: (payload) => api.post('/transactions/transfer', payload),
  getHistory: (params) => api.get('/transactions', { params }),
  getByReference: (reference) => api.get(`/transactions/${reference}`),
  getReceiptUrl: (reference) => {
    const base = api.defaults.baseURL;
    return `${base}/transactions/${reference}/receipt`;
  },
};

export const profileService = {
  updateProfile: (payload) => api.patch('/profile', payload),
  uploadPhoto: (formData) =>
    api.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
