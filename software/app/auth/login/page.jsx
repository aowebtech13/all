"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset && errors.length === 0) {
      setStatus(atob(reset));
    } else {
      setStatus(null);
    }
  }, [searchParams, errors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus(null);
    login({ 
        email: formData.email, 
        password: formData.password, 
        remember: formData.remember, 
        setErrors, 
        setStatus 
    })
    .catch(error => {
        if (error.response?.status !== 422) {
            setErrors({ general: ['An unexpected error occurred. Please try again.'] });
        }
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
            <Image 
              src="https://res.cloudinary.com/djme9spdc/image/upload/v1784264310/logo-b_ttgqlm.png" 
              height={20} 
              width={120} 
              alt="Logo"
            />
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} method="POST" className="auth-form">
          {status && <div className="success">{status}</div>}
          {errors.general && <div className="error">{errors.general[0]}</div>}
          {errors.email && <div className="error">{errors.email[0]}</div>}
          {errors.password && <div className="error">{errors.password[0]}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              required
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="cmn-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="switch-link">
            <Link href="/auth/forgot-password">Forgot Password?</Link>
          </div>
          <div className="switch-link">
            Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

