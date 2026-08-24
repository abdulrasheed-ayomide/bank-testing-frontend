import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { isValidEmail } from '../../utils/validators';
import styles from './Auth.module.css';

export default function Login() {
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    try {
      const user = await login(form);
      if (user?.emailVerified === false || user?.isEmailVerified === false) {
        navigate('/verify-email', { replace: true, state: { email: form.email } });
        return;
      }
      showToast('Welcome back.', 'success');
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const responseData = err?.response?.data;
      const verificationRequired =
        responseData?.code === 'EMAIL_NOT_VERIFIED' ||
        /email.*not verified|verify.*email/i.test(responseData?.message || '');

      if (verificationRequired) {
        navigate('/verify-email', { replace: true, state: { email: form.email } });
        return;
      }
      setFormError(err?.response?.data?.message || 'Unable to log in. Please try again.');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Log in to SFB</h1>
        <p>Enter your account details to access your dashboard.</p>
      </div>

      {formError && <div className={styles.formError} role="alert">{formError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail size={16} />}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<FiLock size={16} />}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          rightSlot={
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility" style={{ background: 'none', border: 'none', display: 'flex' }}>
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          }
        />

        <div className={styles.between}>
          <span />
          <Link to="/forgot-password" className={styles.linkBtn}>Forgot password?</Link>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Log In
        </Button>
      </form>

      <p className={styles.footerLink}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
