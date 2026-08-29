import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../common/Logo';

const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-layout-panel">
      <div className="auth-layout-panel-content">
        <h2>Banking that respects your time.</h2>
        <p>
          Access your account, send secure transfers, and track every
          transaction in real time — all from one dashboard.
        </p>
        <ul className="auth-panel-list">
          <li>OTP-verified registration for every account</li>
          <li>Instant transfer confirmations by email</li>
          <li>Full transaction history with downloadable receipts</li>
        </ul>
      </div>
    </div>

    <div className="auth-layout-form">
      <div className="auth-layout-form-inner">
        <Link to="/" className="auth-logo-link">
          <Logo />
        </Link>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
