"use client";

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const safeDecode = (v) => {
  try {
    if (!v) return '';
    return decodeURIComponent(atob(v));
  } catch {
    return '';
  }
};

const SetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = useMemo(() => safeDecode(searchParams.get('email')), [searchParams]);
  const otp = useMemo(() => safeDecode(searchParams.get('otp')), [searchParams]);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) nextErrors.otp = 'Invalid or missing OTP';
    if (!email) nextErrors.email = 'Missing email';
    if (!formData.newPassword) nextErrors.newPassword = 'New password required';
    else if (formData.newPassword.length < 8) nextErrors.newPassword = 'Password must be at least 8 characters';

    if (formData.newPassword !== formData.confirmNewPassword) nextErrors.confirmNewPassword = 'Passwords do not match';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://livinus-backend-api.lexicron.org'}/api/auth/verify-otp`;
      console.log('[SetPassword] Request URL:', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          password: formData.newPassword
        })
      });

      // Backend might return HTML (e.g. error page/redirect) instead of JSON.
      // Avoid crashing on `res.json()` with `Unexpected token '<'`.
      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.toLowerCase().includes('application/json');

      let data = null;
      if (isJson) {
        data = await res.json().catch(() => null);
      }

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        const message = (data && (data.message || data.error))
          ? (data.message || data.error)
          : 'Invalid OTP';
        setErrors({ otp: message });
      }
    } catch (err) {
      console.error('[SetPassword] Fetch failed:', err);
      setErrors({ general: 'Network error' });
    } finally {
      setLoading(false);

    }
  };

  const backHref = useMemo(() => {
    // keep flow stable; user can resend OTP from the forgot-password page
    return '/auth/forgot-password';
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter OTP and set your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && <div className="success">{message}</div>}
          {errors.general && <div className="error">{errors.general}</div>}

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} readOnly style={{ background: '#f3f4f6' }} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>OTP</label>
            <input type="text" value={otp} readOnly style={{ background: '#f3f4f6' }} />
            {errors.otp && <div className="error">{errors.otp}</div>}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
            {errors.confirmNewPassword && <div className="error">{errors.confirmNewPassword}</div>}
          </div>

          <button type="submit" className="cmn-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="switch-link">
            <Link href={backHref}>← Back</Link>
          </div>
          <div className="switch-link">
            <Link href="/auth/login">← Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;

