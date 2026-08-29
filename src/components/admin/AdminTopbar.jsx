import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/format';

const AdminTopbar = ({ onMenuClick, title }) => {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="dashboard-topbar">
      <div className="flex items-center gap-3">
        <button className="dashboard-menu-toggle btn-icon" onClick={onMenuClick} aria-label="Toggle navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <h1 className="dashboard-topbar-title">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
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

        <div className="flex items-center gap-2">
          <span className="avatar">{getInitials(admin?.fullName)}</span>
          <div>
            <div className="text-sm" style={{ fontWeight: 600 }}>{admin?.fullName}</div>
            <div className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>{admin?.role}</div>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
};

export default AdminTopbar;
