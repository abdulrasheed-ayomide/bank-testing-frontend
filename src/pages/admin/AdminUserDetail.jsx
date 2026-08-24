import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlusCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as adminApi from '../../services/adminApi';
import { useToast } from '../../context/useToast';
import { formatCurrency, formatAccountNumber, formatDate } from '../../utils/formatCurrency';
import styles from './AdminUserDetail.module.css';
import tableStyles from './AdminDashboard.module.css';

const CURRENCIES = ['USD']; // Admin credits are USD-only in V1 — see backend README.

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [detail, setDetail] = useState(null); // { user, account, transactions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [creditOpen, setCreditOpen] = useState(false);
  const [creditForm, setCreditForm] = useState({ amount: '', currency: 'USD', description: '' });
  const [creditErrors, setCreditErrors] = useState({});
  const [crediting, setCrediting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getUserDetail(id);
      setDetail(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load this user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner full label="Loading user" />;
  if (error || !detail) return <EmptyState title="Couldn't load user" description={error} />;

  const { user, account, transactions } = detail;

  const handleToggleStatus = async () => {
    const nextStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    setStatusUpdating(true);
    try {
      const updatedUser = await adminApi.setUserStatus(user._id, nextStatus);
      setDetail((d) => ({ ...d, user: updatedUser }));
      showToast(`Account ${nextStatus === 'ACTIVE' ? 'activated' : 'disabled'}.`, 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not update status.', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCreditChange = (e) => {
    setCreditForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setCreditErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    const amt = parseFloat(creditForm.amount);
    if (!amt || amt <= 0) next.amount = 'Enter an amount greater than zero.';
    setCreditErrors(next);
    if (Object.keys(next).length) return;

    setCrediting(true);
    try {
      await adminApi.creditAccount(account._id, {
        amount: amt,
        currency: creditForm.currency,
        description: creditForm.description,
      });
      setCreditOpen(false);
      setCreditForm({ amount: '', currency: 'USD', description: '' });
      showToast(`Credited ${formatCurrency(amt, creditForm.currency)} to ${user.firstName} ${user.lastName}.`, 'success');
      await load(); // refresh balance + transaction list
    } catch (err) {
      setCreditErrors({ amount: err?.response?.data?.message || 'Could not credit account.' });
    } finally {
      setCrediting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={() => navigate('/admin/users')}>
        <FiArrowLeft /> Back to users
      </button>

      <div className={styles.headerGrid}>
        <Card className={styles.profileCard}>
          <div className={styles.avatar}>{user.firstName[0]}{user.lastName[0]}</div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p className={styles.email}>{user.email}</p>
          <Badge tone={user.status === 'ACTIVE' ? 'success' : 'danger'}>{user.status}</Badge>

          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <span>Account number</span>
              <span className="mono">{account ? formatAccountNumber(account.accountNumber) : '—'}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Balance</span>
              <span className="mono">{account ? formatCurrency(account.balance, account.baseCurrency) : '—'}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" fullWidth onClick={() => setCreditOpen(true)} disabled={!account}>
              <FiPlusCircle /> Credit Account
            </Button>
            <Button
              variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}
              fullWidth
              loading={statusUpdating}
              onClick={handleToggleStatus}
            >
              {user.status === 'ACTIVE' ? 'Disable Account' : 'Activate Account'}
            </Button>
          </div>
        </Card>

        <Card className={styles.txCard} padded={false}>
          <h3 className={styles.txHead}>Recent transactions</h3>
          {transactions.length === 0 ? (
            <EmptyState title="No transactions yet" description="This user hasn't transacted yet." />
          ) : (
            <div className={tableStyles.tableWrap}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className={tableStyles.right}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="mono">{tx.reference}</td>
                      <td><Badge>{tx.type}</Badge></td>
                      <td>{formatDate(tx.createdAt)}</td>
                      <td><Badge>{tx.status}</Badge></td>
                      <td className={`${tableStyles.right} mono`}>{formatCurrency(tx.amount, tx.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal open={creditOpen} onClose={() => !crediting && setCreditOpen(false)} title={`Credit ${user.firstName}'s account`}>
        <form className={styles.creditForm} onSubmit={handleCreditSubmit} noValidate>
          <div className={styles.row2}>
            <Input
              label="Amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={creditForm.amount}
              onChange={handleCreditChange}
              error={creditErrors.amount}
            />
            <div>
              <label className={styles.selectLabel}>Currency</label>
              <select className={styles.select} name="currency" value={creditForm.currency} onChange={handleCreditChange}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Description"
            name="description"
            placeholder="e.g. Initial account credit"
            value={creditForm.description}
            onChange={handleCreditChange}
          />
          <Button type="submit" variant="primary" fullWidth loading={crediting}>
            Credit Account
          </Button>
        </form>
      </Modal>
    </div>
  );
}
