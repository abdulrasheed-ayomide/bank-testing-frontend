import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiSend, FiPlusCircle, FiUser, FiBell } from 'react-icons/fi';
import styles from './DashboardSidebar.module.css';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/dashboard/transactions', label: 'Transactions', icon: <FiList /> },
  { to: '/dashboard/send-money', label: 'Send Money', icon: <FiSend /> },
  { to: '/dashboard/add-money', label: 'Add Money', icon: <FiPlusCircle /> },
  { to: '/dashboard/notifications', label: 'Notifications', icon: <FiBell /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
];

export default function DashboardSidebar({ onNavigate }) {
  return (
    <nav className={styles.nav}>
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={onNavigate}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
