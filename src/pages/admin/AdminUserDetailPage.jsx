import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime, formatDate, getInitials } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import PageLoader from '../../components/common/PageLoader';
import ConfirmModal from '../../components/common/ConfirmModal';

const STATUS_OPTIONS = ['active', 'suspended', 'frozen'];
const KYC_OPTIONS = ['not_started', 'pending', 'verified', 'rejected'];

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingKyc, setPendingKyc] = useState(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getUserDetails(id);
      setUser(data.data.user);
      setTransactions(data.data.recentTransactions);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load customer details.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async () => {
    setActionLoading(true);
    try {
      await adminService.updateUserStatus(id, { status: pendingStatus, reason });
      toast.success(`Account status updated to "${pendingStatus}".`);
      setPendingStatus(null);
      setReason('');
      fetchDetails();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update account status.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleKycChange = async () => {
    setActionLoading(true);
    try {
      await adminService.updateKycStatus(id, { kycStatus: pendingKyc, reason });
      toast.success(`KYC status updated to "${pendingKyc.replace('_', ' ')}".`);
      setPendingKyc(null);
      setReason('');
      fetchDetails();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update KYC status.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);

      await adminService.deleteUser(user._id);

      toast.success('User deleted successfully');

      navigate('/admin/users', { replace: true });
      window.location.reload();
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Could not delete user.')
      );
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <PageLoader label="Loading customer..." />;
  if (!user) return null;

  return (
    <div className="flex-col gap-6">
      <Link to="/admin/users" className="text-sm">&larr; Back to customers</Link>

      <div className="card">
        <div className="mb-4">
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)} > Delete User</button>

        </div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="avatar" style={{ width: '56px', height: '56px', fontSize: 'var(--fs-lg)' }}>
            {user.profilePhoto ? <img src={user.profilePhoto} alt="" /> : getInitials(user.fullName)}
          </span>
          <div>
            <h3 className="mb-0">{user.fullName}</h3>
            <p className="text-sm text-muted mb-0">{user.email} · @{user.username} · {user.phoneNumber}</p>
          </div>
        </div>

        <div className="grid grid-4">
          <div>
            <div className="text-xs text-muted mb-1">Account number</div>
            <div className="mono">{user.account?.accountNumber || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Customer ID</div>
            <div className="mono">{user.account?.customerId || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Balance</div>
            <div className="mono">{user.account ? formatCurrency(user.account.balance) : '—'}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Joined</div>
            <div>{formatDate(user.createdAt)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* --- Account status management --- */}
        <div className="card">
          <h3 className="mb-2">Account status</h3>
          <p className="text-sm">
            Current status: <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{user.accountStatus.replace('_', ' ')}</span>
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${status === user.accountStatus ? 'btn-secondary' : 'btn-primary'}`}
                disabled={status === user.accountStatus}
                onClick={() => setPendingStatus(status)}
                style={{ textTransform: 'capitalize' }}
              >
                Set {status}
              </button>
            ))}
          </div>
        </div>

        {/* --- KYC status management --- */}
        <div className="card">
          <h3 className="mb-2">KYC status</h3>
          <p className="text-sm">
            Current status: <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{user.kycStatus.replace('_', ' ')}</span>
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            {KYC_OPTIONS.map((kyc) => (
              <button
                key={kyc}
                className={`btn btn-sm ${kyc === user.kycStatus ? 'btn-secondary' : 'btn-primary'}`}
                disabled={kyc === user.kycStatus}
                onClick={() => setPendingKyc(kyc)}
                style={{ textTransform: 'capitalize' }}
              >
                Set {kyc.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Recent transactions --- */}
      <div className="card">
        <h3 className="mb-4">Recent transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-muted">No transactions on this account yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
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
                    <td className="mono">{formatCurrency(tx.amount, tx.currency)}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td className="text-sm text-muted">{formatDateTime(tx.createdAt)}</td>
                    <td><Link to={`/admin/transactions/${tx._id}`} className="btn btn-sm btn-secondary">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Confirm status change modal --- */}
      {pendingStatus && (
        <ConfirmModal
          title={`Set account status to "${pendingStatus}"?`}
          confirmLabel="Confirm"
          confirmVariant={pendingStatus === 'active' ? 'primary' : 'danger'}
          onConfirm={handleStatusChange}
          onCancel={() => { setPendingStatus(null); setReason(''); }}
          loading={actionLoading}
        >
          <p className="text-sm">
            This will {pendingStatus === 'active' ? 'reactivate' : pendingStatus} the customer's account
            and send them a security alert email.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="reason">Reason (optional)</label>
            <textarea id="reason" className="form-textarea" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
        </ConfirmModal>
      )}

      {/* --- Confirm KYC change modal --- */}
      {pendingKyc && (
        <ConfirmModal
          title={`Set KYC status to "${pendingKyc.replace('_', ' ')}"?`}
          onConfirm={handleKycChange}
          onCancel={() => { setPendingKyc(null); setReason(''); }}
          loading={actionLoading}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="kyc-reason">Reason (optional)</label>
            <textarea id="kyc-reason" className="form-textarea" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
        </ConfirmModal>
      )}
      {/* --- Confirm delete modal --- */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Customer?"
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDeleteUser}
          onCancel={() => setShowDeleteModal(false)}
          loading={actionLoading}
        >
          <p>
            This action cannot be undone.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
};

export default AdminUserDetailPage;
