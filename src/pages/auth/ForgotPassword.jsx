import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isValidEmail } from '../../utils/validators';
import * as authApi from '../../services/authApi';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Backend always returns success here regardless of whether the email
      // exists, so this can't be used to enumerate registered accounts.
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <div className={styles.header}>
          <h1>Check your inbox</h1>
          <p>
            If an account exists for <strong>{email}</strong>, we've sent a code to reset your
            password.
          </p>
        </div>
        <Button variant="secondary" fullWidth onClick={() => navigate('/reset-password', { state: { email } })}>
          I have my reset code
        </Button>
        <p className={styles.footerLink}>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Forgot your password?</h1>
        <p>Enter the email on your account and we'll send you a reset code.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail size={16} />}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          error={error}
        />
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Send Reset Code
        </Button>
      </form>

      <p className={styles.footerLink}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}
