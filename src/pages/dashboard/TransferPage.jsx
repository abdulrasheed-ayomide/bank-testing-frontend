import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/bankingService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, generateIdempotencyKey } from '../../utils/format';

const STEPS = {
  RECIPIENT: 'recipient',
  AMOUNT: 'amount',
  CONFIRM: 'confirm',
  SUCCESS: 'success',
};

const TransferPage = () => {
  const [step, setStep] = useState(STEPS.RECIPIENT);
  const [accountNumber, setAccountNumber] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const idempotencyKey = React.useRef(generateIdempotencyKey());

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(accountNumber)) {
      setError('Please enter a valid 10-digit account number.');
      return;
    }

    setVerifying(true);
    try {
      const { data } = await transactionService.verifyRecipient(accountNumber);
      setRecipient(data.data);
      setStep(STEPS.AMOUNT);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not verify this account number.'));
    } finally {
      setVerifying(false);
    }
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    setStep(STEPS.CONFIRM);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await transactionService.transfer({
        recipientAccountNumber: accountNumber,
        amount: Number(amount),
        narration,
        idempotencyKey: idempotencyKey.current,
      });
      setResult(data.data.transaction);
      setStep(STEPS.SUCCESS);
      toast.success('Transfer completed successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Transfer could not be completed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(STEPS.RECIPIENT);
    setAccountNumber('');
    setRecipient(null);
    setAmount('');
    setNarration('');
    setResult(null);
    setError('');
    idempotencyKey.current = generateIdempotencyKey();
  };

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '560px' }}>
      {/* --- Step indicator --- */}
      {step !== STEPS.SUCCESS && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <span style={{ fontWeight: step === STEPS.RECIPIENT ? 700 : 400, color: step === STEPS.RECIPIENT ? 'var(--sfb-navy)' : undefined }}>
            1. Recipient
          </span>
          <span>—</span>
          <span style={{ fontWeight: step === STEPS.AMOUNT ? 700 : 400, color: step === STEPS.AMOUNT ? 'var(--sfb-navy)' : undefined }}>
            2. Amount
          </span>
          <span>—</span>
          <span style={{ fontWeight: step === STEPS.CONFIRM ? 700 : 400, color: step === STEPS.CONFIRM ? 'var(--sfb-navy)' : undefined }}>
            3. Confirm
          </span>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* --- Step 1: Recipient --- */}
      {step === STEPS.RECIPIENT && (
        <div className="card">
          <h3 className="mb-4">Who are you sending money to?</h3>
          <form onSubmit={handleVerify} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="accountNumber">Recipient account number</label>
              <input
                id="accountNumber"
                className="form-input mono"
                placeholder="10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                maxLength={10}
                required
              />
              <span className="form-hint">All SFB account numbers are 10 digits.</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={verifying}>
              {verifying ? <span className="spinner" /> : 'Verify account'}
            </button>
          </form>
        </div>
      )}

      {/* --- Step 2: Amount --- */}
      {step === STEPS.AMOUNT && recipient && (
        <div className="card">
          <div className="alert alert-info">
            Sending to <strong>{recipient.accountName}</strong> — <span className="mono">{recipient.accountNumber}</span>
          </div>
          <form onSubmit={handleAmountSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount</label>
              <div className="input-group">
                <span className="input-group-addon">NGN</span>
                <input
                  id="amount"
                  className="form-input mono"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  inputMode="decimal"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="narration">Narration (optional)</label>
              <input
                id="narration"
                className="form-input"
                placeholder="What's this for?"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="flex gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(STEPS.RECIPIENT)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Step 3: Confirm --- */}
      {step === STEPS.CONFIRM && recipient && (
        <div className="card">
          <h3 className="mb-4">Review and confirm</h3>
          <div className="hero-card-rows mb-4">
            <div className="hero-card-row">
              <div className="hero-card-row-label">
                <span>Recipient</span>
                <span>{recipient.accountNumber}</span>
              </div>
              <span>{recipient.accountName}</span>
            </div>
            <div className="hero-card-row">
              <div className="hero-card-row-label">
                <span>Amount</span>
              </div>
              <span className="hero-card-amount negative">{formatCurrency(amount)}</span>
            </div>
            {narration && (
              <div className="hero-card-row">
                <div className="hero-card-row-label">
                  <span>Narration</span>
                </div>
                <span>{narration}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(STEPS.AMOUNT)} disabled={submitting}>
              Back
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirm} disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Confirm transfer'}
            </button>
          </div>
        </div>
      )}

      {/* --- Success --- */}
      {step === STEPS.SUCCESS && result && (
        <div className="card text-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--sfb-success-bg)',
              color: 'var(--sfb-success)',
              margin: '0 auto var(--space-4) auto',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3>Transfer successful</h3>
          <p className="text-muted">
            {formatCurrency(result.amount, result.currency)} was sent to {result.recipient.name}.
          </p>
          <p className="mono text-sm">{result.reference}</p>

          <div className="flex gap-3 mt-4">
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={resetFlow}>
              New transfer
            </button>
            <a
              className="btn btn-primary"
              style={{ flex: 1 }}
              href={transactionService.getReceiptUrl(result.reference)}
              target="_blank"
              rel="noreferrer"
            >
              Download receipt
            </a>
          </div>
          <button className="btn btn-ghost btn-block mt-2" onClick={() => navigate('/dashboard/transactions')}>
            View transaction history
          </button>
        </div>
      )}
    </div>
  );
};

export default TransferPage;
