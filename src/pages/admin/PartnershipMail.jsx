import { useState } from 'react';
import { FiArrowUpRight, FiCalendar, FiMail, FiSend } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../context/useToast';
import * as adminApi from '../../services/adminApi';
import styles from './PartnershipMail.module.css';

const INITIAL_FORM = {
  recipientEmail: '',
  recipientName: '',
  amount: '',
  currency: 'USD',
  purpose: '',
  depositDate: '',
  paymentMethod: 'Direct transfer',
};

function displayAmount(amount, currency) {
  if (!amount) return `${currency} 0.00`;
  const number = Number(amount);
  return Number.isFinite(number)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(number)
    : `${currency} ${amount}`;
}

function displayDate(date) {
  if (!date) return 'the agreed date';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${date}T00:00:00`));
}

export default function PartnershipMail() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      await adminApi.sendPartnershipMail(form);
      showToast('Partnership email sent successfully.', 'success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err?.response?.data?.message || 'The email could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const firstName = form.recipientName.trim() || 'there';

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Relationship studio</p>
          <h1>Partnership mail</h1>
          <p className={styles.subtitle}>Compose a thoughtful note and see the finished message before it leaves your desk.</p>
        </div>
        <div className={styles.introMark}><FiMail /><span>BU</span></div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.composer} aria-labelledby="composer-title">
          <div className={styles.sectionHeading}>
            <div className={styles.sectionIcon}><FiSend /></div>
            <div><h2 id="composer-title">Message details</h2><p>Fill in the essentials for this partnership note.</p></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <Input label="Recipient email" name="recipientEmail" type="email" value={form.recipientEmail} onChange={updateField} placeholder="name@company.com" required />
              <Input label="Recipient name" name="recipientName" value={form.recipientName} onChange={updateField} placeholder="Jordan Lee" required />
              <Input label="Amount" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={updateField} placeholder="0.00" required />
              <div className={styles.field}>
                <label htmlFor="currency">Currency</label>
                <select id="currency" name="currency" value={form.currency} onChange={updateField}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option>
                </select>
              </div>
              <Input label="Purpose" name="purpose" value={form.purpose} onChange={updateField} placeholder="Creative partnership" required />
              <div className={styles.field}>
                <label htmlFor="depositDate">Deposit date</label>
                <div className={styles.dateWrap}><FiCalendar /><input id="depositDate" name="depositDate" type="date" value={form.depositDate} onChange={updateField} required /></div>
              </div>
              <div className={`${styles.field} ${styles.fullField}`}>
                <label htmlFor="paymentMethod">Payment method</label>
                <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={updateField}>
                  <option>Direct transfer</option><option>Wire transfer</option><option>ACH</option><option>Check</option><option>Other</option>
                </select>
              </div>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <Button type="submit" loading={sending} fullWidth><FiSend /> Send partnership email <FiArrowUpRight /></Button>
          </form>
        </section>

        <section className={styles.preview} aria-labelledby="preview-title">
          <div className={styles.previewBar}><span><span className={styles.liveDot} /> Live preview</span><span className={styles.previewMeta}>Bucked Up Management</span></div>
          <article className={styles.email}>
            <div className={styles.emailHeader}><div className={styles.logo}>BU<span>•</span></div><span className={styles.emailTag}>PARTNERSHIP NOTE</span></div>
            <div className={styles.emailBody}>
              <p className={styles.emailKicker}>A note from Bucked Up Management</p>
              <h2 id="preview-title">Good things are<br /><em>worth sharing.</em></h2>
              <p className={styles.greeting}>Hi {firstName},</p>
              <p>We are pleased to confirm the details of our partnership. The following contribution is scheduled for you:</p>
              <div className={styles.amountBlock}><span>{form.currency}</span><strong>{displayAmount(form.amount, form.currency).replace(`${form.currency}`, '').trim() || '0.00'}</strong></div>
              <dl className={styles.details}><div><dt>Purpose</dt><dd>{form.purpose || 'Partnership contribution'}</dd></div><div><dt>Scheduled for</dt><dd>{displayDate(form.depositDate)}</dd></div><div><dt>Payment method</dt><dd>{form.paymentMethod}</dd></div></dl>
              <p>Thank you for bringing your energy and expertise to this partnership. We are looking forward to what we create together.</p>
              <p className={styles.signature}>Warmly,<br /><strong>Bucked Up Management</strong></p>
            </div>
            <div className={styles.emailFooter}>BUCKED UP MANAGEMENT <span>•</span> PARTNERSHIPS</div>
          </article>
        </section>
      </div>
    </div>
  );
}