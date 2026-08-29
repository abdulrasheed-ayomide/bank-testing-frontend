import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const NotFoundPage = () => (
  <div className="flex-col items-center justify-center" style={{ minHeight: '100vh', textAlign: 'center', padding: 'var(--space-6)' }}>
    <Link to="/" style={{ marginBottom: 'var(--space-6)' }}>
      <Logo />
    </Link>
    <span className="mono text-muted" style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700, letterSpacing: '0.1em' }}>404</span>
    <h2 className="mt-4">Page not found</h2>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary">Back to home</Link>
  </div>
);

export default NotFoundPage;
