import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import Input from '../../components/common/Input';
import PinInput from '../../components/common/PinInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { isValidEmail, isValidPhone, isStrongPassword, isValidPin } from '../../utils/validators';
import styles from './Auth.module.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  pin: '',
  confirmPin: '',
  acceptTerms: false,
};

export default function Signup() {
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Required.';
    if (!form.lastName.trim()) next.lastName = 'Required.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.';
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number.';
    if (!isStrongPassword(form.password)) next.password = 'At least 8 characters, with a letter and a number.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    if (!isValidPin(form.pin)) next.pin = 'PIN must be exactly 4 digits.';
    if (form.confirmPin !== form.pin) next.confirmPin = 'PINs do not match.';
    if (!form.acceptTerms) next.acceptTerms = 'You must accept the terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    try {
      const result = await register(form);
      showToast('Account created. Check your email for a verification code.', 'success');
      navigate('/verify-email', { state: { email: result.email } });
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Unable to create your account. Please try again.');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Open your SFB account</h1>
        <p>It only takes a minute to get started.</p>
      </div>

      {formError && <div className={styles.formError} role="alert">{formError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row2}>
          <Input label="First name" name="firstName" icon={<FiUser size={16} />} value={form.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
          <Input label="Last name" name="lastName" icon={<FiUser size={16} />} value={form.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" />
        </div>

        <Input label="Email address" name="email" type="email" placeholder="you@example.com" icon={<FiMail size={16} />} value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <Input label="Phone number" name="phone" type="tel" placeholder="+1 555 019 2288" icon={<FiPhone size={16} />} value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" />

        <div className={styles.row2}>
          <Input label="Password" name="password" type="password" icon={<FiLock size={16} />} value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" name="confirmPassword" type="password" icon={<FiLock size={16} />} value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sfb-ink-soft)', display: 'block', marginBottom: 6 }}>
            Transaction PIN (4 digits)
          </label>
          <PinInput length={4} value={form.pin} onChange={(v) => setForm((f) => ({ ...f, pin: v }))} error={errors.pin} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sfb-ink-soft)', display: 'block', marginBottom: 6 }}>
            Confirm transaction PIN
          </label>
          <PinInput length={4} value={form.confirmPin} onChange={(v) => setForm((f) => ({ ...f, confirmPin: v }))} error={errors.confirmPin} />
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} />
          <span>
            I agree to the Terms of Use and Privacy Policy.
          </span>
        </label>
        {errors.acceptTerms && <p style={{ color: 'var(--sfb-red)', fontSize: 12.5 }}>{errors.acceptTerms}</p>}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>

      <p className={styles.footerLink}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
