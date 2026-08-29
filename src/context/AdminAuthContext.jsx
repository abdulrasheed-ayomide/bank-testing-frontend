import { useState, useCallback, useEffect } from 'react';
import * as adminApi from '../services/adminApi';
import { getAdminToken, setAdminToken, registerAdminUnauthorizedHandler } from '../services/api';
import { AdminAuthContext } from './AdminAuthContextValue';

// Kept fully separate from AuthContext — admin session must never share
// state or tokens with a regular user session.

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  // Distinguishes "haven't verified the stored token yet" from "verified,
  // and there's no valid session" — AdminProtectedRoute must wait for this
  // before deciding, or a stale/expired token in localStorage would render
  // the dashboard shell for a moment before the first API call 401s.
  const [initializing, setInitializing] = useState(true);

  const clearAdminSession = useCallback(() => {
    setAdminToken(null);
    setAdmin(null);
    setIsAdminAuthenticated(false);
  }, []);

  // On mount: if a token is present in localStorage, verify it against the
  // backend via GET /admin/me before trusting it. Merely having a token
  // string does not mean the session is still valid — it may have expired
  // (JWT_ADMIN_EXPIRES) or been revoked. This is what makes a page reload
  // behave consistently instead of flashing the dashboard then bouncing
  // the admin back out once an API call fails.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const existingToken = getAdminToken();
      if (!existingToken) {
        setInitializing(false);
        return;
      }
      try {
        const adminData = await adminApi.getAdminMe();
        if (cancelled) return;
        setAdmin(adminData);
        setIsAdminAuthenticated(true);
      } catch {
        if (cancelled) return;
        clearAdminSession();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [clearAdminSession]);

  // Wire the axios layer's 401 handler (registered in services/api.js) to
  // React state, so an admin session expiring mid-use is handled by
  // AdminProtectedRoute's declarative <Navigate> instead of a hard
  // window.location reload.
  useEffect(() => {
    registerAdminUnauthorizedHandler(() => {
      clearAdminSession();
    });
    return () => registerAdminUnauthorizedHandler(null);
  }, [clearAdminSession]);

  const adminLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      await adminApi.adminLogin({ email, password });
      const adminData = await adminApi.getAdminMe();
      setAdmin(adminData);
      setIsAdminAuthenticated(true);
      return adminData;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogout = useCallback(async () => {
    try {
      await adminApi.adminLogout();
    } catch {
      // Clear local state regardless — a failed logout call server-side
      // must never leave the frontend still believing it's authenticated.
    }
    clearAdminSession();
  }, [clearAdminSession]);

  const value = { admin, isAdminAuthenticated, loading, initializing, adminLogin, adminLogout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
