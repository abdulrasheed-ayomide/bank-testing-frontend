import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import DashboardTopbar from '../components/layout/DashboardTopbar';
import styles from './DashboardLayout.module.css';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/send-money': 'Send Money',
  '/dashboard/add-money': 'Add Money',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/profile': 'Profile',
};

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Dashboard';

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.mark}>SFB</span>
          <span>Spring Financial Bank</span>
        </div>
        <DashboardSidebar />
      </aside>

      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.brand}>
              <span className={styles.mark}>SFB</span>
              <span>Spring Financial Bank</span>
            </div>
            <DashboardSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className={styles.main}>
        <DashboardTopbar onMenuClick={() => setDrawerOpen(true)} title={title} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
