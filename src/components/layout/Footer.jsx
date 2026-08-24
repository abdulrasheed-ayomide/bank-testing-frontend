import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.brand}>
            <span className={styles.mark}>SFB</span>
            <span>Spring Financial Bank</span>
          </div>
          <p className={styles.disclaimer}>
            Spring Financial Bank is committed to secure, transparent digital banking — built
            for individuals and businesses who expect more from their bank.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h5>Product</h5>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/security">Security</Link>
          </div>
          <div className={styles.col}>
            <h5>Account</h5>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Spring Financial Bank</span>
      </div>
    </footer>
  );
}
