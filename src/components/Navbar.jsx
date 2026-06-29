"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaConciergeBell } from 'react-icons/fa';
<<<<<<< HEAD
import { clearAuth } from '../services/api';
=======
>>>>>>> upstream/main

// Component: Navbar
export default function Navbar({ onBookingClick }) {
  // useState() - Menyimpan status buka/tutup menu navigasi mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // useState() - Menyimpan status apakah halaman telah di-scroll ke bawah
  const [isScrolled, setIsScrolled] = useState(false);

  // useState() - Menyimpan user yang sedang login saat ini
  const [currentUser, setCurrentUser] = useState(null);

  // Load user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    }
  }, []);

  const handleLogout = () => {
<<<<<<< HEAD
    clearAuth();
=======
    localStorage.removeItem('currentUser');
>>>>>>> upstream/main
    setCurrentUser(null);
    window.location.href = '/';
  };

  // useEffect() - Mengatur event listener scroll saat pertama kali render
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      // Membersihkan event listener saat component di-unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="navbar-logo" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <img src="/assets/logo.png" alt="Hotel Arca" style={{ height: '60px', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
          <span style={{ fontFamily: 'var(--font-title, "Playfair Display", serif)', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-gold, #c8a45a)', letterSpacing: '3px', textTransform: 'uppercase' }}>Hotel</span>
          <span style={{ fontFamily: 'var(--font-title, "Playfair Display", serif)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-blue-deep, #1a3c5e)', letterSpacing: '2px', textTransform: 'uppercase' }}>Arca</span>
          <span style={{ display: 'block', width: '100%', height: '1.5px', background: 'linear-gradient(90deg, var(--color-gold, #c8a45a), transparent)', marginTop: '2px' }}></span>
        </div>
      </Link>

      {/* Mobile Menu Icon */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link href="/#home" className="navbar-link" onClick={closeMobileMenu}>
          Home
        </Link>
        <Link href="/#rooms" className="navbar-link" onClick={closeMobileMenu}>
          Rooms
        </Link>
        <Link href="/#facilities" className="navbar-link" onClick={closeMobileMenu}>
          Facilities
        </Link>
        <Link href="/#about" className="navbar-link" onClick={closeMobileMenu}>
          About
        </Link>
        <Link href="/#booking" className="navbar-link" onClick={closeMobileMenu}>
          Booking
        </Link>
        <Link href="/booking-status" className="navbar-link" onClick={closeMobileMenu}>
          Cek Booking
        </Link>
        
        {currentUser ? (
          <>
            <span className="navbar-user-greet" style={{ color: 'var(--color-blue-deep)', fontWeight: '600', fontSize: '0.9rem', padding: '8px 0' }}>
              Hi, {currentUser.name.split(' ')[0]}
            </span>
            <button 
              onClick={() => {
                closeMobileMenu();
                handleLogout();
              }} 
              className="navbar-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'block' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="navbar-link" onClick={closeMobileMenu}>
            Login / Register
          </Link>
        )}

        <button 
          onClick={() => {
            closeMobileMenu();
            onBookingClick();
          }} 
          className="btn-gold navbar-btn"
        >
          Book Now
        </button>
      </div>
    </nav>
  );
}
