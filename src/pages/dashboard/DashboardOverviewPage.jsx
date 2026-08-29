import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountService } from '../../services/bankingService';
import { formatCurrency, formatDateTime } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const quickActions = [
  {
    to: '/dashboard/transfer',
    label: 'Send money',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    to: '/dashboard/transactions',
    label: 'Transaction history',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    to: '/dashboard/profile',
    label: 'Account details',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
  {
    to: '/dashboard/notifications',
    label: 'Notifications',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

const DashboardOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: res } = await accountService.getDashboard();
        setData(res.data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load your dashboard.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex-col gap-4">
        <div className="skeleton skeleton-block" style={{ borderRadius: 'var(--radius-lg)' }} />
        <div className="grid grid-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton skeleton-block" style={{ borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
        <div className="skeleton skeleton-block" style={{ borderRadius: 'var(--radius-lg)', height: '240px' }} />
      </div>
    );
  }

  const { account, recentTransactions } = data;

  return (
    <div className="flex-col gap-6">
      {/* --- Balance card --- */}
      <div className="balance-card">
        <div className="balance-card-label">Available balance</div>
        <div className="balance-card-amount">{formatCurrency(account.balance, account.currency)}</div>
        <div className="balance-card-meta">
          <div className="balance-card-meta-item">
            <span>Account number</span>
            <span>{account.accountNumber}</span>
          </div>
          <div className="balance-card-meta-item">
            <span>Customer ID</span>
            <span>{account.customerId}</span>
          </div>
          <div className="balance-card-meta-item">
            <span>Account type</span>
            <span style={{ textTransform: 'capitalize' }}>{account.accountType}</span>
          </div>
          <div className="balance-card-meta-item">
            <span>Status</span>
            <span style={{ textTransform: 'capitalize' }}>{account.accountStatus}</span>
          </div>
        </div>
      </div>

      {/* --- Quick actions --- */}
      <div className="quick-actions">
        {quickActions.map((action) => (
          <Link to={action.to} className="quick-action-btn" key={action.to}>
            <span className="quick-action-icon">{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* --- Recent transactions --- */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent transactions</h3>
          <Link to="/dashboard/transactions" className="text-sm">View all</Link>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Once you send or receive money, your activity will appear here."
            action={
              <Link to="/dashboard/transfer" className="btn btn-primary btn-sm">
                Make your first transfer
              </Link>
            }
          />
        ) : (
          <div>
            {recentTransactions.map((tx) => {
              const isIncoming = tx.direction === 'incoming';
              const counterparty = isIncoming ? tx.sender : tx.recipient;
              return (
                <div className="tx-row" key={tx._id}>
                  <div className="tx-row-main">
                    <span className={`tx-icon ${tx.direction}`}>
                      {isIncoming ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      )}
                    </span>
                    <div className="tx-row-details">
                      <strong>{isIncoming ? `From ${counterparty.name}` : `To ${counterparty.name}`}</strong>
                      <span className="mono">{tx.reference}</span>
                    </div>
                  </div>
                  <div className="tx-row-end">
                    <span className={`tx-row-amount ${isIncoming ? 'positive' : 'negative'}`}>
                      {isIncoming ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                    </span>
                    <span className="tx-row-date">{formatDateTime(tx.createdAt)}</span>
                    <div className="mt-2">
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
