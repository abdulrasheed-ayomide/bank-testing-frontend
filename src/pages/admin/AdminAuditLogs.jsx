import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminApi from '../../services/adminApi';
import { formatAccountNumber, formatDate } from '../../utils/formatCurrency';
import styles from './AdminDashboard.module.css';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminApi.listAuditLogs()
      .then((data) => { if (!cancelled) setLogs(data); })
      .catch((err) => { if (!cancelled) setError(err?.response?.data?.message || 'Could not load audit logs.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Card padded={false}>
      {loading ? (
        <LoadingSpinner label="Loading audit logs" />
      ) : error ? (
        <EmptyState title="Couldn't load audit logs" description={error} />
      ) : logs.length === 0 ? (
        <EmptyState title="No audit activity yet" description="Admin actions will be recorded here." />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Action</th>
                <th>Admin</th>
                <th>Target</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><Badge tone="info">{log.action.replace(/_/g, ' ')}</Badge></td>
                  <td>{log.admin}</td>
                  <td className="mono">{log.target !== '-' && /^\d{9}$/.test(log.target) ? formatAccountNumber(log.target) : log.target}</td>
                  <td>{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
