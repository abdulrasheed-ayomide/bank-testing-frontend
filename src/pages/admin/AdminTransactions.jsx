import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminApi from '../../services/adminApi';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import styles from './AdminDashboard.module.css';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminApi.listAllTransactions()
      .then((data) => { if (!cancelled) setTransactions(data); })
      .catch((err) => { if (!cancelled) setError(err?.response?.data?.message || 'Could not load transactions.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Card padded={false}>
      {loading ? (
        <LoadingSpinner label="Loading transactions" />
      ) : error ? (
        <EmptyState title="Couldn't load transactions" description={error} />
      ) : transactions.length === 0 ? (
        <EmptyState title="No transactions yet" description="Activity will appear here once users start transacting." />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th className={styles.right}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="mono">{tx.reference}</td>
                  <td><Badge>{tx.type}</Badge></td>
                  <td>{tx.description || '—'}</td>
                  <td>{formatDate(tx.date)}</td>
                  <td><Badge>{tx.status}</Badge></td>
                  <td className={`${styles.right} mono`}>{formatCurrency(tx.amount, tx.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
