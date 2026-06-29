import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaConciergeBell } from 'react-icons/fa';

// Component: Footer
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Kolom 1: Tentang Resort */}
        <div className="footer-col footer-col-about">
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/logo.png" alt="Hotel Arca Logo" style={{ height: '55px', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span style={{ fontFamily: 'var(--font-title, "Playfair Display", serif)', fontSize: '0.65rem', fontWeight: '400', color: 'var(--color-gold, #c8a45a)', letterSpacing: '3px', textTransform: 'uppercase' }}>Hotel</span>
              <span style={{ fontFamily: 'var(--font-title, "Playfair Display", serif)', fontSize: '1.4rem', fontWeight: '700', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>Arca</span>
              <span style={{ display: 'block', width: '100%', height: '1.5px', background: 'linear-gradient(90deg, var(--color-gold, #c8a45a), transparent)', marginTop: '2px' }}></span>
            </div>
          </div>
          <p>
            An exquisite beach resort sanctuary situated on the coast of Lombok. 
            Experience unparalleled modern luxury blended seamlessly with traditional Sasak values and stunning tropical nature.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Follow us on Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Like our Facebook page">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Follow us on Twitter">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Subscribe to our YouTube channel">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Kolom 2: Tautan Menu */}
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home" className="footer-link">Home</a></li>
            <li><a href="#rooms" className="footer-link">Rooms & Suites</a></li>
            <li><a href="#facilities" className="footer-link">Resort Facilities</a></li>
            <li><a href="#about" className="footer-link">About Lombok</a></li>
            <li><a href="#booking" className="footer-link">Book Now</a></li>
          </ul>
        </div>

        {/* Kolom 3: Jam Layanan & Kebijakan */}
        <div className="footer-col">
          <h4>Resort Info</h4>
          <p><strong>Check-in:</strong> 14:00 PM</p>
          <p><strong>Check-out:</strong> 12:00 PM</p>
          <p><strong>Reception:</strong> Open 24 Hours</p>
          <p><strong>Dress Code:</strong> Smart Casual in Dining Areas</p>
        </div>

        {/* Kolom 4: Kontak & Alamat */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          
          <div className="footer-contact-item">
            <FaMapMarkerAlt />
            <span>Jl. Raya Pantai Senggigi No. 77, Senggigi, Batu Layar, Lombok Barat, NTB, 83355, Indonesia</span>
          </div>

          <div className="footer-contact-item">
            <FaPhoneAlt />
            <span>+62 (370) 654-3210</span>
          </div>

          <div className="footer-contact-item">
            <FaEnvelope />
            <span>info@hotelarca.com</span>
          </div>
        </div>
      </div>

      {/* Baris Bawah / Hak Cipta */}
      <div className="footer-divider">
        <p>&copy; {new Date().getFullYear()} Hotel Arca. All Rights Reserved.</p>
        <p>Designed for Ultimate Luxury & Comfort</p>
      </div>
    </footer>
  );
}
