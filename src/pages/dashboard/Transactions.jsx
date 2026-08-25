import { useState, useEffect } from 'react';
import { FiInbox, FiArrowUpRight, FiArrowDownLeft, FiRepeat } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as transactionApi from '../../services/transactionApi';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import styles from './Transactions.module.css';

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'CREDIT', label: 'Credits' },
  { key: 'DEBIT', label: 'Debits' },
  { key: 'TRANSFER', label: 'Transfers' },
];

function TxIcon({ type, direction }) {
  if (type === 'CREDIT' || direction === 'CREDIT') return <FiArrowDownLeft />;
  if (type === 'DEBIT' || direction === 'DEBIT') return <FiArrowUpRight />;
  return <FiRepeat />;
}

export default function Transactions() {
  const [filter, setFilter] = useState('ALL');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await transactionApi.listTransactions({ type: filter });
        if (!cancelled) setTransactions(data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load transactions.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filter]);

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card padded={false}>
        {loading ? (
          <LoadingSpinner label="Loading transactions" />
        ) : error ? (
          <EmptyState icon={<FiInbox />} title="Couldn't load transactions" description={error} />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<FiInbox />}
            title="No transactions found"
            description="There's nothing to show for this filter yet."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.descriptionColumn} />
                <col className={styles.referenceColumn} />
                <col className={styles.dateColumn} />
                <col className={styles.statusColumn} />
                <col className={styles.amountColumn} />
              </colgroup>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className={styles.right}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td data-label="Description">
                      <div className={styles.descCell}>
                        <span className={styles.txIcon}><TxIcon type={tx.type} direction={tx.direction} /></span>
                        <div>
                          <div className={styles.descTitle}>{tx.description || tx.type}</div>
                          <div className={styles.descSub}>{tx.counterparty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono" data-label="Reference">{tx.reference}</td>
                    <td data-label="Date">{formatDate(tx.date)}</td>
                    <td data-label="Status"><Badge>{tx.status}</Badge></td>
                    <td data-label="Amount" className={`${styles.right} mono ${tx.direction === 'DEBIT' || tx.type === 'DEBIT' ? styles.negative : styles.positive}`}>
                      {tx.direction === 'DEBIT' || tx.type === 'DEBIT' ? '−' : '+'}{formatCurrency(tx.amount, tx.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
