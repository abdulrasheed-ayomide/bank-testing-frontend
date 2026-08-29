import React, { useEffect, useState, useCallback } from 'react';
import { notificationService } from '../../services/bankingService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const typeIcons = {
  debit_alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  credit_alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  ),
  reversal_alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  security_alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z" />
    </svg>
  ),
  default: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchNotifications = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const { data } = await notificationService.getNotifications({ page, limit: 15 });
        setNotifications(data.data.notifications);
        setPagination(data.data.pagination);
        setUnreadCount(data.data.unreadCount);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load notifications.'));
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      /* silent */
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Notifications {unreadCount > 0 && <span className="badge badge-info">{unreadCount} unread</span>}
        </h3>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton-text" style={{ height: '56px' }} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div>
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${!n.isRead ? 'is-unread' : ''}`}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              style={{ cursor: !n.isRead ? 'pointer' : 'default' }}
            >
              <span className="notification-item-icon">{typeIcons[n.type] || typeIcons.default}</span>
              <div className="notification-item-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <time>{formatDateTime(n.createdAt)}</time>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchNotifications} />
    </div>
  );
};

export default NotificationsPage;
