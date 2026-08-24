import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminApi from '../../services/adminApi';
import { formatCurrency, formatAccountNumber } from '../../utils/formatCurrency';
import styles from './AdminDashboard.module.css';
import listStyles from './AdminUsers.module.css';

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await adminApi.listUsers(query);
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // debounce search-as-you-type

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className={styles.wrap}>
      <div className={listStyles.searchRow}>
        <FiSearch className={listStyles.searchIcon} />
        <input
          className={listStyles.searchInput}
          placeholder="Search by name, email, or account number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card padded={false}>
        {loading ? (
          <LoadingSpinner label="Loading users" />
        ) : error ? (
          <EmptyState title="Couldn't load users" description={error} />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" description="Try a different search term." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account number</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={listStyles.row} onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td className="mono">{u.accountNumber ? formatAccountNumber(u.accountNumber) : '—'}</td>
                    <td className="mono">{formatCurrency(u.balance, 'USD')}</td>
                    <td><Badge tone={u.status === 'ACTIVE' ? 'success' : 'danger'}>{u.status}</Badge></td>
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
