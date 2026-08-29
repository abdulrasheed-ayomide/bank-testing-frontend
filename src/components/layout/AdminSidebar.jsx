import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiList, FiFileText, FiMail } from 'react-icons/fi';
import styles from './AdminSidebar.module.css';

const LINKS = [
  { to: '/admin/dashboard', label: 'Overview', icon: <FiGrid />, end: true },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/transactions', label: 'Transactions', icon: <FiList /> },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: <FiFileText /> },
  { to: '/admin/partnership-mail', label: 'Partnership mail', icon: <FiMail /> },
];

export default function AdminSidebar({ onNavigate }) {
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
