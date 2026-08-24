import axios from 'axios';

// Base URL comes from env — never hardcode localhost or production URLs here.
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory only — never localStorage/sessionStorage for tokens. A page
// reload clears these; AuthContext re-establishes the user session via a
// silent /auth/refresh call using the httpOnly cookie. Admin sessions are
// not silently restored (no refresh endpoint for admin, by design — see
// AdminAuthContext), so an admin reload requires logging in again.
let accessToken = null;
let adminToken = null;

export function setAccessToken(token) {
  accessToken = token;
}
export function setAdminToken(token) {
  adminToken = token;
}
export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  const isAdminRequest = config.url?.startsWith('/admin');
  const token = isAdminRequest ? adminToken : accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent-refresh-and-retry: if a user request fails with 401 (expired access
// token), try /auth/refresh exactly once using the refresh cookie, then
// retry the original request with the new token. Admin requests are never
// auto-refreshed — an expired admin token should force a real re-login.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAdminRequest = original?.url?.startsWith('/admin');
    const isAuthRoute = original?.url?.startsWith('/auth');

    if (
      error.response?.status === 401 &&
      !isAdminRequest &&
      !isAuthRoute &&
      !original._retried
    ) {
      original._retried = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/refresh').finally(() => {
            refreshPromise = null;
          });
        }
        const { data } = await refreshPromise;
        setAccessToken(data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
