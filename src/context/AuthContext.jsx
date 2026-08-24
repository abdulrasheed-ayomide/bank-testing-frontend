import { useState, useCallback, useEffect } from 'react';
import * as authApi from '../services/authApi';
import * as accountApi from '../services/accountApi';
import * as profileApi from '../services/profileApi';
import { setAccessToken } from '../services/api';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  // Distinguishes "we haven't checked for an existing session yet" from
  // "we checked and there isn't one" — ProtectedRoute should wait for this
  // before redirecting, or a real logged-in user gets bounced to /login on
  // every page reload while the silent refresh is still in flight.
  const [initializing, setInitializing] = useState(true);

  // On mount, try to silently restore a session using the httpOnly refresh
  // cookie. This is what makes a page reload not log the user out.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { accessToken } = await authApi.refresh();
        setAccessToken(accessToken);
        const [profile, acc] = await Promise.all([profileApi.getProfile(), accountApi.getMyAccount()]);
        if (cancelled) return;
        setUser(profile);
        setAccount(acc);
        setIsAuthenticated(true);
      } catch {
        // No valid refresh cookie — that's fine, just means logged out.
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { user: loggedInUser, account: acc, accessToken } = await authApi.login({ email, password });
      setAccessToken(accessToken);
      setUser(loggedInUser);
      setAccount(acc);
      setIsAuthenticated(true);
      return { user: loggedInUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      return await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        transactionPin: formData.pin,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      const { user: verifiedUser, account: acc, accessToken } = await authApi.verifyEmail({ email, otp });
      setAccessToken(accessToken);
      setUser(verifiedUser);
      setAccount(acc);
      setIsAuthenticated(true);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (email, purpose = 'EMAIL_VERIFICATION') => {
    return authApi.resendOtp({ email, purpose });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the API call fails, clear local state so the UI reflects logged-out.
    }
    setAccessToken(null);
    setUser(null);
    setAccount(null);
    setIsAuthenticated(false);
  }, []);

  const refreshAccount = useCallback(async () => {
    const acc = await accountApi.getMyAccount();
    setAccount(acc);
    return acc;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updatedUser = await profileApi.updateProfile(updates);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = {
    user,
    account,
    isAuthenticated,
    loading,
    initializing,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    refreshAccount,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
