import { Link, Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.wrap}>
      <Link to="/" className={styles.brand}>
        <span className={styles.mark}>SFB</span>
        <span>Spring Financial Bank</span>
      </Link>
      <div className={styles.panel}>
        <Outlet />
      </div>
    </div>
  );
}
