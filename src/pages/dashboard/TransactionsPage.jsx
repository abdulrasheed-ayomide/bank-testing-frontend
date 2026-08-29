import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../../services/bankingService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { api } from '../../services/api';

const STATUS_OPTIONS = ['', 'pending', 'processing', 'successful', 'failed', 'reversed'];
const DIRECTION_OPTIONS = ['', 'incoming', 'outgoing'];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', direction: '', search: '', startDate: '', endDate: '' });
  const toast = useToast();

  const fetchTransactions = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const { data } = await transactionService.getHistory(params);
      setTransactions(data.data.transactions);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load transaction history.'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTransactions(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchTransactions(1, filters);
  };

  const clearFilters = () => {
    const cleared = { status: '', direction: '', search: '', startDate: '', endDate: '' };
    setFilters(cleared);
    fetchTransactions(1, cleared);
  };

  const handleReceipt = async (reference) => {
    try {
      const response = await api.get(
        `/transactions/${reference}/receipt`,
        {
          responseType: 'blob',
        }
      );

      const file = new Blob(
        [response.data],
        { type: 'application/pdf' }
      );

      const url = window.URL.createObjectURL(file);

      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
      toast.error('Unable to generate receipt.');
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
            <label className="form-label" htmlFor="direction">Direction</label>
            <select id="direction" className="form-select" value={filters.direction} onChange={(e) => handleFilterChange('direction', e.target.value)}>
              {DIRECTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All directions'}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Filter</button>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear</button>
          </div>
        </form>

        <div className="grid grid-2 mt-4">
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="startDate">From date</label>
            <input
              id="startDate"
              type="date"
              className="form-input"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <label className="form-label" htmlFor="endDate">To date</label>
            <input
              id="endDate"
              type="date"
              className="form-input"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton skeleton-text" style={{ height: '48px' }} />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters, or make your first transfer."
            action={<Link to="/dashboard/transfer" className="btn btn-primary btn-sm">Send money</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Counterparty</th>
                  <th>Direction</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIncoming = tx.direction === 'incoming';
                  const counterparty = isIncoming ? tx.sender : tx.recipient;
                  return (
                    <tr key={tx._id}>
                      <td className="mono text-sm">{tx.reference}</td>
                      <td>{counterparty.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{tx.direction}</td>
                      <td className={`mono ${isIncoming ? '' : ''}`}>
                        <span style={{ color: isIncoming ? 'var(--sfb-success)' : 'var(--sfb-danger)', fontWeight: 600 }}>
                          {isIncoming ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td><StatusBadge status={tx.status} /></td>
                      <td className="text-sm text-muted">{formatDateTime(tx.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleReceipt(tx.reference)}
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => fetchTransactions(page, filters)}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
