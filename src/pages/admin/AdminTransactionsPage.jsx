import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const STATUS_OPTIONS = ['', 'pending', 'processing', 'successful', 'failed', 'reversed'];
const TYPE_OPTIONS = ['', 'transfer', 'reversal', 'deposit', 'withdrawal'];

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', type: '', startDate: '', endDate: '' });
  const toast = useToast();

  const fetchTransactions = useCallback(
    async (page = 1, currentFilters = filters) => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
        const { data } = await adminService.listTransactions(params);
        setTransactions(data.data.transactions);
        setPagination(data.data.pagination);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load transactions.'));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchTransactions(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = (e) => {
    e.preventDefault();
    fetchTransactions(1, filters);
  };

  const clearFilters = () => {
    const cleared = { search: '', status: '', type: '', startDate: '', endDate: '' };
    setFilters(cleared);
    fetchTransactions(1, cleared);
  };

  const handleDeleteTransaction = async (id) => {
    const confirmed = window.confirm(
      'Delete this transaction?'
    );

    if (!confirmed) return;

    try {
      await adminService.deleteTransaction(id);

      toast.success('Transaction deleted');

      fetchTransactions();
    } catch {
      toast.error('Could not delete transaction');
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="card">
        <form onSubmit={applyFilters} className="grid grid-4" style={{ alignItems: 'end' }}>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="search">Search</label>
            <input
              id="search"
              className="form-input"
              placeholder="Reference, name, account..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="status">Status</label>
            <select id="status" className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All statuses'}</option>
              ))}
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="type">Type</label>
            <select id="type" className="form-select" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All types'}</option>
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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton skeleton-text" style={{ height: '48px' }} />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState title="No transactions found" description="Try adjusting your filters." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="mono text-sm">{tx.reference}</td>
                    <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                    <td>{tx.sender.name}</td>
                    <td>{tx.recipient.name}</td>
                    <td className="mono">{formatCurrency(tx.amount, tx.currency)}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td className="text-sm text-muted">{formatDateTime(tx.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link  to={`/admin/transactions/${tx._id}`}  className="btn btn-sm btn-secondary" >
                          View
                        </Link>

                        <button className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTransaction(tx._id)}
                        > Delete </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => fetchTransactions(page, filters)} />
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
