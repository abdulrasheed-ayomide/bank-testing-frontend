import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState(location.state?.email || '');
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');

    if (!email) {
      toast.error('Please enter the email address you registered with.');
      return;
    }
    if (code.length !== OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({ email, code });
      toast.success('Email verified. Your account is now active — please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Verification failed. Please check the code and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter the email address you registered with.');
      return;
    }
    setResending(true);
    try {
      await authService.resendOtp({ email });
      toast.success('A new verification code has been sent to your email.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not resend code. Please try again shortly.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Verify your email</h1>
        <p className="text-muted text-sm mb-0">
          We've sent a 6-digit verification code to your email address.
          Enter it below to activate your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {!location.state?.email && (
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label sr-only" htmlFor="otp-0">Verification code</label>
          <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1} of verification code`}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Verify email'}
        </button>
      </form>

      <div className="auth-otp-resend">
        Didn't get a code?{' '}
        <button onClick={handleResend} disabled={cooldown > 0 || resending}>
          {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      <p className="auth-form-footer">
        Back to <Link to="/login">log in</Link>
      </p>
    </>
  );
};

export default VerifyOtpPage;
