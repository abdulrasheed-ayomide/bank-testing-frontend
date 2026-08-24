import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiPlusCircle, FiArrowUpRight, FiArrowDownLeft, FiRepeat } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import CopyableField from '../../components/common/CopyableField';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/useAuth';
import * as transactionApi from '../../services/transactionApi';
import { formatCurrency, formatAccountNumber, formatDate } from '../../utils/formatCurrency';
import styles from './Dashboard.module.css';

const DISPLAY_CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD'];

// Placeholder display-only rates. Real conversion happens on the backend
// once an exchange-rate provider is integrated (see project spec, section 14).
const MOCK_RATES = { USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1530, CAD: 1.36, AUD: 1.51 };

function TxIcon({ type, direction }) {
  if (type === 'CREDIT' || direction === 'CREDIT') return <FiArrowDownLeft />;
  if (type === 'DEBIT' || direction === 'DEBIT') return <FiArrowUpRight />;
  return <FiRepeat />;
}

export default function Dashboard() {
  const { user, account } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const all = await transactionApi.listTransactions();
        if (!cancelled) setRecent(all.slice(0, 4));
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load recent activity.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayBalance = account ? account.balance * (MOCK_RATES[currency] / MOCK_RATES[account.baseCurrency]) : 0;

  return (
    <div className={styles.wrap}>
      <p className={styles.welcome}>Welcome back, {user?.firstName || 'there'}</p>

      <div className={styles.topGrid}>
        <Card className={styles.balanceCard}>
          <div className={styles.balanceHead}>
            <span>Available balance</span>
            <select
              className={styles.currencySelect}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Display currency"
            >
              {DISPLAY_CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.balanceAmount} mono`}>{formatCurrency(displayBalance, currency)}</div>
          {currency !== account?.baseCurrency && (
            <p className={styles.equivNote}>
              ≈ {formatCurrency(account?.balance, account?.baseCurrency)} {account?.baseCurrency} actual balance
            </p>
          )}
          <div className={styles.quickActions}>
            <Link to="/dashboard/send-money" className={styles.actionBtn}>
              <FiSend /> Send Money
            </Link>
            <Link to="/dashboard/add-money" className={styles.actionBtnGhost}>
              <FiPlusCircle /> Add Money
            </Link>
          </div>
        </Card>

        <Card className={styles.accountCard}>
          <div className={styles.accountHead}>
            <span>Primary Account</span>
            <Badge tone="success">{account?.status || 'ACTIVE'}</Badge>
          </div>
          <div className={styles.accountNumberBlock}>
            <span className={styles.accountLabel}>Account number</span>
            <CopyableField value={account?.accountNumber} display={formatAccountNumber(account?.accountNumber)} />
          </div>
          <div className={styles.accountFooter}>
            <span>{user?.firstName} {user?.lastName}</span>
            <span>Spring Financial Bank</span>
          </div>
        </Card>
      </div>

      <div className={styles.recentHead}>
        <h3>Recent transactions</h3>
        <Link to="/dashboard/transactions" className={styles.viewAll}>View all</Link>
      </div>

      <Card padded={false}>
        {loading ? (
          <LoadingSpinner label="Loading recent activity" />
        ) : error ? (
          <EmptyState title="Couldn't load transactions" description={error} />
        ) : recent.length === 0 ? (
          <EmptyState title="No transactions yet" description="Your activity will show up here once you send or receive funds." />
        ) : (
          <ul className={styles.txList}>
            {recent.map((tx) => (
              <li key={tx.id} className={styles.txRow}>
                <span className={`${styles.txIcon} ${styles[tx.direction === 'DEBIT' || tx.type === 'DEBIT' ? 'txIconDebit' : 'txIconCredit']}`}>
                  <TxIcon type={tx.type} direction={tx.direction} />
                </span>
                <div className={styles.txInfo}>
                  <span className={styles.txDesc}>{tx.description || tx.type}</span>
                  <span className={styles.txMeta}>{tx.counterparty} · {formatDate(tx.date)}</span>
                </div>
                <div className={styles.txRight}>
                  <span className={`${styles.txAmount} mono ${tx.direction === 'DEBIT' || tx.type === 'DEBIT' ? styles.negative : styles.positive}`}>
                    {tx.direction === 'DEBIT' || tx.type === 'DEBIT' ? '−' : '+'}{formatCurrency(tx.amount, tx.currency)}
                  </span>
                  <Badge>{tx.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
