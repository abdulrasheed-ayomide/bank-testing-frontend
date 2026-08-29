import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? '/api/v1' : 'https://bank-testing-backend.onrender.com/api/v1'
);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// User access tokens remain in memory. The admin JWT is persisted separately
// because the admin auth system has no refresh-token endpoint.
let accessToken = null;
const ADMIN_TOKEN_KEY = 'sfb_admin_token';
let adminToken = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_TOKEN_KEY) : null;

export function setAccessToken(token) {
  accessToken = token;
}
export function setAdminToken(token) {
  adminToken = token;
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}
export function getAccessToken() {
  return accessToken;
} 
export function getAdminToken() {
  return adminToken;
}

function isAdminUrl(url = '') {
  return /(?:^|\/)admin(?:\/|$)/i.test(url);
}

// The admin login request itself hits an admin-prefixed URL and can
// legitimately 401 on wrong credentials — that must reach AdminLogin's own
// catch block as a normal rejected promise, not be treated as "session
// expired." Only a 401 from an *authenticated* admin request (anything
// other than the login call) means the session itself is invalid.
function isAdminLoginUrl(url = '') {
  return /\/admin\/login$/i.test(url);
}

// axios interceptors run outside the React tree, so they can't call
// setState directly. AdminAuthContext registers a callback here on mount;
// when an authenticated admin request comes back 401, we hand off to React
// state instead of forcing a hard window.location reload — that lets
// AdminProtectedRoute's existing declarative <Navigate> do the redirect,
// consistent with how the rest of the app already works, without blowing
// away in-memory state or causing a jarring full-page reload.
let onAdminUnauthorized = null;
export function registerAdminUnauthorizedHandler(handler) {
  onAdminUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const isAdminRequest = isAdminUrl(config.url);
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
    const isAdminRequest = isAdminUrl(original?.url);
    const isAuthRoute = original?.url?.startsWith('/auth');

    if (
      error.response?.status === 401 &&
      isAdminRequest &&
      !isAdminLoginUrl(original?.url) &&
      !original?._adminAuthHandled
    ) {
      original._adminAuthHandled = true;
      setAdminToken(null);
      onAdminUnauthorized?.();
    }

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
