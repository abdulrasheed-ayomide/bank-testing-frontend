import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <div className="auth-form-header">
          <h1>Check your email</h1>
          <p className="text-muted text-sm mb-0">
            If an account exists for <strong>{email}</strong>, we've sent a
            link to reset your password. The link expires in 30 minutes.
          </p>
        </div>
        <Link to="/login" className="btn btn-secondary btn-block">
          Back to log in
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="auth-form-header">
        <h1>Reset your password</h1>
        <p className="text-muted text-sm mb-0">
          Enter the email address associated with your account and we'll
          send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className={`form-input ${error ? 'has-error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {error && <span className="form-error">{error}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Send reset link'}
        </button>
      </form>

      <p className="auth-form-footer">
        Remembered your password? <Link to="/login">Log in</Link>
      </p>
    </>
  );
};

export default ForgotPasswordPage;
