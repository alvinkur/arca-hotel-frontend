"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaBed, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaSave,
  FaLock,
  FaSignOutAlt,
  FaCheckCircle
} from 'react-icons/fa';

const DEFAULT_ROOMS = [
  {
    id: 1,
    name: "Economy Room",
    price: 150000,
    description: "Perfect for budget-conscious travelers. Cozy layout with basic facilities, comfortable bed, and pleasant surroundings.",
    image: "/assets/ekonomi_room.jpg",
    amenities: ["Free WiFi", "Smart TV"]
  },
  {
    id: 2,
    name: "Standard Room",
    price: 150000,
    description: "A blend of comfort and style. Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.",
    image: "/assets/standart_room.jpg",
    amenities: ["Free WiFi", "Breakfast", "Smart TV"]
  },
  {
    id: 3,
    name: "VIP Suite",
    price: 250000,
    description: "Experience absolute luxury. Spaciously designed with high-end furniture, private lounge, premium entertainment, and premium comfort.",
    image: "/assets/vip_room.jpg",
    amenities: ["Free WiFi", "Breakfast", "Smart TV"]
  }
];

export default function OwnerDashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Load data & verify authorization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.role === 'owner' || currentUser.email === 'owner@arca.com') {
          setIsAuthorized(true);

          // Load rooms
          const storedRooms = localStorage.getItem('hotel_rooms');
          let parsed = [];
          try {
            parsed = storedRooms ? JSON.parse(storedRooms) : [];
          } catch (e) {}

          const hasStandard = parsed.some(r => r.name === 'Standard Room');
          const hasDeluxe = parsed.some(r => r.name === 'Deluxe Room');

          if (!storedRooms || parsed.length === 0 || !hasStandard || hasDeluxe) {
            localStorage.setItem('hotel_rooms', JSON.stringify(DEFAULT_ROOMS));
            setRooms(DEFAULT_ROOMS);
          } else {
            setRooms(parsed);
          }

          // Load bookings
          const storedBookings = localStorage.getItem('hotel_bookings');
          if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
          }
        }
      }
      setCheckingAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/owner/login';
  };

  const handlePriceChange = (roomId, newPrice) => {
    const updated = rooms.map(r => r.id === roomId ? { ...r, price: Number(newPrice) } : r);
    setRooms(updated);
  };

  const handleSavePrices = () => {
    localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
    showToast('Harga kamar berhasil diperbarui dan disimpan!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleMarkAsPaid = (bookingCode) => {
    const updatedBookings = bookings.map(b => {
      if (b.bookingCode === bookingCode) {
        let rev = b.totalRevenue;
        if (!rev || rev === 0) {
          const room = rooms.find(r => r.name === b.roomType);
          const price = room ? room.price : (b.roomType === 'VIP Suite' ? 250000 : 150000);
          rev = price * (b.nights || 1);
        }
        return {
          ...b,
          paymentStatus: 'Paid',
          totalRevenue: rev,
          paidAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updatedBookings);
    localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));
    showToast(`Booking ${bookingCode} berhasil ditandai Lunas!`);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleCancelBooking = (bookingCode) => {
    if (window.confirm(`Apakah Anda yakin ingin membatalkan booking ${bookingCode}?`)) {
      const updatedBookings = bookings.filter(b => b.bookingCode !== bookingCode);
      setBookings(updatedBookings);
      localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));
      showToast(`Booking ${bookingCode} telah dibatalkan.`);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  // Format Mata Uang IDR
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Hitung total revenue dari booking yang sudah dibayar (Lunas)
  const paidBookings = bookings.filter(b => b.paymentStatus === 'Paid');
  const totalRevenue = paidBookings.reduce((sum, booking) => sum + (booking.totalRevenue || 0), 0);
  const awaitingCount = bookings.filter(b => b.paymentStatus === 'Awaiting Payment').length;
  const paidCount = bookings.filter(b => b.paymentStatus === 'Paid').length;
  const payHotelCount = bookings.filter(b => b.paymentStatus === 'Pay at Hotel').length;

  if (checkingAuth) {
    return (
      <div className="auth-loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', backgroundColor: '#fafaf9' }}>
        <p>Memverifikasi otorisasi...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <FaLock className="lock-icon" />
          <h2>Akses Ditolak (Access Denied)</h2>
          <p>Anda harus masuk sebagai <strong>Owner</strong> untuk mengakses portal analitik ini.</p>
          <div className="denied-actions">
            <Link href="/owner/login" className="btn-gold">Login Sebagai Owner</Link>
            <Link href="/" className="back-link">Kembali ke Halaman Utama</Link>
          </div>
        </div>
        <style jsx>{`
          .access-denied-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f7f6f5;
            padding: 20px;
            font-family: 'Inter', sans-serif;
          }
          .access-denied-card {
            background-color: #ffffff;
            max-width: 450px;
            width: 100%;
            padding: 40px;
            border-radius: var(--radius-md);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            text-align: center;
            border: 1px solid #eaeaea;
          }
          .lock-icon {
            font-size: 3rem;
            color: #f56c6c;
            margin-bottom: 20px;
          }
          .access-denied-card h2 {
            font-family: var(--font-title);
            color: var(--color-blue-deep);
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .access-denied-card p {
            color: var(--color-text-light);
            font-size: 0.95rem;
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .denied-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }
          .btn-gold {
            background-color: var(--color-gold);
            color: #ffffff;
            padding: 12px 30px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            border-radius: var(--radius-sm);
          }
          .back-link {
            font-size: 0.9rem;
            color: var(--color-text-light);
            font-weight: 500;
          }
          .back-link:hover {
            color: var(--color-gold);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-brand">
          <Link href="/" className="back-link-home">
            <FaArrowLeft /> Kembali ke Website
          </Link>
          <div className="brand-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <img src="/assets/logo.png" alt="Hotel Arca Logo" style={{ height: '40px', width: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1', textAlign: 'left' }}>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '0.55rem', fontWeight: '400', color: 'var(--color-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>Hotel</span>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: '700', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>Arca</span>
            </div>
            <span style={{ height: '25px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></span>
            <span style={{ color: 'var(--color-gold)', fontSize: '1rem', fontWeight: '500', fontFamily: 'var(--font-title)' }}>Portal Keuangan & Analitik Owner</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <FaSignOutAlt /> Log Out
        </button>
      </header>

      <main className="dashboard-main">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast-notification">
            <FaCheckCircle className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Revenue Card Summary */}
        <div className="revenue-summary-card">
          <div className="revenue-icon-box">
            <FaMoneyBillWave />
          </div>
          <div className="revenue-text-box">
            <h2>Total Pendapatan Terkonfirmasi</h2>
            <p className="revenue-val">{formatIDR(totalRevenue)}</p>
            <p className="revenue-sub">Dihitung dari pemesanan dengan status Lunas dan Bayar di Hotel.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#67c23a', background: 'rgba(103,194,58,0.15)', padding: '3px 10px', borderRadius: '12px' }}>✓ Lunas: {paidCount}</span>
              <span style={{ fontSize: '0.78rem', color: '#e6a23c', background: 'rgba(230,162,60,0.15)', padding: '3px 10px', borderRadius: '12px' }}>⏳ Bayar di Hotel: {payHotelCount}</span>
              <span style={{ fontSize: '0.78rem', color: '#f56c6c', background: 'rgba(245,108,108,0.15)', padding: '3px 10px', borderRadius: '12px' }}>⚠ Belum Bayar: {awaitingCount}</span>
            </div>
          </div>
        </div>

        {/* Flex Layout: Left for Room Pricing, Right for Bookings list */}
        <div className="owner-grid">
          <div className="owner-col-left">
            <div className="dashboard-card">
              <h2>Kelola Harga Kamar</h2>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Ubah harga per malam tipe kamar di bawah. Perubahan akan langsung disinkronkan ke halaman pemesanan customer.
              </p>
              
              <div className="price-inputs-list">
                {rooms.map(room => (
                  <div key={room.id} className="price-input-row">
                    <div className="room-info-cell">
                      <strong>{room.name}</strong>
                      <span>{formatIDR(room.price)} / malam saat ini</span>
                    </div>
                    <div className="input-group-cell">
                      <span className="currency-prefix">Rp</span>
                      <input 
                        type="number" 
                        value={room.price}
                        onChange={(e) => handlePriceChange(room.id, e.target.value)}
                        className="price-input-field"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleSavePrices} className="btn-gold save-btn">
                <FaSave /> Simpan Perubahan Harga
              </button>
            </div>
          </div>

          <div className="owner-col-right">
            <div className="dashboard-card">
              <h2>Aktivitas Pemesanan Terkini</h2>
              {bookings.length === 0 ? (
                <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '20px 0' }}>Belum ada booking masuk.</p>
              ) : (
                <div className="bookings-summary-list">
                  {bookings.map((booking, idx) => (
                    <div key={idx} className="booking-summary-item">
                      <div className="booking-item-header">
                        <strong>{booking.bookingCode || ('ARC-' + Math.floor(100000 + Math.random()*900000))}</strong>
                        <span className="booking-item-revenue">{formatIDR(booking.totalRevenue || 0)}</span>
                      </div>
                      <div className="booking-item-body">
                        <p>Tamu: {booking.guestName}</p>
                        <p>{booking.roomType} • {booking.nights} Malam</p>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: booking.paymentStatus === 'Paid' ? '#f0f9eb' : booking.paymentStatus === 'Pay at Hotel' ? '#fdf6ec' : '#fef0f0',
                              color: booking.paymentStatus === 'Paid' ? '#67c23a' : booking.paymentStatus === 'Pay at Hotel' ? '#e6a23c' : '#f56c6c',
                              border: `1px solid ${booking.paymentStatus === 'Paid' ? '#c2e7b0' : booking.paymentStatus === 'Pay at Hotel' ? '#f5dab1' : '#fde2e2'}`
                            }}>
                              {booking.paymentStatus === 'Paid' ? '✓ Lunas' : booking.paymentStatus === 'Pay at Hotel' ? '⏳ Bayar di Hotel' : '⚠ Belum Bayar'}
                            </span>
                            {booking.paymentMethod && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', marginLeft: '6px' }}>{booking.paymentMethod}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {booking.paymentStatus !== 'Paid' && (
                              <button 
                                onClick={() => handleMarkAsPaid(booking.bookingCode)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '4px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  color: 'white',
                                  backgroundColor: '#2ecc71',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                              >
                                Lunas
                              </button>
                            )}
                            <button 
                              onClick={() => handleCancelBooking(booking.bookingCode)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '4px 8px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                color: 'white',
                                backgroundColor: '#e74c3c',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                              }}
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background-color: #f7f6f5;
          font-family: 'Inter', sans-serif;
        }

        .dashboard-header {
          background-color: var(--color-blue-deep);
          color: white;
          padding: 20px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-brand h1 {
          font-family: var(--font-title);
          font-size: 1.8rem;
          margin-top: 5px;
        }

        .back-link-home {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .back-link-home:hover {
          color: var(--color-gold);
        }

        .btn-logout {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-logout:hover {
          background-color: #c0392b;
          border-color: #c0392b;
        }

        .dashboard-main {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          position: relative;
        }

        /* Revenue summary card */
        .revenue-summary-card {
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
          color: white;
          padding: 30px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 30px;
          box-shadow: var(--shadow-md);
          margin-bottom: 40px;
        }

        .revenue-icon-box {
          font-size: 3.5rem;
          color: var(--color-gold);
          display: flex;
          align-items: center;
        }

        .revenue-text-box h2 {
          font-family: var(--font-title);
          font-size: 1.4rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          margin-bottom: 8px;
        }

        .revenue-val {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-gold-hover);
          margin-bottom: 8px;
        }

        .revenue-sub {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Layout Grid */
        .owner-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
        }

        @media (max-width: 900px) {
          .owner-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background-color: white;
          padding: 30px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
        }

        .dashboard-card h2 {
          font-family: var(--font-title);
          color: var(--color-blue-deep);
          font-size: 1.5rem;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 12px;
        }

        /* Price inputs */
        .price-inputs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }

        .price-input-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: var(--color-sand-light);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }

        .room-info-cell strong {
          display: block;
          font-size: 1.1rem;
          color: var(--color-blue-deep);
          margin-bottom: 4px;
        }

        .room-info-cell span {
          font-size: 0.85rem;
          color: var(--color-text-light);
        }

        .input-group-cell {
          display: flex;
          align-items: center;
          background-color: white;
          border: 1px solid var(--color-sand-dark);
          border-radius: var(--radius-sm);
          padding: 0 10px;
        }

        .currency-prefix {
          font-weight: 600;
          color: var(--color-text-light);
          font-size: 0.9rem;
        }

        .price-input-field {
          border: none;
          padding: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-dark);
          width: 120px;
          outline: none;
          text-align: right;
        }

        .save-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
        }

        /* Bookings summary */
        .bookings-summary-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .booking-summary-item {
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 15px;
        }

        .booking-summary-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .booking-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .booking-item-header strong {
          color: var(--color-blue-deep);
        }

        .booking-item-revenue {
          color: #67c23a;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .booking-item-body {
          font-size: 0.85rem;
          color: var(--color-text-light);
          line-height: 1.4;
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          top: 30px;
          right: 30px;
          background-color: rgba(10, 45, 66, 0.95);
          backdrop-filter: blur(10px);
          color: #fff;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gold);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 2000;
          animation: slideInRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        }

        .toast-icon {
          color: var(--color-gold);
          font-size: 1.3rem;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
