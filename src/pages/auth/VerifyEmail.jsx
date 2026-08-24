import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import styles from './Auth.module.css';

export default function VerifyEmail() {
  const { verifyOtp, resendOtp, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    setError('');
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) {
      setError('Enter the full 6-digit code.');
      return;
    }
    try {
      await verifyOtp(email, otp);
      showToast('Email verified. Welcome to SFB.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'That code is incorrect or has expired.');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(email, 'EMAIL_VERIFICATION');
      showToast('A new code has been sent to your email.', 'info');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not resend code. Try again shortly.', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Verify your email</h1>
        <p>We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.otpBoxes}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={styles.otpBox}
              aria-label={`Code digit ${i + 1}`}
            />
          ))}
        </div>
        {error && <div className={styles.formError} role="alert">{error}</div>}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Verify Email
        </Button>
      </form>

      <p className={styles.resendRow}>
        Didn't get a code?{' '}
        <button type="button" className={styles.linkBtn} onClick={handleResend} disabled={resending}>
          {resending ? 'Sending…' : 'Resend code'}
        </button>
      </p>
    </div>
  );
}
