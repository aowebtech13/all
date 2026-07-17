"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: email, 1: OTP
  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', '']
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [otpSingle, setOtpSingle] = useState('');


  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
    if (errors.email) setErrors({ ...errors, email: '' });
  };

  const handleOtpSingleChange = (e) => {
    const cleaned = (e.target.value || '').replace(/\D/g, '').slice(0, 6);
    setOtpSingle(cleaned);
    setFormData({ ...formData, otp: Array(6).fill('').map((_, i) => cleaned[i] || '') });

    // Prevent user from typing beyond 6 chars
  };


  // Password fields removed from this step
  const handlePasswordChange = () => {};

  const validateEmail = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Invalid email' });
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    const nextErrors = {};
    const otpCode = formData.otp.join('');
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) nextErrors.otp = 'Enter valid 6-digit OTP';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/forgot-password`;
      console.log('[ForgotPassword] Request URL:', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('OTP sent to your email!');
        setStep(1);
        setTimeout(() => document.getElementById('otp-single')?.focus(), 100);

      } else {
        setErrors({ email: data.message || 'Failed to send OTP' });
      }
    } catch (err) {
      console.error('[ForgotPassword] Fetch failed:', err);
      setErrors({ email: 'Network error' });
    } finally {

      setLoading(false);
    }
  };

  const handleOtpContinue = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    const otpCode = otpSingle || formData.otp.join('');


    // Preserve email + OTP for the next page via query params
    const encodedEmail = btoa(encodeURIComponent(formData.email));
    const encodedOtp = btoa(encodeURIComponent(otpCode));

    router.push(`/auth/forgot-password/set-password?email=${encodedEmail}&otp=${encodedOtp}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{step === 0 ? 'Forgot Password?' : 'Reset Password'}</h2>
          <p>{step === 0 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}</p>
        </div>

        {step === 0 ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            {message && <div className="success">{message}</div>}
            {errors.email && <div className="error">{errors.email}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter registered email"
                value={formData.email}
                onChange={handleEmailChange}
              />
            </div>

            <button type="submit" className="cmn-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="switch-link">
              <Link href="/auth/login">← Back to Login</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpContinue} className="auth-form">
            {message && <div className="success">{message}</div>}
            {errors.general && <div className="error">{errors.general}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                style={{ background: '#f3f4f6' }}
              />
            </div>

            <div className="otp-group">
              <label>Enter OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otpSingle}
                onChange={handleOtpSingleChange}
              />
            </div>

            {errors.otp && <div className="error">{errors.otp}</div>}

            <button type="submit" className="cmn-btn" disabled={loading}>
              Continue
            </button>

            <div className="switch-link">
              <Link href="/auth/forgot-password">Resend OTP</Link>
            </div>
            <div className="switch-link">
              <Link href="/auth/login">← Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

