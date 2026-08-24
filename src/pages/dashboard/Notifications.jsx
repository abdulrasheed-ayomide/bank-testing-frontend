import { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as notificationApi from '../../services/notificationApi';
import { formatDate } from '../../utils/formatCurrency';
import styles from './Notifications.module.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await notificationApi.listNotifications();
        if (!cancelled) setNotifications(data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load notifications.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const markRead = async (id) => {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationApi.markRead(id);
    } catch {
      setNotifications(previous); // revert on failure
    }
  };

  return (
    <Card padded={false}>
      {loading ? (
        <LoadingSpinner label="Loading notifications" />
      ) : error ? (
        <EmptyState icon={<FiBell />} title="Couldn't load notifications" description={error} />
      ) : notifications.length === 0 ? (
        <EmptyState icon={<FiBell />} title="You're all caught up" description="New account activity will appear here." />
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`${styles.item} ${!n.read ? styles.unread : ''}`}
              onClick={() => markRead(n.id)}
            >
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.info}>
                <span className={styles.title}>{n.title}</span>
                <span className={styles.body}>{n.body}</span>
                <span className={styles.date}>{formatDate(n.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
