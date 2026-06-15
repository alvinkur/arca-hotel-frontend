"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCreditCard, FaUniversity, FaHotel, FaCheckCircle, FaMoneyBillWave, FaCopy, FaTicketAlt } from 'react-icons/fa';

const BANK_OPTIONS = [
  { id: 'bca', name: 'Bank BCA', account: '123-456-7890', holder: 'PT Hotel Arca Indonesia' },
  { id: 'bni', name: 'Bank BNI', account: '098-765-4321', holder: 'PT Hotel Arca Indonesia' },
  { id: 'mandiri', name: 'Bank Mandiri', account: '112-233-4455', holder: 'PT Hotel Arca Indonesia' },
];

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a2540 0%, #061924 100%)', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <p>Memuat halaman pembayaran...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get('code');

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'bank' or 'hotel'
  const [selectedBank, setSelectedBank] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && bookingCode) {
      const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
      const found = bookings.find(b => b.bookingCode === bookingCode);
      if (found) {
        setBooking(found);
        // Calculate total price — look up by roomNumber first, then by roomType
        const rooms = JSON.parse(localStorage.getItem('hotel_rooms') || '[]');
        const room = (found.roomNumber && rooms.find(r => r.roomNumber === found.roomNumber)) ||
                     rooms.find(r => r.name === found.roomType);
        const pricePerNight = room ? room.price
          : found.roomType === 'VIP Suite' ? 350000
          : found.roomType === 'Standard Room' ? 200000
          : 150000;
        const calcTotal = pricePerNight * (found.nights || 1);
        // Use totalRevenue if already set correctly, else recalculate
        setTotalPrice(found.totalRevenue && found.totalRevenue > 0 ? found.totalRevenue : calcTotal);
      }
    }
  }, [bookingCode]);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) return;
    if (paymentMethod === 'bank' && !selectedBank) return;

    const bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
    const updatedBookings = bookings.map(b => {
      if (b.bookingCode === bookingCode) {
        return {
          ...b,
          paymentMethod: paymentMethod === 'bank' ? `Transfer Bank (${BANK_OPTIONS.find(bo => bo.id === selectedBank)?.name || 'Bank'})` : 'Bayar di Hotel',
          paymentStatus: paymentMethod === 'bank' ? 'Awaiting Confirmation' : 'Pay at Hotel',
          totalRevenue: totalPrice,
          paidAt: new Date().toISOString()
        };
      }
      return b;
    });
    localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));
    setIsConfirmed(true);
  };

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="payment-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <FaCreditCard size={50} style={{ color: 'var(--color-gold)', marginBottom: '16px' }} />
          <h2>Booking Tidak Ditemukan</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '24px' }}>Kode booking tidak valid atau sudah kadaluarsa.</p>
          <Link href="/" className="btn-gold" style={{ display: 'inline-block', padding: '12px 30px' }}>Kembali ke Beranda</Link>
        </div>
        <style jsx>{`
          .payment-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
            padding: 20px;
            font-family: 'Inter', sans-serif;
          }
          .payment-card {
            background: white;
            max-width: 600px;
            width: 100%;
            border-radius: var(--radius-md);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          }
          .payment-card h2 {
            font-family: var(--font-title);
            color: var(--color-blue-deep);
            font-size: 1.5rem;
          }
        `}</style>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="payment-page">
        <div className="payment-card" style={{ textAlign: 'center', padding: '50px 40px' }}>
          <FaCheckCircle size={60} style={{ color: '#67c23a', marginBottom: '16px' }} />
          <h2>Pembayaran Berhasil Dikonfirmasi!</h2>
          <p className="success-sub">Terima kasih, <strong>{booking.guestName}</strong>.</p>

          {/* Booking Code Prominent Badge */}
          <div className="booking-code-badge">
            <FaTicketAlt className="ticket-icon" />
            <div>
              <span className="code-label">Kode Booking Anda</span>
              <span className="code-value">{booking.bookingCode}</span>
            </div>
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span>Tipe Kamar</span>
              <strong>{booking.roomType}</strong>
            </div>
            <div className="summary-row">
              <span>Check-in</span>
              <strong>{booking.checkIn}</strong>
            </div>
            <div className="summary-row">
              <span>Check-out</span>
              <strong>{booking.checkOut}</strong>
            </div>
            <div className="summary-row">
              <span>Durasi</span>
              <strong>{booking.nights} Malam</strong>
            </div>
            <div className="summary-row">
              <span>Total Pembayaran</span>
              <strong style={{ color: 'var(--color-gold-hover)' }}>{formatIDR(totalPrice)}</strong>
            </div>
            <div className="summary-row">
              <span>Metode Pembayaran</span>
              <strong>{paymentMethod === 'bank' ? `Transfer Bank (${BANK_OPTIONS.find(b => b.id === selectedBank)?.name})` : 'Bayar di Hotel'}</strong>
            </div>
            <div className="summary-row">
              <span>Status</span>
              <strong style={{ color: paymentMethod === 'bank' ? '#e6a23c' : '#e6a23c' }}>
                {paymentMethod === 'bank' ? '⏳ Menunggu Konfirmasi Owner' : '⏳ Bayar Saat Check-in'}
              </strong>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '24px' }}>
            {paymentMethod === 'bank' 
              ? 'Bukti transfer Anda sedang diverifikasi oleh owner. Silakan tunjukkan kode booking saat check-in.'
              : 'Silakan lakukan pembayaran di resepsionis saat check-in. Tunjukkan kode booking Anda.'}
          </p>
          
          <Link href="/" className="btn-gold" style={{ display: 'inline-block', padding: '14px 36px', fontSize: '0.95rem' }}>
            Kembali ke Beranda
          </Link>
        </div>

        <style jsx>{`
          .payment-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
            padding: 20px;
            font-family: 'Inter', sans-serif;
          }
          .payment-card {
            background: white;
            max-width: 560px;
            width: 100%;
            border-radius: var(--radius-md);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          }
          .payment-card h2 {
            font-family: var(--font-title);
            color: var(--color-blue-deep);
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
          .success-sub {
            color: var(--color-text-light);
            margin-bottom: 20px;
            font-size: 0.95rem;
          }
          .booking-code-badge {
            display: inline-flex;
            align-items: center;
            gap: 14px;
            background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
            color: white;
            padding: 16px 28px;
            border-radius: var(--radius-md);
            margin-bottom: 24px;
            border: 2px solid var(--color-gold);
            box-shadow: 0 4px 20px rgba(197, 160, 89, 0.25);
          }
          .ticket-icon {
            font-size: 1.8rem;
            color: var(--color-gold);
          }
          .code-label {
            display: block;
            font-size: 0.7rem;
            color: rgba(255,255,255,0.6);
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .code-value {
            display: block;
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--color-gold);
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
          }
          .summary-box {
            background: var(--color-sand-light);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            padding: 20px;
            margin-bottom: 20px;
            text-align: left;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid var(--color-border);
            font-size: 0.9rem;
          }
          .summary-row:last-child {
            border-bottom: none;
          }
          .summary-row span {
            color: var(--color-text-light);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        {/* Header */}
        <Link href="/" className="back-btn">
          <FaArrowLeft /> Kembali
        </Link>

        <div className="payment-header">
          <FaCreditCard className="header-icon" />
          <h2>Pembayaran Reservasi</h2>
          <p>Selesaikan pembayaran untuk menyelesaikan reservasi Anda</p>
        </div>

        {/* Booking Code Prominent Banner */}
        <div className="booking-code-banner">
          <FaTicketAlt className="banner-ticket-icon" />
          <div className="banner-code-content">
            <span className="banner-label">Kode Booking Anda</span>
            <span className="banner-code">{booking.bookingCode}</span>
          </div>
          <button 
            className="banner-copy-btn"
            onClick={() => handleCopy(booking.bookingCode, 'bookingCode')}
            title="Salin kode booking"
          >
            <FaCopy /> {copiedField === 'bookingCode' ? 'Tersalin!' : 'Salin'}
          </button>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h3>Ringkasan Booking</h3>
          <div className="summary-row">
            <span>Nama Tamu</span>
            <strong>{booking.guestName}</strong>
          </div>
          <div className="summary-row">
            <span>Telepon</span>
            <strong>{booking.phoneNumber || '-'}</strong>
          </div>
          <div className="summary-row">
            <span>Domisili</span>
            <strong>{booking.domicile || '-'}</strong>
          </div>
          <div className="summary-row">
            <span>Tipe Kamar</span>
            <strong>{booking.roomType}</strong>
          </div>
          <div className="summary-row">
            <span>Check-in</span>
            <strong>{booking.checkIn}</strong>
          </div>
          <div className="summary-row">
            <span>Check-out</span>
            <strong>{booking.checkOut}</strong>
          </div>
          <div className="summary-row">
            <span>Durasi</span>
            <strong>{booking.nights} Malam</strong>
          </div>
          <div className="summary-row">
            <span>Jumlah Tamu</span>
            <strong>{booking.guestsCount} Orang</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total Pembayaran</span>
            <strong>{formatIDR(totalPrice)}</strong>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="method-section">
          <h3>Pilih Metode Pembayaran</h3>
          
          <div className="method-options">
            <button 
              className={`method-card ${paymentMethod === 'bank' ? 'selected' : ''}`}
              onClick={() => { setPaymentMethod('bank'); setSelectedBank(''); }}
            >
              <FaUniversity className="method-icon" />
              <div>
                <strong>Transfer Bank</strong>
                <span>BCA, BNI, Mandiri</span>
              </div>
            </button>

            <button 
              className={`method-card ${paymentMethod === 'hotel' ? 'selected' : ''}`}
              onClick={() => { setPaymentMethod('hotel'); setSelectedBank(''); }}
            >
              <FaHotel className="method-icon" />
              <div>
                <strong>Bayar di Hotel</strong>
                <span>Bayar saat check-in</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bank Selection */}
        {paymentMethod === 'bank' && (
          <div className="bank-section">
            <h3>Pilih Bank Tujuan</h3>
            <div className="bank-list">
              {BANK_OPTIONS.map(bank => (
                <div
                  key={bank.id}
                  className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBank(bank.id)}
                >
                  <div className="bank-info">
                    <strong>{bank.name}</strong>
                    <span className="bank-account">{bank.account}</span>
                    <span className="bank-holder">a.n. {bank.holder}</span>
                  </div>
                  <button 
                    className="copy-btn"
                    onClick={(e) => { e.stopPropagation(); handleCopy(bank.account, bank.id); }}
                    title="Salin nomor rekening"
                  >
                    <FaCopy /> {copiedField === bank.id ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pay at Hotel Info */}
        {paymentMethod === 'hotel' && (
          <div className="hotel-pay-info">
            <FaMoneyBillWave className="hotel-pay-icon" />
            <p>Pembayaran akan dilakukan secara langsung di <strong>resepsionis hotel</strong> saat Anda melakukan check-in. Harap siapkan kode booking dan identitas Anda.</p>
          </div>
        )}

        {/* Confirm Button */}
        {paymentMethod && (
          <button 
            className="btn-gold confirm-btn"
            onClick={handleConfirmPayment}
            disabled={paymentMethod === 'bank' && !selectedBank}
          >
            {paymentMethod === 'bank' 
              ? (selectedBank ? 'Konfirmasi Sudah Transfer' : 'Pilih bank terlebih dahulu')
              : 'Konfirmasi Bayar di Hotel'}
          </button>
        )}
      </div>

      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, #061924 100%);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .payment-card {
          background: white;
          max-width: 560px;
          width: 100%;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          padding: 36px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--color-text-light);
          font-weight: 500;
          margin-bottom: 20px;
          transition: var(--transition-smooth);
        }

        .back-btn:hover {
          color: var(--color-gold);
          transform: translateX(-2px);
        }

        .payment-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .header-icon {
          font-size: 2.2rem;
          color: var(--color-gold);
          margin-bottom: 10px;
        }

        .payment-header h2 {
          font-family: var(--font-title);
          color: var(--color-blue-deep);
          font-size: 1.5rem;
          margin-bottom: 6px;
        }

        .payment-header p {
          color: var(--color-text-light);
          font-size: 0.88rem;
        }

        /* Booking Code Banner */
        .booking-code-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, #0d3655 100%);
          border: 2px solid var(--color-gold);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(197, 160, 89, 0.2);
          animation: fadeIn 0.4s ease;
        }

        .banner-ticket-icon {
          font-size: 1.8rem;
          color: var(--color-gold);
          flex-shrink: 0;
        }

        .banner-code-content {
          flex: 1;
          text-align: left;
        }

        .banner-label {
          display: block;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .banner-code {
          display: block;
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-gold);
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
        }

        .banner-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          border: 1px solid rgba(197, 160, 89, 0.4);
          border-radius: var(--radius-sm);
          background: rgba(197, 160, 89, 0.1);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-gold);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .banner-copy-btn:hover {
          background: rgba(197, 160, 89, 0.25);
          border-color: var(--color-gold);
        }

        /* Booking Summary */
        .booking-summary {
          background: var(--color-sand-light);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 20px;
          margin-bottom: 28px;
        }

        .booking-summary h3 {
          font-family: var(--font-title);
          color: var(--color-blue-deep);
          font-size: 1.1rem;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 0;
          font-size: 0.88rem;
        }

        .summary-row span {
          color: var(--color-text-light);
        }

        .summary-row strong {
          color: var(--color-text-dark);
        }

        .total-row {
          margin-top: 10px;
          padding-top: 12px;
          border-top: 2px solid var(--color-gold);
        }

        .total-row strong {
          font-size: 1.15rem;
          color: var(--color-gold-hover);
        }

        /* Method Section */
        .method-section {
          margin-bottom: 24px;
        }

        .method-section h3, .bank-section h3 {
          font-family: var(--font-title);
          color: var(--color-blue-deep);
          font-size: 1.05rem;
          margin-bottom: 14px;
        }

        .method-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .method-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .method-card:hover {
          border-color: var(--color-gold);
        }

        .method-card.selected {
          border-color: var(--color-gold);
          background: var(--color-gold-light, #fdf8ed);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.15);
        }

        .method-icon {
          font-size: 1.5rem;
          color: var(--color-gold);
          flex-shrink: 0;
        }

        .method-card strong {
          display: block;
          font-size: 0.9rem;
          color: var(--color-blue-deep);
          margin-bottom: 2px;
        }

        .method-card span {
          font-size: 0.78rem;
          color: var(--color-text-light);
        }

        /* Bank Section */
        .bank-section {
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }

        .bank-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bank-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .bank-card:hover {
          border-color: var(--color-gold);
        }

        .bank-card.selected {
          border-color: var(--color-gold);
          background: var(--color-gold-light, #fdf8ed);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.15);
        }

        .bank-info {
          display: flex;
          flex-direction: column;
        }

        .bank-info strong {
          font-size: 0.92rem;
          color: var(--color-blue-deep);
          margin-bottom: 3px;
        }

        .bank-account {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-dark);
          letter-spacing: 0.5px;
        }

        .bank-holder {
          font-size: 0.78rem;
          color: var(--color-text-light);
          margin-top: 2px;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: white;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-light);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .copy-btn:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }

        /* Pay at Hotel Info */
        .hotel-pay-info {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px;
          background: #fdf6ec;
          border: 1px solid #f5dab1;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }

        .hotel-pay-icon {
          font-size: 1.6rem;
          color: #e6a23c;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hotel-pay-info p {
          font-size: 0.88rem;
          color: var(--color-text-dark);
          line-height: 1.5;
        }

        /* Confirm Button */
        .confirm-btn {
          width: 100%;
          padding: 15px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 8px;
          animation: fadeIn 0.3s ease;
        }

        .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 500px) {
          .method-options {
            grid-template-columns: 1fr;
          }
          .payment-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
