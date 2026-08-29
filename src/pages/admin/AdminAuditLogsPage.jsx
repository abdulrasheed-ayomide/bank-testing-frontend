import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const SEVERITY_OPTIONS = ['', 'info', 'warning', 'critical'];
const ACTOR_OPTIONS = ['', 'user', 'admin', 'system'];

const severityBadgeClass = {
  info: 'badge-info',
  warning: 'badge-warning',
  critical: 'badge-danger',
};

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', actorType: '', severity: '', startDate: '', endDate: '' });
  const toast = useToast();

  const fetchLogs = useCallback(
    async (page = 1, currentFilters = filters) => {
      setLoading(true);
      try {
        const params = { page, limit: 20 };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
        const { data } = await adminService.listAuditLogs(params);
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load audit logs.'));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchLogs(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = (e) => {
    e.preventDefault();
    fetchLogs(1, filters);
  };

  const clearFilters = () => {
    const cleared = { action: '', actorType: '', severity: '', startDate: '', endDate: '' };
    setFilters(cleared);
    fetchLogs(1, cleared);
  };

  return (
    <div className="flex-col gap-6">
      <div className="card">
        <form onSubmit={applyFilters} className="grid grid-4" style={{ alignItems: 'end' }}>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="action">Action contains</label>
            <input
              id="action"
              className="form-input mono"
              placeholder="e.g. LOGIN, TRANSFER"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="actorType">Actor type</label>
            <select id="actorType" className="form-select" value={filters.actorType} onChange={(e) => handleFilterChange('actorType', e.target.value)}>
              {ACTOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All actors'}</option>
              ))}
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="severity">Severity</label>
            <select id="severity" className="form-select" value={filters.severity} onChange={(e) => handleFilterChange('severity', e.target.value)}>
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All severities'}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Filter</button>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear</button>
          </div>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex-col gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton skeleton-text" style={{ height: '40px' }} />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState title="No audit log entries found" description="Try adjusting your filters." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="mono text-sm">{log.action}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{log.actorType}</span>
                      {log.actorLabel && <div className="text-xs text-muted">{log.actorLabel}</div>}
                    </td>
                    <td className="text-sm">{log.description}</td>
                    <td><span className={`badge ${severityBadgeClass[log.severity] || 'badge-neutral'}`}>{log.severity}</span></td>
                    <td className="text-sm text-muted">{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => fetchLogs(page, filters)} />
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
