"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaPhone, FaExclamationCircle } from 'react-icons/fa';
<<<<<<< HEAD
import { register, login, setAuthToken } from '../../services/api';
=======
>>>>>>> upstream/main

export default function LoginPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
=======
>>>>>>> upstream/main

  // Clear notifications on tab switch
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    });
  }, [isLoginMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

<<<<<<< HEAD
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // ── LOGIN ──
        const { email, password } = formData;

        if (!email || !password) {
          setErrorMsg('Email dan Password wajib diisi.');
          setIsLoading(false);
          return;
        }

        const data = await login(email, password, 'customer');
        setAuthToken(data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setSuccessMsg(`Selamat datang kembali, ${data.user.name}!`);
        setTimeout(() => router.push('/'), 1000);

      } else {
        // ── REGISTER ──
        const { name, email, phoneNumber, password, confirmPassword } = formData;

        if (!name || !email || !phoneNumber || !password || !confirmPassword) {
          setErrorMsg('Semua kolom wajib diisi.');
          setIsLoading(false);
          return;
        }

        if (!/^[0-9+\-\s]{8,15}$/.test(phoneNumber.trim())) {
          setErrorMsg('Format nomor telepon tidak valid. Contoh: 08123456789');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi password tidak cocok.');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password minimal terdiri dari 6 karakter.');
          setIsLoading(false);
          return;
        }

        await register(name, email, password, phoneNumber.trim());

        setSuccessMsg('Registrasi berhasil! Silakan masuk dengan akun Anda.');
        setTimeout(() => {
          setIsLoginMode(true);
          setFormData({
            name: '',
            email: email,
            phoneNumber: '',
            password: '',
            confirmPassword: ''
          });
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      if (apiError) {
        setErrorMsg(apiError);
      } else if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
=======
  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      const { email, password } = formData;

      if (!email || !password) {
        setErrorMsg('Email dan Password wajib diisi.');
        return;
      }

      // Blokir email staff/owner jika dicoba login di halaman customer ini
      if (email.toLowerCase() === 'staff@arca.com' || email.toLowerCase() === 'owner@arca.com') {
        setErrorMsg('Gagal. Silakan masuk melalui portal manajemen masing-masing.');
        return;
      }

      // Check Customers in localStorage
      const users = JSON.parse(localStorage.getItem('hotel_users') || '[]');
      const customer = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (customer) {
        const customerUser = { 
          name: customer.name, 
          email: customer.email, 
          phoneNumber: customer.phoneNumber || '',
          role: 'customer' 
        };
        localStorage.setItem('currentUser', JSON.stringify(customerUser));
        setSuccessMsg(`Selamat datang kembali, ${customer.name}!`);
        setTimeout(() => router.push('/'), 1000);
      } else {
        setErrorMsg('Email atau password salah.');
      }

    } else {
      // --- REGISTER LOGIC ---
      const { name, email, phoneNumber, password, confirmPassword } = formData;

      if (!name || !email || !phoneNumber || !password || !confirmPassword) {
        setErrorMsg('Semua kolom wajib diisi.');
        return;
      }

      // Validasi nomor telepon
      if (!/^[0-9+\-\s]{8,15}$/.test(phoneNumber.trim())) {
        setErrorMsg('Format nomor telepon tidak valid. Contoh: 08123456789');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi password tidak cocok.');
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Password minimal terdiri dari 6 karakter.');
        return;
      }

      // Check if email already registered
      if (email === 'staff@arca.com' || email === 'owner@arca.com') {
        setErrorMsg('Email ini tidak dapat didaftarkan.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('hotel_users') || '[]');
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        setErrorMsg('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        return;
      }

      // Create new customer account
      const newCustomer = { name, email, phoneNumber: phoneNumber.trim(), password };
      users.push(newCustomer);
      localStorage.setItem('hotel_users', JSON.stringify(users));

      // Do NOT auto-login. Show success message and switch to login mode after 2 seconds.
      setSuccessMsg('Registrasi berhasil! Silakan masuk dengan akun Anda.');
      setTimeout(() => {
        setIsLoginMode(true);
        setFormData({
          name: '',
          email: newCustomer.email,
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        setSuccessMsg('');
      }, 2000);
>>>>>>> upstream/main
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back button */}
        <Link href="/" className="auth-back-btn">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Brand Logo */}
        <div className="auth-brand">
          <img src="/assets/logo.png" alt="Hotel Arca" className="auth-logo-img" />
          <div className="auth-brand-text">
            <span className="auth-brand-hotel">Hotel</span>
            <span className="auth-brand-arca">Arca</span>
            <span className="auth-brand-line"></span>
          </div>
          <p>Luxury Beachfront Sanctuary</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
<<<<<<< HEAD
          <button
=======
          <button 
>>>>>>> upstream/main
            type="button"
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
<<<<<<< HEAD
          <button
=======
          <button 
>>>>>>> upstream/main
            type="button"
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Register
          </button>
        </div>

        {/* Alert Messages */}
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

        {/* Form */}
        <form onSubmit={handleAuth} className="auth-form" noValidate>
          {!isLoginMode && (
            <div className="auth-group">
              <label htmlFor="name">Nama Lengkap</label>
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
<<<<<<< HEAD
                <input
                  type="text"
=======
                <input 
                  type="text" 
>>>>>>> upstream/main
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-group">
            <label htmlFor="email">Alamat Email</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
<<<<<<< HEAD
              <input
                type="email"
=======
              <input 
                type="email" 
>>>>>>> upstream/main
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@domain.com"
                required
              />
            </div>
          </div>

          {/* Nomor HP — hanya di Register */}
          {!isLoginMode && (
            <div className="auth-group">
              <label htmlFor="phoneNumber">Nomor HP / WhatsApp</label>
              <div className="auth-input-wrapper">
                <FaPhone className="auth-input-icon" />
<<<<<<< HEAD
                <input
                  type="tel"
=======
                <input 
                  type="tel" 
>>>>>>> upstream/main
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  required
                  maxLength={15}
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
<<<<<<< HEAD
              <input
                type="password"
=======
              <input 
                type="password" 
>>>>>>> upstream/main
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div className="auth-group">
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
<<<<<<< HEAD
                <input
                  type="password"
=======
                <input 
                  type="password" 
>>>>>>> upstream/main
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password Anda"
                  required
                />
              </div>
            </div>
          )}

<<<<<<< HEAD
          <button type="submit" className="btn-gold auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Memproses...' : (isLoginMode ? 'Masuk' : 'Daftar Sekarang')}
=======
          <button type="submit" className="btn-gold auth-submit-btn">
            {isLoginMode ? 'Masuk' : 'Daftar Sekarang'}
>>>>>>> upstream/main
          </button>
        </form>
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

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 24px;
        }

        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-light);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: var(--transition-smooth);
          text-align: center;
        }

        .auth-tab:hover {
          color: var(--color-blue-deep);
        }

        .auth-tab.active {
          color: var(--color-gold);
          border-bottom-color: var(--color-gold);
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
<<<<<<< HEAD

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
=======
>>>>>>> upstream/main
      `}</style>
    </div>
  );
}
