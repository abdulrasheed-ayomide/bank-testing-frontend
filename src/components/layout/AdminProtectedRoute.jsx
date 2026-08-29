import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import PageLoader from '../common/PageLoader';

const AdminProtectedRoute = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return <PageLoader label="Checking admin session..." />;

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;
