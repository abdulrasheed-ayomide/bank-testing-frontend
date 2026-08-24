import api from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

export function register({ firstName, lastName, email, phone, password, transactionPin }) {
  return unwrap(
    api.post('/auth/register', { firstName, lastName, email, phone, password, transactionPin })
  );
}

export function verifyEmail({ email, otp }) {
  return unwrap(api.post('/auth/verify-email', { email, otp }));
}

export function resendOtp({ email, purpose }) {
  return unwrap(api.post('/auth/resend-otp', { email, purpose }));
}

export function login({ email, password }) {
  return unwrap(api.post('/auth/login', { email, password }));
}

export function refresh() {
  return unwrap(api.post('/auth/refresh'));
}

export function logout() {
  return unwrap(api.post('/auth/logout'));
}

export function forgotPassword({ email }) {
  return unwrap(api.post('/auth/forgot-password', { email }));
}

export function resetPassword({ email, otp, newPassword }) {
  return unwrap(api.post('/auth/reset-password', { email, otp, newPassword }));
}
