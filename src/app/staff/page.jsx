"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaBed, 
  FaCalendarAlt, 
  FaCoffee, 
  FaUser,
  FaCheckCircle,
  FaLock,
  FaSignOutAlt,
  FaCheck,
  FaTrash
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

export default function StaffDashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'bookings'

  // Load data & verify authorization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.role === 'staff' || currentUser.email === 'staff@arca.com') {
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
    window.location.href = '/staff/login';
  };

  const [toastMessage, setToastMessage] = useState('');

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
          <p>Anda harus masuk sebagai <strong>Staff</strong> untuk mengakses portal ini.</p>
          <div className="denied-actions">
            <Link href="/staff/login" className="btn-gold">Login Sebagai Staff</Link>
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
            <span style={{ color: 'var(--color-gold)', fontSize: '1rem', fontWeight: '500', fontFamily: 'var(--font-title)' }}>Portal Manajemen Staff</span>
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

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            onClick={() => setActiveTab('rooms')} 
            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <FaBed /> Daftar Kamar (Rooms)
          </button>
          <button 
            onClick={() => setActiveTab('bookings')} 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <FaCalendarAlt /> Daftar Booking (Reservations)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'rooms' ? (
          <div className="dashboard-card">
            <h2>Daftar Status Kamar</h2>
            <div className="rooms-list-grid">
              {rooms.map(room => {
                const activeRoomBookings = bookings.filter(b => b.roomType === room.name);
                const isBooked = activeRoomBookings.length > 0;
                return (
                  <div key={room.id} className="room-status-card">
                    <div className="room-status-img" style={{ backgroundImage: `url(${room.image})` }} />
                    <div className="room-status-info">
                      <h3>{room.name}</h3>
                      <p className="price-label">{formatIDR(room.price)} / malam</p>
                      <p className="desc-label">{room.description}</p>
                      <div className="status-badge-container">
                        <span className={`status-badge ${isBooked ? 'occupied' : 'available'}`}>
                          {isBooked ? 'TERPESAN (OCCUPIED)' : 'TERSEDIA (AVAILABLE)'}
                        </span>
                      </div>
                      {isBooked && (
                        <div className="room-booking-detail">
                          <p><strong>Tamu:</strong> {activeRoomBookings[0].guestName}</p>
                          <p><strong>Tanggal:</strong> {activeRoomBookings[0].checkIn} s/d {activeRoomBookings[0].checkOut}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2>Daftar Booking Masuk</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>Belum ada kamar yang dibooking saat ini.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama Tamu</th>
                      <th>Telepon</th>
                      <th>Domisili</th>
                      <th>Tipe Kamar</th>
                      <th>Check-in & Check-out</th>
                      <th>Durasi</th>
                      <th>Tamu</th>
                      <th>Welcome Drink</th>
                      <th>Pembayaran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => (
                      <tr key={booking.bookingCode || idx}>
                        <td><strong>{booking.bookingCode}</strong></td>
                        <td>{booking.guestName}</td>
                        <td>{booking.phoneNumber || '-'}</td>
                        <td>{booking.domicile || '-'}</td>
                        <td><span className="room-tag-table">{booking.roomType}</span></td>
                        <td className="table-date-cell">
                          <div>In: {booking.checkIn}</div>
                          <div>Out: {booking.checkOut}</div>
                        </td>
                        <td>{booking.nights} Malam</td>
                        <td>{booking.guestsCount} Orang</td>
                        <td>
                          <span className="drink-badge">
                            {booking.welcomeDrink}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-badge ${booking.paymentStatus === 'Paid' ? 'paid' : booking.paymentStatus === 'Pay at Hotel' ? 'pay-hotel' : 'awaiting'}`}>
                            {booking.paymentStatus === 'Paid' ? '✓ Lunas' : booking.paymentStatus === 'Pay at Hotel' ? '⏳ Bayar di Hotel' : '⚠ Belum Bayar'}
                          </span>
                          {booking.paymentMethod && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '3px' }}>
                              {booking.paymentMethod}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {booking.paymentStatus !== 'Paid' && (
                              <button 
                                onClick={() => handleMarkAsPaid(booking.bookingCode)}
                                className="btn-action-paid"
                                title="Tandai Lunas"
                              >
                                <FaCheck /> Lunas
                              </button>
                            )}
                            <button 
                              onClick={() => handleCancelBooking(booking.bookingCode)}
                              className="btn-action-cancel"
                              title="Batalkan Booking"
                            >
                              <FaTrash /> Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
        }

        .dashboard-tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .tab-btn {
          background-color: white;
          border: 1px solid var(--color-border);
          padding: 12px 24px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-light);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover {
          border-color: var(--color-gold);
          color: var(--color-blue-deep);
        }

        .tab-btn.active {
          background-color: var(--color-gold);
          color: white;
          border-color: var(--color-gold);
        }

        .dashboard-card {
          background-color: white;
          padding: 30px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          margin-bottom: 30px;
        }

        .dashboard-card h2 {
          font-family: var(--font-title);
          color: var(--color-blue-deep);
          font-size: 1.5rem;
          margin-bottom: 25px;
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 12px;
        }

        .rooms-list-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .room-status-card {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .room-status-card {
            flex-direction: column;
          }
          .room-status-img {
            width: 100% !important;
            height: 200px;
          }
        }

        .room-status-img {
          width: 280px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .room-status-info {
          padding: 20px;
          flex-grow: 1;
        }

        .room-status-info h3 {
          font-family: var(--font-title);
          font-size: 1.3rem;
          color: var(--color-blue-deep);
          margin-bottom: 6px;
        }

        .price-label {
          color: var(--color-gold-hover);
          font-weight: 700;
          margin-bottom: 12px;
          font-size: 1.05rem;
        }

        .desc-label {
          font-size: 0.9rem;
          color: var(--color-text-light);
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .status-badge-container {
          margin-bottom: 15px;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .status-badge.available {
          background-color: #f0f9eb;
          color: #67c23a;
          border: 1px solid #c2e7b0;
        }

        .status-badge.occupied {
          background-color: #fef0f0;
          color: #f56c6c;
          border: 1px solid #fde2e2;
        }

        .room-booking-detail {
          background-color: var(--color-sand-light);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          color: var(--color-text-dark);
          margin-top: 10px;
        }

        .room-booking-detail p {
          margin-bottom: 4px;
        }

        .room-booking-detail p:last-child {
          margin-bottom: 0;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .bookings-table th, .bookings-table td {
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .bookings-table th {
          font-weight: 600;
          color: var(--color-blue-deep);
          background-color: var(--color-blue-light);
        }

        .room-tag-table {
          background-color: var(--color-gold-light);
          color: var(--color-gold-hover);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .table-date-cell {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .drink-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #fdf6ec;
          color: #e6a23c;
          border: 1px solid #f5dab1;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-label-confirmed {
          color: #67c23a;
          font-weight: 600;
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: var(--color-text-light);
          background-color: var(--color-sand-light);
          border-radius: var(--radius-sm);
          border: 1px dashed var(--color-border);
        }

        .payment-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .payment-badge.paid {
          background-color: #f0f9eb;
          color: #67c23a;
          border: 1px solid #c2e7b0;
        }

        .payment-badge.pay-hotel {
          background-color: #fdf6ec;
          color: #e6a23c;
          border: 1px solid #f5dab1;
        }

        .payment-badge.awaiting {
          background-color: #fef0f0;
          color: #f56c6c;
          border: 1px solid #fde2e2;
        }

        /* Action Buttons */
        .btn-action-paid {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 2px 6px rgba(46, 204, 113, 0.15);
        }

        .btn-action-paid:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
          filter: brightness(1.05);
        }

        .btn-action-cancel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 2px 6px rgba(231, 76, 60, 0.15);
        }

        .btn-action-cancel:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
          filter: brightness(1.05);
        }

        /* Toast styles */
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
