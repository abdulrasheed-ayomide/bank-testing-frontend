import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiUserCheck, FiUserX, FiList } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as adminApi from '../../services/adminApi';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [overview, transactions] = await Promise.all([
          adminApi.getOverview(),
          adminApi.listAllTransactions(),
        ]);
        if (cancelled) return;
        setStats(overview);
        setRecent(transactions.slice(0, 5));
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load admin overview.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner full label="Loading overview" />;
  if (error) return <EmptyState title="Couldn't load overview" description={error} />;

  return (
    <div className={styles.wrap}>
      <div className={styles.statGrid}>
        <StatCard label="Total users" value={stats.totalUsers} icon={<FiUsers />} />
        <StatCard label="Active users" value={stats.activeUsers} icon={<FiUserCheck />} />
        <StatCard label="Disabled users" value={stats.disabledUsers} icon={<FiUserX />} tone="danger" />
        <StatCard label="Total transactions" value={stats.totalTransactions} icon={<FiList />} tone="amber" />
      </div>

      <div className={styles.recentHead}>
        <h3>Recent transactions</h3>
        <Link to="/admin/transactions" className={styles.viewAll}>View all</Link>
      </div>

      <Card padded={false}>
        {recent.length === 0 ? (
          <EmptyState title="No transactions yet" description="Activity will appear here once users start transacting." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className={styles.right}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => (
                  <tr key={tx.id}>
                    <td className="mono">{tx.reference}</td>
                    <td><Badge>{tx.type}</Badge></td>
                    <td>{tx.description || '—'}</td>
                    <td><Badge>{tx.status}</Badge></td>
                    <td className={`${styles.right} mono`}>{formatCurrency(tx.amount, tx.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
