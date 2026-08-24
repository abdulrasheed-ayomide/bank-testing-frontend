import { Link } from 'react-router-dom';
import { FiShield, FiSend, FiGlobe, FiClock, FiMail, FiArrowRight, FiLock } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import styles from './Landing.module.css';

const FEATURES = [
  { icon: <FiShield />, title: 'Secure by design', body: 'Every account is protected with hashed credentials, verified email, and a dedicated transaction PIN.' },
  { icon: <FiSend />, title: 'Instant transfers', body: 'Send funds to any SFB account number in seconds, with a clear preview before anything moves.' },
  { icon: <FiGlobe />, title: 'Multi-currency display', body: 'View your USD balance alongside EUR, GBP, NGN, CAD, and AUD equivalents at a glance.' },
  { icon: <FiClock />, title: 'Full transaction history', body: 'Every credit, debit, and transfer is logged with a reference, status, and timestamp.' },
  { icon: <FiMail />, title: 'Email notifications', body: 'Get notified the moment your account is credited, debited, or verified.' },
];

const STEPS = [
  { n: '01', title: 'Open an account', body: 'Register with your details and set a transaction PIN.' },
  { n: '02', title: 'Verify your email', body: 'Confirm your identity with a one-time code sent to your inbox.' },
  { n: '03', title: 'Bank with SFB', body: 'View your balance, send transfers, and track every transaction.' },
];

export default function Landing() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Spring Financial Bank</span>
            <h1 className={styles.headline}>Banking made simple.</h1>
            <p className={styles.sub}>
              Manage your digital account, send money securely, and keep track of every transaction —
              all in one clean, professional dashboard.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/signup"><Button variant="accent" size="lg">Open an Account</Button></Link>
              <Link to="/login"><Button variant="secondary" size="lg">Login</Button></Link>
            </div>
          </div>

          <Card className={styles.ledgerCard} padded={false}>
            <div className={styles.ledgerHead}>
              <span>Primary Account</span>
              <span className={styles.dot} />
            </div>
            <div className={styles.ledgerBalance}>
              <span className={styles.ledgerLabel}>Available balance</span>
              <span className={`${styles.ledgerAmount} mono`}>$1,280.50</span>
            </div>
            <div className={styles.ledgerRow}>
              <span>Account number</span>
              <span className="mono">104 582 937</span>
            </div>
            <div className={styles.ledgerRow}>
              <span>Status</span>
              <span className={styles.statusPill}>Active</span>
            </div>
            <div className={styles.ledgerFooter}>
              <FiArrowRight />
              <span>Jane Smith · 112 345 678</span>
              <span className="mono">− $150.00</span>
            </div>
          </Card>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <h2>Everything a digital account needs</h2>
          <p>Built to feel like a real bank — without the complexity of one.</p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <Card key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <h2>Get started in three steps</h2>
        </div>
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={`${styles.stepNum} mono`}>{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <Card className={styles.securityBanner}>
          <div className={styles.securityIcon}><FiLock size={22} /></div>
          <div>
            <h3>Security is not an afterthought</h3>
            <p>
              Passwords and PINs are hashed, sessions expire, and every transfer requires PIN
              confirmation before funds move. <Link to="/security" className={styles.inlineLink}>See how it works →</Link>
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
