import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminTopbar from '../admin/AdminTopbar';

const getTitle = (pathname) => {
  if (pathname === '/admin') return 'Overview';
  if (pathname === '/admin/users') return 'Customers';
  if (/^\/admin\/users\/.+/.test(pathname)) return 'Customer Detail';
  if (pathname === '/admin/transactions') return 'Transactions';
  if (/^\/admin\/transactions\/.+/.test(pathname)) return 'Transaction Detail';
  if (pathname === '/admin/audit-logs') return 'Audit Logs';
  return 'Admin Portal';
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <AdminTopbar onMenuClick={() => setSidebarOpen((o) => !o)} title={getTitle(location.pathname)} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
