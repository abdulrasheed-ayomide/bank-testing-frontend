import Card from '../common/Card';
import styles from './StatCard.module.css';

export default function StatCard({ label, value, icon, tone = 'default' }) {
  return (
    <Card className={styles.card}>
      <div className={`${styles.icon} ${styles[tone]}`}>{icon}</div>
      <div>
        <div className={`${styles.value} mono`}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </Card>
  );
}
