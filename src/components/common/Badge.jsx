import styles from './Badge.module.css';

const TONE_MAP = {
  ACTIVE: 'success',
  COMPLETED: 'success',
  PENDING: 'amber',
  FAILED: 'danger',
  REVERSED: 'danger',
  DISABLED: 'danger',
  CREDIT: 'success',
  DEBIT: 'neutral',
  TRANSFER: 'info',
};

export default function Badge({ children, tone }) {
  const resolvedTone = tone || TONE_MAP[String(children).toUpperCase()] || 'neutral';
  return <span className={`${styles.badge} ${styles[resolvedTone]}`}>{children}</span>;
}
