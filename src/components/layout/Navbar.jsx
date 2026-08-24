import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from '../common/Button';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/security', label: 'Security' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.mark}>SFB</span>
          <span className={styles.name}>Spring Financial Bank</span>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className={styles.navActions}>
            <Link to="/login" className={styles.link} onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button variant="accent" size="sm">Open an Account</Button>
            </Link>
          </div>
        </nav>

        <button className={styles.toggle} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </header>
  );
}
