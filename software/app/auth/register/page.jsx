"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    phone: '',
    password: '',
    confirmPassword: '',
 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict numerical layout protection for the age input field
    if (name === 'age' && value !== '') {
      const numericAge = parseInt(value, 10);
      if (numericAge > 99) return; // Instantly blocks typing anything over 99
    }

    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus?.(null);

    register({
      name: formData.fullName,
      email: formData.email,
      age: formData.age,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      source: 'enterprise',
      setErrors,
    })
      .then((res) => {
        // Redirect user to email OTP verification page
        const email = encodeURIComponent(formData.email);
        router.push(`/auth/verify-email?email=${email}`);
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
          <h2>Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} method="POST" className="auth-form">
          {status && <div className="success">{status}</div>}
          {errors.general && <div className="error">{errors.general}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.name && <div className="error">{errors.name[0]}</div>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email[0]}</div>}
          </div>


          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              min="18"
              max="99"
              step="1"
              value={formData.age || ''}
              onChange={handleChange}
            />
            {errors.age && <div className="error">{errors.age[0]}</div>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span style={{ padding: '0 5px', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '4px 0 0 4px', height: '38px', display: 'flex', alignItems: 'center', background: '#f3f4f6', fontWeight: 600 }}>
                +39
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                style={{ borderRadius: '0 4px 4px 0', borderLeft: 'none' }}
              />
            </div>
            {errors.phone && <div className="error">{errors.phone[0]}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="error">{errors.password[0]}</div>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.password_confirmation && <div className="error">{errors.password_confirmation[0]}</div>}
          </div>

          <button type="submit" className="cmn-btn" disabled={loading}>
            {loading ? (
              <span className="auth-btn-content">
                <span className="auth-spinner" aria-hidden="true" />
                <span>Creating Account...</span>
              </span>
            ) : (
              'Create Account'
            )}
          </button>


          <div className="switch-link">
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;