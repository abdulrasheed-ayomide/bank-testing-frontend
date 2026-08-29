import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAdminAuth } from '../context/useAdminAuth';
import styles from './AdminLayout.module.css';

const TITLES = {
  '/admin/dashboard': 'Overview',
  '/admin/users': 'Users',
  '/admin/transactions': 'Transactions',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/partnership-mail': 'Partnership mail',
};

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Admin';

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
            <span className={styles.mark}>SFB · Workspace</span>
        </div>
        <AdminSidebar />
      </aside>

      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.brand}>
              <span className={styles.mark}>SFB · Workspace</span>
            </div>
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.left}>
            <button className={styles.menuBtn} onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <FiMenu size={20} />
            </button>
            <h2>{title}</h2>
          </div>
          <div className={styles.right}>
            <span className={styles.adminEmail}>{admin?.email}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <FiLogOut size={15} /> Log out
            </button>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
