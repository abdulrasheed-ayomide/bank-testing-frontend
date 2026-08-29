import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { to: '/#about', label: 'About' },
    { to: '/#features', label: 'Features' },
    { to: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="public-navbar">
      <div className="container public-navbar-inner">
        <Link to="/" aria-label="Spring Financial Bank home">
          <Logo />
        </Link>

        <nav className={`public-nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.to} href={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="public-nav-actions">
            <button
              className="btn-icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Open an account
            </Link>
          </div>
        </nav>

        <button
          className="public-nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default PublicNavbar;
