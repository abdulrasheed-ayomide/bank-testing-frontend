import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';

const navItems = [
  {
    to: '/admin',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'Customers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3" />
        <path d="M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
        <circle cx="17" cy="7" r="2.5" />
        <path d="M16 13.5c2.8.4 4.5 2 4.5 4.5" />
      </svg>
    ),
  },
  {
    to: '/admin/transactions',
    label: 'Transactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    to: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8M8 13h8M8 17h4" />
      </svg>
    ),
  },
  {
    to: '/admin/credit-account',
    label: 'Credit Account',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
  },
];

const AdminSidebar = ({ open, onClose }) => (
  <>
    {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
    <aside className={`dashboard-sidebar ${open ? 'is-open' : ''}`}>
      <div className="dashboard-sidebar-header">
        <Logo size="sm" />
        <span className="badge badge-info mt-2">Admin Portal</span>
      </div>
      <nav className="dashboard-nav" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'is-active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="dashboard-sidebar-footer">
        <p className="text-xs text-muted">
          Spring Financial Bank
          <br />
          Internal Operations
        </p>
      </div>
    </aside>
  </>
);

export default AdminSidebar;
