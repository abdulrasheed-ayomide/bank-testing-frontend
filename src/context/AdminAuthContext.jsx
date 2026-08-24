import { useState, useCallback } from 'react';
import * as adminApi from '../services/adminApi';
import { setAdminToken } from '../services/api';
import { AdminAuthContext } from './AdminAuthContextValue';

// Kept fully separate from AuthContext — admin session must never share
// state, storage, or tokens with a regular user session. Unlike the user
// session, admin login is NOT silently restored on page reload (no admin
// refresh-token flow) — a reload means logging back in. That's an
// intentional simplicity trade-off for the admin flow.

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const adminData = await adminApi.adminLogin({ email, password });
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
      // Clear local state regardless.
    }
    setAdminToken(null);
    setAdmin(null);
    setIsAdminAuthenticated(false);
  }, []);

  const value = { admin, isAdminAuthenticated, loading, adminLogin, adminLogout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
