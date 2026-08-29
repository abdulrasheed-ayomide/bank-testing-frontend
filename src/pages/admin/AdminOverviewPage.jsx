import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';

const StatCard = ({ label, value, sub, accent }) => (
  <div className="card card-compact">
    <div className="text-xs text-muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    <div className="mono" style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, color: accent || 'var(--sfb-ink)' }}>{value}</div>
    {sub && <div className="text-sm text-muted mt-2">{sub}</div>}
  </div>
);

const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: res } = await adminService.getAnalyticsOverview();
        setData(res.data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load analytics.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  if (loading) {
    return (
      <div className="grid grid-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton skeleton-block" style={{ borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    );
  }

  const { users, transactions, dailyActivity } = data;
  const maxVolume = Math.max(...dailyActivity.map((d) => d.volume), 1);

  return (
    <div className="flex-col gap-6">
      <div className="grid grid-4">
        <StatCard label="Total customers" value={users.total} sub={`${users.active} active`} />
        <StatCard label="Suspended" value={users.suspended} accent="var(--sfb-warning)" />
        <StatCard label="Frozen" value={users.frozen} accent="var(--sfb-danger)" />
        <StatCard label="Pending verification" value={users.pendingVerification} accent="var(--sfb-muted)" />

        <StatCard label="Total transfers" value={transactions.total} />
        <StatCard label="Successful" value={transactions.successful} accent="var(--sfb-success)" />
        <StatCard label="Failed" value={transactions.failed} accent="var(--sfb-danger)" />
        <StatCard label="Reversed" value={transactions.reversed} accent="var(--sfb-muted)" />
      </div>

      <div className="card">
        <h3 className="mb-2">Total transaction volume</h3>
        <div className="mono" style={{ fontSize: 'var(--fs-2xl)', fontWeight: 600, color: 'var(--sfb-navy)' }}>
          {formatCurrency(transactions.totalVolume)}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Daily activity (last 14 days)</h3>
        {dailyActivity.length === 0 ? (
          <p className="text-muted">No transaction activity recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', overflowX: 'auto' }}>
            {dailyActivity.map((d) => (
              <div key={d.date} className="flex-col items-center" style={{ flex: '1 0 32px', minWidth: '32px' }}>
                <div
                  title={`${d.date}: ${d.transactionCount} transactions, ${formatCurrency(d.volume)}`}
                  style={{
                    width: '100%',
                    maxWidth: '28px',
                    height: `${Math.max((d.volume / maxVolume) * 140, 4)}px`,
                    backgroundColor: 'var(--sfb-blue)',
                    borderRadius: '4px 4px 0 0',
                    margin: '0 auto',
                  }}
                />
                <span className="text-xs text-muted mt-2" style={{ whiteSpace: 'nowrap' }}>
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
