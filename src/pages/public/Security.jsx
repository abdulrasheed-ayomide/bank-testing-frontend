import { FiLock, FiMail, FiShield, FiKey, FiServer } from 'react-icons/fi';
import Card from '../../components/common/Card';
import styles from './StaticPage.module.css';

const POINTS = [
  { icon: <FiLock />, title: 'Hashed passwords', body: 'Every password is hashed with bcrypt before storage. SFB never stores or transmits plain-text passwords.' },
  { icon: <FiMail />, title: 'Email verification', body: 'New accounts must confirm a one-time code sent to their email before the dashboard becomes accessible.' },
  { icon: <FiKey />, title: 'Transaction PIN', body: 'Transfers require a separate, hashed PIN verified on the backend — never on the frontend.' },
  { icon: <FiShield />, title: 'Authenticated sessions', body: 'Access is controlled with expiring tokens, and every sensitive request is re-checked by the backend.' },
  { icon: <FiServer />, title: 'Secure API architecture', body: 'Validation, rate limiting, and authorization checks happen server-side before any financial action is taken.' },
];

export default function Security() {
  return (
    <div className={`container ${styles.wrap}`}>
      <span className={styles.eyebrow}>Security</span>
      <h1>How Spring Financial Bank protects your account.</h1>
      <p className={styles.lead}>
        Spring Financial Bank follows industry-standard, bank-grade security practices to
        protect your account, data, and transactions.
      </p>

      <div className={styles.pointGrid}>
        {POINTS.map((p) => (
          <Card key={p.title} className={styles.pointCard}>
            <div className={styles.pointIcon}>{p.icon}</div>
            <h4>{p.title}</h4>
            <p>{p.body}</p>
          </Card>
        ))}
      </div>

      <p className={styles.footnote}>
        Spring Financial Bank employs validation, monitoring, and access controls aligned
        with industry best practices.
      </p>
    </div>
  );
}
