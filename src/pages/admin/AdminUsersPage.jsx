import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const STATUS_OPTIONS = ['', 'active', 'suspended', 'frozen', 'pending_verification'];
const KYC_OPTIONS = ['', 'not_started', 'pending', 'verified', 'rejected'];

const statusBadgeClass = (status) => {
  const map = {
    active: 'badge-success',
    suspended: 'badge-warning',
    frozen: 'badge-danger',
    pending_verification: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', kycStatus: '' });
  const toast = useToast();

  const fetchUsers = useCallback(
    async (page = 1, currentFilters = filters) => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
        const { data } = await adminService.listUsers(params);
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load customers.'));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchUsers(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = (e) => {
    e.preventDefault();
    fetchUsers(1, filters);
  };

  return (
    <div className="flex-col gap-6">
      <div className="card">
        <form onSubmit={applyFilters} className="grid grid-3" style={{ alignItems: 'end' }}>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="search">Search</label>
            <input
              id="search"
              className="form-input"
              placeholder="Name, email, username, phone"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="status">Account status</label>
            <select id="status" className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.replace('_', ' ') : 'All statuses'}</option>
              ))}
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="kycStatus">KYC status</label>
            <div className="flex gap-2">
              <select id="kycStatus" className="form-select" value={filters.kycStatus} onChange={(e) => handleFilterChange('kycStatus', e.target.value)}>
                {KYC_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt ? opt.replace('_', ' ') : 'All KYC statuses'}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary">Filter</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton skeleton-text" style={{ height: '48px' }} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState title="No customers found" description="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Account number</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>KYC</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                      <div className="text-xs text-muted">{u.email}</div>
                    </td>
                    <td className="mono text-sm">{u.account?.accountNumber || '—'}</td>
                    <td className="mono">{u.account ? formatCurrency(u.account.balance) : '—'}</td>
                    <td><span className={`badge ${statusBadgeClass(u.accountStatus)}`} style={{ textTransform: 'capitalize' }}>{u.accountStatus.replace('_', ' ')}</span></td>
                    <td><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{u.kycStatus.replace('_', ' ')}</span></td>
                    <td className="text-sm text-muted">{formatDate(u.createdAt)}</td>
                    <td>
                      <Link to={`/admin/users/${u._id}`} className="btn btn-sm btn-secondary">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => fetchUsers(page, filters)} />
      </div>
    </div>
  );
};

export default AdminUsersPage;
