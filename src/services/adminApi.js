import api, { setAdminToken } from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

export async function adminLogin({ email, password }) {
  const data = await unwrap(api.post('/admin/login', { email, password }));
  setAdminToken(data.token);
  return data.admin;
}

export function adminLogout() {
  return unwrap(api.post('/admin/logout'));
}

export function getOverview() {
  return unwrap(api.get('/admin/overview'));
}

export async function listUsers(query) {
  const data = await unwrap(api.get('/admin/users', { params: query ? { q: query } : {} }));
  return data.users;
}

export function getUserDetail(id) {
  return unwrap(api.get(`/admin/users/${id}`));
}

export async function setUserStatus(userId, status) {
  const data = await unwrap(api.patch(`/admin/users/${userId}/status`, { status }));
  return data.user;
}

export async function creditAccount(accountId, { amount, currency, description }) {
  const data = await unwrap(
    api.post(`/admin/accounts/${accountId}/credit`, { amount, currency, description })
  );
  return data.transaction;
}

function mapTransaction(tx) {
  return {
    id: tx._id,
    reference: tx.reference,
    type: tx.type,
    direction: tx.direction,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    description: tx.description,
    date: tx.createdAt,
  };
}

export async function listAllTransactions() {
  const data = await unwrap(api.get('/admin/transactions'));
  return data.transactions.map(mapTransaction);
}

function mapAuditLog(log) {
  return {
    id: log._id,
    action: log.action,
    admin: log.admin,
    target: log.target || '-',
    timestamp: log.createdAt,
  };
}

export async function listAuditLogs() {
  const data = await unwrap(api.get('/admin/audit-logs'));
  return data.logs.map(mapAuditLog);
}
