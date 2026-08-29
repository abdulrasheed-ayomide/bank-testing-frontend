import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getErrorMessage, getFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import PasswordInput from '../../components/common/PasswordInput';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [form, setForm] = useState({ email: emailFromUrl, password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      toast.error('This password reset link is invalid or has expired.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
//       console.log({
//   email: form.email,
//   token,
//   password: form.password,
//   confirmPassword: form.confirmPassword,
// });
      await authService.resetPassword({  email: form.email,  token,  password: form.password,  confirmPassword: form.confirmPassword });
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (error) {

  //    console.log(
  //   'RESET ERROR FULL',
  //   JSON.stringify(error.response?.data, null, 2)
  // );

  // console.log(
  //   'DETAILS',
  //   error.response?.data?.error?.details
  // );


      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error(getErrorMessage(error, 'Could not reset password. The link may have expired.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Set a new password</h1>
        <p className="text-muted text-sm mb-0">
          Choose a strong, unique password for your SFB account.
        </p>
      </div>

      {!token && (
        <div className="alert alert-warning">
          This page should be opened from the reset link in your email. If
          you arrived here directly, request a new link.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {!emailFromUrl && (
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="password">New password</label>
          <PasswordInput
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            hasError={!!errors.password}
            autoComplete="new-password"
          />
          {errors.password ? (
            <span className="form-error">{errors.password}</span>
          ) : (
            <span className="form-hint">
              At least 8 characters, with uppercase, lowercase, a number, and a special character.
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm new password</label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your new password"
            hasError={!!errors.confirmPassword}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading || !token}>
          {loading ? <span className="spinner" /> : 'Reset password'}
        </button>
      </form>

      <p className="auth-form-footer">
        Back to <Link to="/login">log in</Link>
      </p>
    </>
  );
};

export default ResetPasswordPage;
