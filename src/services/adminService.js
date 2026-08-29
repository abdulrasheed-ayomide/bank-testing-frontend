import { adminApi } from './api';

export const adminAuthService = {
  login: (payload) => adminApi.post('/admin/auth/login', payload),
  logout: (refreshToken) => adminApi.post('/admin/auth/logout', { refreshToken }),
  getMe: () => adminApi.get('/admin/auth/me'),
  changePassword: (payload) => adminApi.post('/admin/auth/change-password', payload),
  createAdmin: (payload) => adminApi.post('/admin/auth/create-admin', payload),
};

export const adminService = {
  // Users
  listUsers: (params) => adminApi.get('/admin/users', { params }),
  creditAccount: (payload) => adminApi.post('/admin/credit-account', payload),
  getUserDetails: (id) => adminApi.get(`/admin/users/${id}`),
  updateUserStatus: (id, payload) => adminApi.patch(`/admin/users/${id}/status`, payload),
  updateKycStatus: (id, payload) => adminApi.patch(`/admin/users/${id}/kyc`, payload),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`),
  deleteTransaction: (id) => adminApi.delete(`/admin/transactions/${id}`),

  // Transactions
  listTransactions: (params) => adminApi.get('/admin/transactions', { params }),
  listFailedTransactions: (params) => adminApi.get('/admin/transactions/failed', { params }),
  listReversedTransactions: (params) => adminApi.get('/admin/transactions/reversed', { params }),
  getTransactionById: (id) => adminApi.get(`/admin/transactions/${id}`),
  reverseTransaction: (id, payload) => adminApi.post(`/admin/transactions/${id}/reverse`, payload),

  // Analytics
  getAnalyticsOverview: () => adminApi.get('/admin/analytics/overview'),

  // Audit logs
  listAuditLogs: (params) => adminApi.get('/admin/audit-logs', { params }),
};
