import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToast } from '../../context/useToast';
import { isStrongPassword } from '../../utils/validators';
import * as authApi from '../../services/authApi';
import styles from './Auth.module.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const email = location.state?.email || '';

  const [form, setForm] = useState({ code: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!/^\d{6}$/.test(form.code)) next.code = 'Enter the 6-digit reset code.';
    if (!isStrongPassword(form.password)) next.password = 'At least 8 characters, with a letter and a number.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    if (!email) {
      setFormError('Missing email — please restart the password reset process.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp: form.code, newPassword: form.password });
      showToast('Password updated. You can now log in.', 'success');
      navigate('/login');
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Reset your password</h1>
        <p>{email ? <>Enter the code sent to <strong>{email}</strong> and choose a new password.</> : 'Enter your reset code and choose a new password.'}</p>
      </div>

      {formError && <div className={styles.formError} role="alert">{formError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input label="Reset code" name="code" placeholder="123456" value={form.code} onChange={handleChange} error={errors.code} />
        <Input label="New password" name="password" type="password" icon={<FiLock size={16} />} value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <Input label="Confirm new password" name="confirmPassword" type="password" icon={<FiLock size={16} />} value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
