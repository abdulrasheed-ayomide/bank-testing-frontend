import React from 'react';

/**
 * Spring Financial Bank wordmark + monogram.
 * The "ledger mark" S is built from two offset bars suggesting a passbook
 * ledger line and a rising trend — used consistently across public site,
 * dashboard, and admin portal as the brand's signature element.
 */
const Logo = ({ size = 'md', withWordmark = true, className = '' }) => {
  const dims = { sm: 28, md: 34, lg: 44 }[size] || 34;

  return (
    <span className={`sfb-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg width={dims} height={dims} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="var(--sfb-navy)" />
        <path
          d="M11 25.5c0-2.7 2.5-4 5.7-4.8 3.4-.9 5.1-1.6 5.1-3.2 0-1.4-1.4-2.2-3.5-2.2-2.4 0-4 1-4.9 2.9l-3.1-1.7c1.4-2.7 4.2-4.4 8-4.4 4.5 0 7.5 2.1 7.5 5.6 0 3.1-2.6 4.4-6.1 5.2-3.1.8-4.8 1.4-4.8 2.9 0 1.4 1.4 2.1 3.6 2.1 2.6 0 4.5-1.1 5.4-3.1l3.1 1.7c-1.4 3-4.5 4.6-8.5 4.6-4.6 0-7.5-2-7.5-5.6z"
          fill="#ffffff"
        />
      </svg>
      {withWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: size === 'lg' ? '1.4rem' : '1.15rem',
            color: 'var(--sfb-ink)',
            lineHeight: 1.1,
          }}
        >
          Spring Financial
          <span style={{ color: 'var(--sfb-blue)' }}> Bank</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
