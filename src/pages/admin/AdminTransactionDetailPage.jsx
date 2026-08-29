import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import PageLoader from '../../components/common/PageLoader';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminTransactionDetailPage = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReverseModal, setShowReverseModal] = useState(false);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getTransactionById(id);
      setTransaction(data.data.transaction);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load transaction.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReverse = async () => {
    if (!reason.trim()) {
      toast.error('A reason is required to reverse this transaction.');
      return;
    }
    setActionLoading(true);
    try {
      await adminService.reverseTransaction(id, { reason });
      toast.success('Transaction reversed successfully.');
      setShowReverseModal(false);
      setReason('');
      fetchTransaction();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not reverse this transaction.'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader label="Loading transaction..." />;
  if (!transaction) return null;

  const canReverse = transaction.status === 'successful' && !transaction.reversalTransaction;

  return (
    <div className="flex-col gap-6">
      <Link to="/admin/transactions" className="text-sm">&larr; Back to transactions</Link>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="mb-1 mono">{transaction.reference}</h3>
            <StatusBadge status={transaction.status} />
          </div>
          {canReverse && (
            <button className="btn btn-danger btn-sm" onClick={() => setShowReverseModal(true)}>
              Reverse transaction
            </button>
          )}
        </div>

        <div className="grid grid-3">
          <div>
            <div className="text-xs text-muted mb-1">Type</div>
            <div style={{ textTransform: 'capitalize' }}>{transaction.type}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Amount</div>
            <div className="mono">{formatCurrency(transaction.amount, transaction.currency)}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Date</div>
            <div>{formatDateTime(transaction.createdAt)}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Sender</div>
            <div>{transaction.sender.name}</div>
            <div className="mono text-xs text-muted">{transaction.sender.accountNumber}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Recipient</div>
            <div>{transaction.recipient.name}</div>
            <div className="mono text-xs text-muted">{transaction.recipient.accountNumber}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Narration</div>
            <div>{transaction.narration || '—'}</div>
          </div>
        </div>

        {transaction.reversalReason && (
          <div className="alert alert-warning mt-4">
            <strong>Reversal reason:</strong> {transaction.reversalReason}
          </div>
        )}

        {transaction.originalTransaction && (
          <div className="alert alert-info mt-4">
            This is a reversal of{' '}
            <Link to={`/admin/transactions/${transaction.originalTransaction._id}`}>
              {transaction.originalTransaction.reference}
            </Link>
          </div>
        )}

        {transaction.reversalTransaction && (
          <div className="alert alert-info mt-4">
            This transaction was reversed by{' '}
            <Link to={`/admin/transactions/${transaction.reversalTransaction._id}`}>
              {transaction.reversalTransaction.reference}
            </Link>
          </div>
        )}
      </div>

      {/* --- State history / audit trail --- */}
      <div className="card">
        <h3 className="mb-4">Transaction state history</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Note</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transaction.stateHistory.map((entry, idx) => (
                <tr key={idx}>
                  <td><StatusBadge status={entry.status} /></td>
                  <td className="text-sm">{entry.note}</td>
                  <td className="text-sm text-muted">{formatDateTime(entry.changedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReverseModal && (
        <ConfirmModal
          title="Reverse this transaction?"
          confirmLabel="Reverse transaction"
          confirmVariant="danger"
          onConfirm={handleReverse}
          onCancel={() => { setShowReverseModal(false); setReason(''); }}
          loading={actionLoading}
        >
          <p className="text-sm">
            This will credit the original sender, debit the original
            recipient, create a linked reversal transaction, and notify both
            parties by email. This action cannot be undone.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="reverse-reason">Reason for reversal *</label>
            <textarea
              id="reverse-reason"
              className="form-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </ConfirmModal>
      )}
    </div>
  );
};

export default AdminTransactionDetailPage;
