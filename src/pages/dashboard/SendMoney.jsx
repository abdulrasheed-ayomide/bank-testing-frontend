import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiUser } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import PinInput from '../../components/common/PinInput';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import * as accountApi from '../../services/accountApi';
import * as transactionApi from '../../services/transactionApi';
import { formatCurrency, formatAccountNumber } from '../../utils/formatCurrency';
import { isValidAccountNumber, isValidPin } from '../../utils/validators';
import styles from './SendMoney.module.css';

const CURRENCIES = ['USD']; // Real fund movement is USD-only in V1 — see backend README.

const STEPS = { FORM: 'form', PREVIEW: 'preview', SUCCESS: 'success' };

export default function SendMoney() {
  const { user, account, refreshAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState({ accountNumber: '', amount: '', currency: 'USD', description: '' });
  const [errors, setErrors] = useState({});
  const [recipient, setRecipient] = useState(null);
  const [checkingRecipient, setCheckingRecipient] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
    if (e.target.name === 'accountNumber') setRecipient(null);
  };

  const lookupRecipient = async () => {
    if (!isValidAccountNumber(form.accountNumber)) {
      setErrors((er) => ({ ...er, accountNumber: 'Enter a valid 9-digit account number.' }));
      return;
    }
    if (form.accountNumber === account?.accountNumber) {
      setErrors((er) => ({ ...er, accountNumber: 'You cannot transfer to your own account.' }));
      return;
    }
    setCheckingRecipient(true);
    try {
      const match = await accountApi.lookupAccount(form.accountNumber);
      setRecipient(match);
    } catch (err) {
      setErrors((er) => ({
        ...er,
        accountNumber: err?.response?.data?.message || 'No active account found with this number.',
      }));
    } finally {
      setCheckingRecipient(false);
    }
  };

  const validateForm = () => {
    const next = {};
    if (!recipient) next.accountNumber = 'Look up and confirm a recipient first.';
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) next.amount = 'Enter an amount greater than zero.';
    else if (account && amt > account.balance) next.amount = 'Amount exceeds your available balance.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep(STEPS.PREVIEW);
  };

  const handleConfirmTransfer = () => {
    setPin('');
    setPinError('');
    setPinModalOpen(true);
  };

  const handlePinSubmit = async () => {
    if (!isValidPin(pin)) {
      setPinError('Enter your 4-digit PIN.');
      return;
    }
    setProcessing(true);
    try {
      await transactionApi.transfer({
        recipientAccountNumber: form.accountNumber,
        amount: amountNumber,
        currency: form.currency,
        description: form.description,
        transactionPin: pin,
      });
      await refreshAccount();
      setPinModalOpen(false);
      setStep(STEPS.SUCCESS);
      showToast('Transfer completed successfully.', 'success');
    } catch (err) {
      setPinError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const amountNumber = parseFloat(form.amount) || 0;

  if (step === STEPS.SUCCESS) {
    return (
      <Card className={styles.successCard}>
        <div className={styles.successIcon}><FiCheckCircle size={30} /></div>
        <h2>Transfer successful</h2>
        <p>
          You sent {formatCurrency(amountNumber, form.currency)} to {recipient?.firstName} {recipient?.lastName}.
        </p>
        <div className={styles.successActions}>
          <Button variant="secondary" onClick={() => navigate('/dashboard/transactions')}>View Transactions</Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Card>
    );
  }

  if (step === STEPS.PREVIEW) {
    return (
      <Card className={styles.previewCard}>
        <h2 className={styles.previewTitle}>Transfer Review</h2>

        <div className={styles.previewGrid}>
          <div className={styles.previewCol}>
            <span className={styles.previewLabel}>From</span>
            <span className={styles.previewName}>{user?.firstName} {user?.lastName}</span>
            <span className="mono">{formatAccountNumber(account?.accountNumber)}</span>
          </div>
          <FiArrowRight className={styles.previewArrow} />
          <div className={styles.previewCol}>
            <span className={styles.previewLabel}>To</span>
            <span className={styles.previewName}>{recipient?.firstName} {recipient?.lastName}</span>
            <span className="mono">{formatAccountNumber(form.accountNumber)}</span>
          </div>
        </div>

        <div className={styles.previewRows}>
          <div className={styles.previewRow}>
            <span>Amount</span>
            <span className="mono">{formatCurrency(amountNumber, form.currency)}</span>
          </div>
          <div className={styles.previewRow}>
            <span>Fee</span>
            <span className="mono">{formatCurrency(0, form.currency)}</span>
          </div>
          {form.description && (
            <div className={styles.previewRow}>
              <span>Description</span>
              <span>{form.description}</span>
            </div>
          )}
          <div className={`${styles.previewRow} ${styles.previewTotal}`}>
            <span>Total</span>
            <span className="mono">{formatCurrency(amountNumber, form.currency)}</span>
          </div>
        </div>

        <div className={styles.previewActions}>
          <Button variant="secondary" fullWidth onClick={() => setStep(STEPS.FORM)}>Cancel</Button>
          <Button variant="primary" fullWidth onClick={handleConfirmTransfer}>Confirm Transfer</Button>
        </div>

        <Modal open={pinModalOpen} onClose={() => !processing && setPinModalOpen(false)} title="Enter transaction PIN" width={380}>
          <p className={styles.pinPrompt}>Confirm this transfer with your 4-digit transaction PIN.</p>
          <PinInput length={4} value={pin} onChange={setPin} error={pinError} />
          <Button
            variant="primary"
            fullWidth
            style={{ marginTop: 20 }}
            loading={processing}
            onClick={handlePinSubmit}
          >
            Confirm & Send
          </Button>
        </Modal>
      </Card>
    );
  }

  return (
    <div className={styles.wrap}>
      <Card>
        <form className={styles.form} onSubmit={handleContinue} noValidate>
          <div className={styles.lookupRow}>
            <Input
              label="Recipient account number"
              name="accountNumber"
              placeholder="1XXXXXXXX"
              icon={<FiUser size={16} />}
              value={form.accountNumber}
              onChange={handleChange}
              error={errors.accountNumber}
            />
            <Button type="button" variant="secondary" onClick={lookupRecipient} loading={checkingRecipient}>
              Look up
            </Button>
          </div>

          {recipient && (
            <div className={styles.recipientBanner}>
              <FiCheckCircle /> {recipient.firstName} {recipient.lastName} — account verified
            </div>
          )}

          <div className={styles.row2}>
            <Input
              label="Amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              error={errors.amount}
            />
            <div>
              <label className={styles.selectLabel}>Currency</label>
              <select className={styles.select} name="currency" value={form.currency} onChange={handleChange}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Input
            label="Description (optional)"
            name="description"
            placeholder="What's this for?"
            value={form.description}
            onChange={handleChange}
          />

          {account && (
            <p className={styles.balanceNote}>
              Available balance: <span className="mono">{formatCurrency(account.balance, account.baseCurrency)}</span>
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth>Continue</Button>
        </form>
      </Card>
    </div>
  );
}
