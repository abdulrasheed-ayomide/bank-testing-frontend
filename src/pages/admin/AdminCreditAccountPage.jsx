import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';

export default function AdminCreditAccountPage() {
  const [form, setForm] = useState({ accountNumber: '', amount: '', narration: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!form.accountNumber || form.accountNumber.length < 10) {
      setError('Please enter a valid 10-digit account number.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    if (!form.narration.trim()) {
      setError('Please provide a narration for this credit.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await adminService.creditAccount({
        accountNumber: form.accountNumber,
        amount: Number(form.amount),
        narration: form.narration,
      });
      setResult(data);
      setForm({ accountNumber: '', amount: '', narration: '' });
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to credit account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return '—';
    return `NGN ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="credit-page">

      {/* Page header */}
      <div className="credit-page__header">
        <div>
          <h2 className="credit-page__title">Credit Customer Account</h2>
          <p className="credit-page__subtitle">
            Admin-only feature — customers cannot credit their own accounts.
          </p>
        </div>
        <span className="badge badge-warning">Admin Only</span>
      </div>

      <div className="credit-page__body">

        {/* Form card */}
        <div className="card credit-form-card">
          <div className="credit-form-card__icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M6 12h12" />
            </svg>
          </div>
          <h3 className="credit-form-card__heading">Add Funds</h3>

          <form onSubmit={handleSubmit} noValidate>

            {/* Account Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="accountNumber">Account Number</label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                inputMode="numeric"
                maxLength={10}
                className={`form-input mono${error && !form.accountNumber ? ' has-error' : ''}`}
                placeholder="10-digit account number"
                value={form.accountNumber}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount</label>
              <div className="input-group">
                <span className="input-group-addon">₦</span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  className="form-input mono"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>
              <span className="form-hint">Enter the exact amount to credit in Naira.</span>
            </div>

            {/* Narration */}
            <div className="form-group">
              <label className="form-label" htmlFor="narration">Narration</label>
              <input
                id="narration"
                name="narration"
                type="text"
                maxLength={200}
                className="form-input"
                placeholder="e.g. Initial deposit, Welcome bonus"
                value={form.narration}
                onChange={handleChange}
              />
              <span className="form-hint">{form.narration.length}/200 characters</span>
            </div>

            {/* Inline error */}
            {error && (
              <div className="credit-form__error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 5v14M5 12l7-7 7 7" />
                  </svg>
                  Credit Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success result card */}
        {result && (
          <div className="card credit-result-card" role="status" aria-live="polite">
            <div className="credit-result-card__top">
              <div className="credit-result-card__check">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="credit-result-card__label">Credit successful</div>
                <div className="credit-result-card__amount">
                  {result.data?.transaction ? formatCurrency(parseFloat(result.data.transaction.amount)) : ''}
                </div>
              </div>
            </div>

            <div className="credit-result-card__rows">
              {[
                ['Account number', result.data?.account?.accountNumber],
                ['Account holder', result.data?.transaction?.recipient?.name],
                ['New balance', result.data?.account ? formatCurrency(parseFloat(result.data.account.balance)) : '—'],
                ['Transaction ref', result.data?.transaction?.reference],
                ['Narration', result.data?.transaction?.narration],
              ].map(([label, value]) => (
                <div key={label} className="credit-result-card__row">
                  <span className="credit-result-card__row-label">{label}</span>
                  <span className="credit-result-card__row-value mono">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice card */}
        <div className="credit-notice">
          <div className="credit-notice__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <strong className="credit-notice__title">Important</strong>
            <p className="credit-notice__text">
              This feature is strictly for administrators. Every credit is permanently logged in the
              audit trail with your admin identity. Customers have no access to this feature.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}