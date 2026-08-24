import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, gap: 12 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--sfb-green-deep)', background: 'var(--sfb-green-tint)', padding: '5px 12px', borderRadius: 999 }}>404</span>
      <h1 style={{ fontSize: 26 }}>Page not found</h1>
      <p style={{ color: 'var(--sfb-ink-faint)', fontSize: 14, maxWidth: 340 }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}
