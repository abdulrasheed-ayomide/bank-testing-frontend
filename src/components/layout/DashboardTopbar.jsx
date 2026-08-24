import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/useAuth';
import styles from './DashboardTopbar.module.css';

export default function DashboardTopbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
          <FiMenu size={20} />
        </button>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.userMenu} ref={ref}>
        <button className={styles.userBtn} onClick={() => setOpen((v) => !v)}>
          <span className={styles.avatar}>{initials || <FiUser size={14} />}</span>
          <span className={styles.userName}>{user ? `${user.firstName} ${user.lastName}` : 'Account'}</span>
          <FiChevronDown size={14} />
        </button>
        {open && (
          <div className={styles.dropdown}>
            <button className={styles.dropdownItem} onClick={() => { setOpen(false); navigate('/dashboard/profile'); }}>
              <FiUser size={15} /> Profile
            </button>
            <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleLogout}>
              <FiLogOut size={15} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
