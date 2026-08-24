import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ label = 'Loading', full = false }) {
  return (
    <div className={full ? styles.fullWrap : styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
