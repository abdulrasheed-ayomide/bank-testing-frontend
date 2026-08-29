import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import PasswordInput from '../../components/common/PasswordInput';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (
        error.response?.data?.error?.code === "EMAIL_NOT_VERIFIED"
      ) {
        navigate("/verify-otp", {
          state: { email: form.email },
        });
        return;
      }

      toast.error(
        getErrorMessage(
          error,
          "Login failed. Please check your credentials."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Log in to your account</h1>
        <p className="text-muted text-sm mb-0">Enter your credentials to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
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

        <div className="form-group">
          <div className="flex justify-between items-center">
            <label className="form-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-sm">Forgot password?</Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Log in'}
        </button>
      </form>

      <p className="auth-form-footer">
        New to SFB? <Link to="/register">Open an account</Link>
      </p>
    </>
  );
};

export default LoginPage;
