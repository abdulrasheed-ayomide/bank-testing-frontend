import React from 'react';

const PageLoader = ({ label = 'Loading...' }) => (
  <div
    className="flex items-center justify-center"
    style={{ minHeight: '60vh' }}
    role="status"
    aria-live="polite"
  >
    <div className="flex-col items-center gap-2" style={{ textAlign: 'center' }}>
      <span className="spinner" style={{ width: '2rem', height: '2rem', color: 'var(--sfb-blue)' }} />
      <span className="text-muted text-sm mt-2">{label}</span>
    </div>
  </div>
);

export default PageLoader;
