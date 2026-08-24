import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAdminAuth } from '../../context/useAdminAuth';
import { isValidEmail } from '../../utils/validators';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const { adminLogin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await adminLogin(form);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Unable to log in.');
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.icon}><FiShield size={20} /></div>
        <h1>SFB Admin</h1>
        <p className={styles.sub}>Restricted access. Administrator credentials required.</p>

        {formError && <div className={styles.formError} role="alert">{formError}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Admin email"
            name="email"
            type="email"
            icon={<FiMail size={16} />}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            icon={<FiLock size={16} />}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
