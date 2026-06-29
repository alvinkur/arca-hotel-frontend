"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import { login, setAuthToken } from '../../../services/api';

export default function StaffLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { email, password } = formData;

      if (!email || !password) {
        setErrorMsg('Email dan Password wajib diisi.');
        setIsLoading(false);
        return;
      }

      const data = await login(email, password, 'staff');
      setAuthToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setSuccessMsg('Otorisasi Staff Berhasil! Mengalihkan...');
      setTimeout(() => router.push('/staff'), 1000);
    } catch (err) {
      const apiError = err.response?.data?.error;
      setErrorMsg(apiError || 'Kredensial Staff salah atau tidak terdaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-back-btn">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="auth-brand">
          <img src="/assets/logo.png" alt="Hotel Arca" className="auth-logo-img" />
          <div className="auth-brand-text">
            <span className="auth-brand-hotel">Hotel</span>
            <span className="auth-brand-arca">Arca</span>
            <span className="auth-brand-line"></span>
          </div>
          <p>Staff Portal</p>
        </div>

        {errorMsg && (
          <div className="auth-alert alert-danger">
            <FaExclamationCircle /> <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-alert alert-success">
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <div className="auth-group">
            <label htmlFor="email">Alamat Email Staff</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="staff@arca.com"
                required
              />
            </div>
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-gold auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk Sebagai Staff'}
          </button>
        </form>

        <div className="auth-hints">
          <p className="hint-title">DEMO ACCOUNT INFO:</p>
          <p><strong>Email:</strong> staff@arca.com</p>
          <p><strong>Password:</strong> password123</p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-card {
          background-color: var(--color-white);
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          padding: 40px;
          position: relative;
        }

        .auth-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--color-text-light);
          font-weight: 500;
          margin-bottom: 24px;
          transition: var(--transition-smooth);
        }

        .auth-back-btn:hover {
          color: var(--color-gold);
          transform: translateX(-2px);
        }

        .auth-brand {
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .auth-logo-img {
          height: 70px;
          width: auto;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
        }

        .auth-brand-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
        }

        .auth-brand-hotel {
          font-family: var(--font-title);
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--color-gold);
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .auth-brand-arca {
          font-family: var(--font-title);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-blue-deep);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .auth-brand-line {
          display: block;
          width: 50px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
          margin-top: 4px;
        }

        .auth-brand p {
          font-size: 0.8rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 4px;
        }

        .auth-alert {
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.4;
        }

        .alert-danger {
          background-color: #fef0f0;
          color: #f56c6c;
          border: 1px solid #fde2e2;
        }

        .alert-success {
          background-color: #f0f9eb;
          color: #67c23a;
          border: 1px solid #c2e7b0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-blue-deep);
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: var(--color-text-light);
          opacity: 0.7;
          font-size: 0.95rem;
        }

        .auth-input-wrapper input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border: 1px solid var(--color-sand-dark);
          border-radius: var(--radius-sm);
          background-color: var(--color-sand-light);
          font-size: 0.95rem;
          color: var(--color-text-dark);
          transition: var(--transition-smooth);
        }

        .auth-input-wrapper input:focus {
          border-color: var(--color-gold);
          background-color: var(--color-white);
          outline: none;
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.15);
        }

        .auth-submit-btn {
          margin-top: 10px;
          padding: 14px;
          font-size: 0.95rem;
          font-weight: 600;
          width: 100%;
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-hints {
          margin-top: 24px;
          padding: 12px;
          background-color: var(--color-blue-light);
          border: 1px solid rgba(29, 106, 138, 0.15);
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--color-text-light);
          line-height: 1.5;
        }

        .hint-title {
          font-weight: 700;
          color: var(--color-blue-deep);
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
