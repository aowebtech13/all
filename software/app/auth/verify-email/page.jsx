"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const { verifyEmailCode, resendEmailVerification, user, loading: authLoading } = useAuth({
    // Do not require authenticated+verified while user is entering OTP
    middleware: 'guest',
    redirectIfAuthenticated: null,
  });

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array.from({ length: 6 }, () => ''));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [resending, setResending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEmail(emailFromQuery ? decodeURIComponent(emailFromQuery) : '');
  }, [emailFromQuery]);

  const otpString = useMemo(() => code.join(''), [code]);

  const handleChangeDigit = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    setCode((prev) => prev.map((d, i) => (i === index ? cleaned : d)));
    setErrors((prev) => ({ ...prev, otp: undefined, code: undefined }));
  };

  const fillCodeFromString = (raw) => {
    const digits = (raw || '').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;

    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i++) {
        next[i] = digits[i] || '';
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, otp: undefined, code: undefined }));
  };

  const handlePasteOTP = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') || '';
    fillCodeFromString(text);
  };


  const isCodeComplete = otpString.length === 6 && /^\d{6}$/.test(otpString);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: ['Email is required'] });
      return;
    }
    if (!isCodeComplete) {
      setErrors({ code: ['Enter valid 6-digit code'] });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await verifyEmailCode({
        setErrors,
        setStatus,
        email,
        code: otpString,
      });

      // Once verified, user should now pass ensure.email.verified.
      // Only proceed if backend actually marked the email as verified.
      // (prevents users from skipping required registration forms)
      if (res?.user?.email_verified_at) {
        router.push('/pay-step/step-2?verified=1');
      }

    } catch (err) {
      // useAuth should set errors for 422; fall back to message
      const msg = err?.response?.data?.message || 'Verification failed';
      setStatus(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setStatus(null);
    setErrors({});
    try {
      await resendEmailVerification({ setStatus: (s) => setStatus(s || null), email });
    } catch (err) {
      setStatus(err?.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  // If already verified, skip UI
  useEffect(() => {
    if (!authLoading && user?.email_verified_at) {
      router.replace('/pay-step/step-2?verified=1');
    }
  }, [authLoading, user, router]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Verify Your Account</h2>
          <p>Enter the 6-digit code sent to {email || 'your email'}.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {status && <div className="success">{status}</div>}
          {(errors?.email?.[0] || errors?.code?.[0] || errors?.otp?.[0]) && (
            <div className="error">
              {errors?.email?.[0] || errors?.code?.[0] || errors?.otp?.[0]}
            </div>
          )}



          {/* Email display */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={!!emailFromQuery}
            />
          </div>

          {/* OTP inputs */}
          <div className="form-group">
            <label>Verification Code</label>
            <div
              onPaste={handlePasteOTP}
              style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
            >
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChangeDigit(idx, e.target.value)}
                  style={{
                    width: 42,
                    textAlign: 'center',
                    fontSize: 18,
                    borderRadius: 6,
                    border: '1px solid #000000',
                    padding: '8px 0',
                  }}
                />
              ))}
            </div>
          </div>


          <button type="submit" className="cmn-btn" disabled={submitting || !isCodeComplete}>
            {submitting ? 'Verifying...' : 'Verify Account'}
          </button>

          <div className="switch-link" style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={handleResend}
              className="link-button"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: '#0d6efd' }}
              disabled={resending}
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

