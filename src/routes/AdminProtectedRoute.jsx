import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/useAdminAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, initializing } = useAdminAuth();

  // Wait for the stored token to be verified against GET /admin/me before
  // deciding — otherwise a stale/expired token renders the dashboard for a
  // moment before the first API call fails and kicks the admin back out.
  if (initializing) {
    return <LoadingSpinner full label="Verifying admin session" />;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
