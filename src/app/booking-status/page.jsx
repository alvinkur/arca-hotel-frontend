"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaTicketAlt, FaSearch, FaCheckCircle, FaExclamationCircle, 
  FaHourglassHalf, FaBed, FaCalendarAlt, FaDoorOpen, FaUser, FaBuilding, FaPhone
} from 'react-icons/fa';

export default function BookingStatusPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a2540 0%, #061924 100%)', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <p>Memuat status pemesanan...</p>
      </div>
    }>
      <BookingStatusContent />
    </Suspense>
  );
}

function BookingStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [booking, setBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  // Load bookings and user session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load current user
    const userStr = localStorage.getItem('currentUser');
    let loggedInUser = null;
    if (userStr) {
      loggedInUser = JSON.parse(userStr);
      setCurrentUser(loggedInUser);
    }

    // Load bookings
    const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
    
    // Filter bookings belonging to the user
    if (loggedInUser) {
      const userBookings = bookings.filter(b => 
        (b.email && b.email.toLowerCase() === loggedInUser.email.toLowerCase()) ||
        (b.phoneNumber && b.phoneNumber.replace(/[\s+\-]/g, '') === (loggedInUser.phoneNumber || '').replace(/[\s+\-]/g, '')) ||
        (b.guestName && b.guestName.toLowerCase() === loggedInUser.name.toLowerCase())
      );
      setMyBookings(userBookings);
    }

    // If query string contains code, look it up immediately
    if (initialCode) {
      const found = bookings.find(b => b.bookingCode.toUpperCase() === initialCode.toUpperCase());
      if (found) {
        setBooking(found);
        setErrorMsg('');
      } else {
        setErrorMsg('Pemesanan dengan kode tersebut tidak ditemukan.');
      }
    }
  }, [initialCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setBooking(null);

    if (!searchCode.trim()) {
      setErrorMsg('Masukkan kode booking terlebih dahulu.');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
    const found = bookings.find(b => b.bookingCode.toUpperCase() === searchCode.trim().toUpperCase());
    
    if (found) {
      setBooking(found);
      router.replace(`/booking-status?code=${found.bookingCode}`);
    } else {
      setErrorMsg('Pemesanan dengan kode tersebut tidak ditemukan. Periksa kembali penulisan kode Anda.');
    }
  };

  const selectMyBooking = (code) => {
    setSearchCode(code);
    const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
    const found = bookings.find(b => b.bookingCode === code);
    if (found) {
      setBooking(found);
      router.replace(`/booking-status?code=${code}`);
      setErrorMsg('');
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return '-';
    }
  };

  // Determine check-in readiness status message and styling
  const getReadinessStatus = (b) => {
    if (!b) return null;

    if (b.paymentStatus === 'Paid') {
      return {
        allowed: true,
        title: 'Bisa Masuk Hotel (Dipersilakan Check-in)',
        description: 'Pembayaran Anda telah kami terima dan diverifikasi. Silakan tunjukkan kode booking ini ke resepsionis pada saat kedatangan untuk mengambil kunci kamar.',
        class: 'readiness-green',
        icon: <FaCheckCircle className="status-icon" />
      };
    } else if (b.paymentStatus === 'Pay at Hotel') {
      return {
        allowed: true,
        title: 'Reservasi Aktif (Bayar Saat Check-in)',
        description: 'Reservasi Anda terdaftar dengan metode Bayar di Hotel (Cash). Silakan lakukan pembayaran di resepsionis setibanya di hotel untuk mengambil kunci kamar dan masuk.',
        class: 'readiness-orange',
        icon: <FaHourglassHalf className="status-icon" />
      };
    } else if (b.paymentStatus === 'Awaiting Confirmation') {
      return {
        allowed: false,
        title: 'Menunggu Konfirmasi Pembayaran',
        description: 'Bukti transfer Anda sedang dalam proses verifikasi oleh Owner. Harap tunggu konfirmasi sebelum Anda diperbolehkan masuk kamar/check-in.',
        class: 'readiness-blue',
        icon: <FaHourglassHalf className="status-icon animate-pulse" />
      };
    } else if (b.paymentStatus === 'Cancelled') {
      return {
        allowed: false,
        title: 'Reservasi Dibatalkan',
        description: 'Pemesanan kamar ini telah dibatalkan. Silakan hubungi layanan bantuan Hotel Arca jika Anda merasa ini merupakan kesalahan.',
        class: 'readiness-red',
        icon: <FaExclamationCircle className="status-icon" />
      };
    } else {
      return {
        allowed: false,
        title: 'Menunggu Pembayaran',
        description: 'Anda belum menyelesaikan pembayaran untuk reservasi ini. Silakan lakukan pembayaran terlebih dahulu agar Anda diperbolehkan check-in dan masuk hotel.',
        class: 'readiness-red',
        icon: <FaExclamationCircle className="status-icon" />
      };
    }
  };

  const statusInfo = getReadinessStatus(booking);

  return (
    <div className="status-page">
      <div className="status-container">
        
        {/* Back Link */}
        <Link href="/" className="back-link">
          <FaArrowLeft /> Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="status-header">
          <FaTicketAlt className="header-ticket" />
          <h1>Cek Status Reservasi & Pembayaran</h1>
          <p>Masukkan kode booking Anda untuk melihat status pembayaran dan kelayakan masuk hotel.</p>
        </div>

        {/* Search Box */}
        <div className="card-custom search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <FaSearch className="search-input-icon" />
              <input 
                type="text" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Contoh: ARC-123456"
                required
              />
            </div>
            <button type="submit" className="btn-gold search-btn">Cek Status</button>
          </form>
          {errorMsg && <div className="error-alert"><FaExclamationCircle /> {errorMsg}</div>}
        </div>

        {/* Search Result */}
        {booking && (
          <div className="fade-in">
            {/* Readiness Banner */}
            <div className={`readiness-banner ${statusInfo.class}`}>
              {statusInfo.icon}
              <div className="readiness-text">
                <h3>{statusInfo.title}</h3>
                <p>{statusInfo.description}</p>
              </div>
            </div>

            {/* Receipt Grid */}
            <div className="receipt-grid">
              
              {/* Left Column: Booking Info */}
              <div className="card-custom receipt-details">
                <h2>Rincian Reservasi</h2>
                <div className="receipt-divider"></div>
                
                <div className="info-row">
                  <div className="info-label"><FaTicketAlt /> Kode Booking</div>
                  <div className="info-value font-mono highlight-gold">{booking.bookingCode}</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaUser /> Nama Tamu</div>
                  <div className="info-value">{booking.guestName}</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaPhone /> Nomor HP</div>
                  <div className="info-value">{booking.phoneNumber || '-'}</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaCalendarAlt /> Check-in</div>
                  <div className="info-value">{formatDate(booking.checkIn)}</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaCalendarAlt /> Check-out</div>
                  <div className="info-value">{formatDate(booking.checkOut)}</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaBuilding /> Durasi Menginap</div>
                  <div className="info-value">{booking.nights} Malam</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaUser /> Kapasitas</div>
                  <div className="info-value">{booking.guestsCount} Orang</div>
                </div>

                <div className="info-row">
                  <div className="info-label"><FaDoorOpen /> Tipe Kamar</div>
                  <div className="info-value font-weight-bold">{booking.roomType}</div>
                </div>

                {booking.roomNumber && (
                  <div className="info-row">
                    <div className="info-label"><FaDoorOpen /> Nomor Kamar</div>
                    <div className="info-value font-mono room-num-badge">Kamar {booking.roomNumber}</div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Details */}
              <div className="card-custom receipt-payment">
                <h2>Informasi Pembayaran</h2>
                <div className="receipt-divider"></div>

                <div className="payment-status-box">
                  <span className="p-label">Status Pembayaran</span>
                  <span className={`p-pill ${booking.paymentStatus === 'Paid' ? 'p-green' : booking.paymentStatus === 'Pay at Hotel' ? 'p-orange' : booking.paymentStatus === 'Awaiting Confirmation' ? 'p-blue' : 'p-red'}`}>
                    {booking.paymentStatus === 'Paid' ? 'Lunas / Diterima' : booking.paymentStatus === 'Pay at Hotel' ? 'Bayar Saat Check-in' : booking.paymentStatus === 'Awaiting Confirmation' ? 'Menunggu Verifikasi' : 'Belum Bayar'}
                  </span>
                </div>

                <div className="receipt-bill">
                  <div className="bill-row">
                    <span>Tipe Kamar</span>
                    <span>{booking.roomType}</span>
                  </div>
                  <div className="bill-row">
                    <span>Durasi</span>
                    <span>{booking.nights} Malam</span>
                  </div>
                  <div className="bill-row">
                    <span>Metode Pembayaran</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{booking.paymentMethod || 'Belum Ditentukan'}</span>
                  </div>
                  {booking.confirmedBy && (
                    <div className="bill-row">
                      <span>Dikonfirmasi Oleh</span>
                      <span className="text-uppercase" style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.confirmedBy}</span>
                    </div>
                  )}
                  <div className="bill-divider"></div>
                  <div className="bill-row bill-total">
                    <span>Total Tagihan</span>
                    <span>{formatIDR(booking.totalRevenue)}</span>
                  </div>
                </div>

                {booking.paymentStatus === 'Awaiting Payment' && (
                  <div style={{ marginTop: '20px' }}>
                    <Link href={`/payment?code=${booking.bookingCode}`} className="btn-gold block-btn">
                      Selesaikan Pembayaran Sekarang
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* User's Bookings list (if logged in) */}
        {currentUser && myBookings.length > 0 && (
          <div className="card-custom list-card">
            <h2>Daftar Reservasi Anda</h2>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Ditemukan {myBookings.length} reservasi terhubung dengan nama/akun Anda.
            </p>
            <div className="table-responsive">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Kode Booking</th>
                    <th>Tipe Kamar</th>
                    <th>No. Kamar</th>
                    <th>Tanggal Menginap</th>
                    <th>Status Pembayaran</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b.bookingCode}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--color-blue-deep)' }}>{b.bookingCode}</td>
                      <td>{b.roomType}</td>
                      <td className="font-mono">{b.roomNumber || '-'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{b.checkIn} s/d {b.checkOut}</td>
                      <td>
                        <span className={`pill-status ${b.paymentStatus === 'Paid' ? 'pill-green' : b.paymentStatus === 'Pay at Hotel' ? 'pill-orange' : b.paymentStatus === 'Awaiting Confirmation' ? 'pill-blue' : 'pill-red'}`}>
                          {b.paymentStatus === 'Paid' ? 'Lunas' : b.paymentStatus === 'Pay at Hotel' ? 'Bayar Hotel' : b.paymentStatus === 'Awaiting Confirmation' ? 'Diverifikasi' : 'Belum Bayar'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => selectMyBooking(b.bookingCode)} className="btn-table">
                          Pilih & Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .status-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-blue-deep, #0a2540) 0%, #051421 100%);
          padding: 60px 20px;
          font-family: 'Inter', sans-serif;
          color: var(--color-text-dark, #333333);
        }

        .status-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 32px;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          color: var(--color-gold, #c8a45a);
          transform: translateX(-3px);
        }

        .status-header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .header-ticket {
          font-size: 3rem;
          color: var(--color-gold, #c8a45a);
          margin-bottom: 12px;
          filter: drop-shadow(0 2px 10px rgba(200, 164, 90, 0.3));
        }

        .status-header h1 {
          font-family: var(--font-title, "Playfair Display", serif);
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .status-header p {
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.95rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .card-custom {
          background: white;
          border-radius: var(--radius-md, 12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          padding: 24px;
          margin-bottom: 24px;
        }

        /* Search Card */
        .search-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .search-form {
          display: flex;
          gap: 12px;
        }

        .input-group {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          color: #888888;
        }

        .input-group input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .input-group input:focus {
          border-color: var(--color-gold, #c8a45a);
          box-shadow: 0 0 0 3px rgba(200, 164, 90, 0.15);
        }

        .search-btn {
          padding: 0 30px;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 8px;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e74c3c;
          font-size: 0.85rem;
          margin-top: 12px;
          font-weight: 500;
        }

        /* Readiness Banner */
        .readiness-banner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          color: white;
          animation: slideDown 0.3s ease;
        }

        .readiness-banner :global(.status-icon) {
          font-size: 2.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .readiness-green {
          background: linear-gradient(135deg, #1e7e34 0%, #155724 100%);
          border: 1px solid #c3e6cb;
          box-shadow: 0 6px 15px rgba(21, 87, 36, 0.25);
        }

        .readiness-orange {
          background: linear-gradient(135deg, #d39e00 0%, #b8860b 100%);
          border: 1px solid #ffeeba;
          box-shadow: 0 6px 15px rgba(184, 134, 11, 0.25);
        }

        .readiness-blue {
          background: linear-gradient(135deg, #1d6a8a 0%, #0d3b4f 100%);
          border: 1px solid #bee5eb;
          box-shadow: 0 6px 15px rgba(13, 59, 79, 0.25);
        }

        .readiness-red {
          background: linear-gradient(135deg, #bd2130 0%, #721c24 100%);
          border: 1px solid #f5c6cb;
          box-shadow: 0 6px 15px rgba(114, 28, 36, 0.25);
        }

        .readiness-text h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .readiness-text p {
          font-size: 0.88rem;
          opacity: 0.9;
          line-height: 1.4;
          margin: 0;
        }

        /* Receipt Grid */
        .receipt-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .receipt-details h2, .receipt-payment h2, .list-card h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-blue-deep, #0a2540);
          margin-bottom: 12px;
        }

        .receipt-divider {
          height: 2px;
          background: #f1ebd9;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f4f4f4;
          font-size: 0.9rem;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666666;
          font-weight: 500;
        }

        .info-value {
          font-weight: 600;
          color: #1a1a1a;
          text-align: right;
        }

        .highlight-gold {
          color: #b48a32;
          font-weight: 800;
        }

        .room-num-badge {
          background: #fdf8ed;
          border: 1px solid #f5e6c0;
          color: var(--color-gold-hover, #b48a32);
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Payment side card */
        .payment-status-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #faf8f5;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #f1ebd9;
          margin-bottom: 20px;
          text-align: center;
        }

        .p-label {
          font-size: 0.72rem;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .p-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .p-green { background: #e2f0d9; color: #385723; }
        .p-orange { background: #fff2cc; color: #7f6000; }
        .p-blue { background: #ddebf7; color: #1f4e79; }
        .p-red { background: #fce4d6; color: #c65911; }

        .receipt-bill {
          background: #fafafa;
          border: 1px dashed #dcdcdc;
          border-radius: 8px;
          padding: 16px;
        }

        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #555555;
          margin-bottom: 8px;
        }

        .bill-divider {
          height: 1px;
          background: #dcdcdc;
          margin: 12px 0;
        }

        .bill-total {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-blue-deep, #0a2540);
          margin-bottom: 0;
        }

        .block-btn {
          display: block;
          text-align: center;
          padding: 14px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        /* List card */
        .list-card {
          margin-top: 24px;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .bookings-table th {
          background: #faf8f5;
          padding: 12px;
          font-weight: 600;
          border-bottom: 2px solid #f1ebd9;
          color: #555555;
        }

        .bookings-table td {
          padding: 12px;
          border-bottom: 1px solid #f4f4f4;
          vertical-align: middle;
        }

        .bookings-table tr:hover td {
          background: #fcfbf9;
        }

        .pill-status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .pill-green { background: #e2f0d9; color: #385723; }
        .pill-orange { background: #fff2cc; color: #7f6000; }
        .pill-blue { background: #ddebf7; color: #1f4e79; }
        .pill-red { background: #fce4d6; color: #c65911; }

        .btn-table {
          background: var(--color-blue-deep, #0a2540);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.78rem;
          transition: all 0.2s;
        }

        .btn-table:hover {
          background: var(--color-gold, #c8a45a);
          color: white;
        }

        .fade-in {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        @media (max-width: 768px) {
          .receipt-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .search-form {
            flex-direction: column;
          }
          
          .search-btn {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
