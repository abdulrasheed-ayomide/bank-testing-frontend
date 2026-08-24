import { useState } from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CopyableField from '../../components/common/CopyableField';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { isValidPhone } from '../../utils/validators';
import { formatAccountNumber } from '../../utils/formatCurrency';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, account, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Required.';
    if (!form.lastName.trim()) next.lastName = 'Required.';
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await updateProfile(form);
      showToast('Profile updated.', 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h3 className={styles.sectionTitle}>Personal information</h3>
        <form className={styles.form} onSubmit={handleSave} noValidate>
          <div className={styles.row2}>
            <Input label="First name" name="firstName" icon={<FiUser size={16} />} value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <Input label="Last name" name="lastName" icon={<FiUser size={16} />} value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </div>
          <Input label="Email address" value={user?.email || ''} icon={<FiMail size={16} />} disabled hint="Email cannot be changed here." />
          <Input label="Phone number" name="phone" icon={<FiPhone size={16} />} value={form.phone} onChange={handleChange} error={errors.phone} />
          <Button type="submit" variant="primary" loading={saving} style={{ alignSelf: 'flex-start' }}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card className={styles.card}>
        <h3 className={styles.sectionTitle}>Account details</h3>
        <div className={styles.infoRow}>
          <span>Account number</span>
          <CopyableField value={account?.accountNumber} display={formatAccountNumber(account?.accountNumber)} />
        </div>
        <div className={styles.infoRow}>
          <span>Account status</span>
          <Badge tone="success">{account?.status || 'ACTIVE'}</Badge>
        </div>
        <div className={styles.infoRow}>
          <span>Base currency</span>
          <span className="mono">{account?.baseCurrency || 'USD'}</span>
        </div>
        <p className={styles.footnote}>
          Account number, balance, and account status cannot be changed by users.
        </p>
      </Card>
    </div>
  );
}
