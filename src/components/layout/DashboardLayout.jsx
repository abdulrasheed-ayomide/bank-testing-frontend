import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

const titleMap = {
  '/dashboard': 'Overview',
  '/dashboard/transfer': 'Transfer Funds',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/profile': 'Profile & Security',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = titleMap[location.pathname] || 'Dashboard';

  return (
    <div className="dashboard-layout">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <DashboardTopbar onMenuClick={() => setSidebarOpen((o) => !o)} title={title} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
