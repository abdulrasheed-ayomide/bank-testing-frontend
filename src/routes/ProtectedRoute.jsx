import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  // Wait for the silent-refresh bootstrap to finish before deciding —
  // otherwise a real logged-in user gets bounced to /login on every reload.
  if (initializing) {
    return <LoadingSpinner full label="Loading your account" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
