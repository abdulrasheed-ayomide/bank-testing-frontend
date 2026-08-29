import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getErrorMessage, getFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import PasswordInput from '../../components/common/PasswordInput';

const initialForm = {
  fullName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await authService.register(form);
      toast.success('Account created. Check your email for a verification code.');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Open your SFB account</h1>
        <p className="text-muted text-sm mb-0">
          It takes less than five minutes. You'll verify your email before
          your account is activated.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`form-input ${errors.fullName ? 'has-error' : ''}`}
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-input ${errors.username ? 'has-error' : ''}`}
              placeholder="janedoe"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'has-error' : ''}`}
              placeholder="+2348012345678"
              value={form.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
            {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'has-error' : ''}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
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
          <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            hasError={!!errors.confirmPassword}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Create account'}
        </button>
      </form>

      <p className="auth-form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
};

export default RegisterPage;
