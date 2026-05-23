import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaCalendarAlt, FaUsers, FaBed, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { submitBooking } from '../services/api';

// Component: BookingForm
export default function BookingForm({ selectedRoom, focusTrigger }) {
  // useState() - Menyimpan data input booking form
  const [formData, setFormData] = useState({
    guestName: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
    roomType: ''
  });

  // useState() - Menyimpan errors hasil validasi input
  const [errors, setErrors] = useState({});

  // useState() - Menyimpan status apakah data booking berhasil disubmit
  const [isSubmitted, setIsSubmitted] = useState(false);

  // useState() - Menyimpan ringkasan booking setelah submit berhasil
  const [bookingSummary, setBookingSummary] = useState(null);

  // useState() - Menyimpan status loading saat memanggil API
  const [isLoading, setIsLoading] = useState(false);

  // useState() - Menyimpan pesan error jika pemesanan gagal
  const [submitError, setSubmitError] = useState('');

  // useRef() - Referensi ke input nama tamu untuk auto-focus saat section dibuka/diakses
  const guestNameInputRef = useRef(null);

  // useEffect() - Mengubah tipe kamar terpilih jika di-klik dari Room Card
  useEffect(() => {
    if (selectedRoom) {
      setFormData(prev => ({ ...prev, roomType: selectedRoom }));
    }
  }, [selectedRoom]);

  // useEffect() - Auto-focus ke input nama tamu ketika focusTrigger berubah (saat tombol 'Book Now' ditekan)
  useEffect(() => {
    if (focusTrigger && guestNameInputRef.current) {
      guestNameInputRef.current.focus();
    }
  }, [focusTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Hapus error untuk input tertentu saat user sedang mengetik
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validasi sederhana form booking
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Nama tamu wajib diisi.';
    } else if (formData.guestName.trim().length < 3) {
      newErrors.guestName = 'Nama minimal terdiri dari 3 karakter.';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Tanggal check-in wajib diisi.';
    } else if (formData.checkIn < todayStr) {
      newErrors.checkIn = 'Tanggal check-in tidak boleh di masa lampau.';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Tanggal check-out wajib diisi.';
    } else if (formData.checkIn && formData.checkOut <= formData.checkIn) {
      newErrors.checkOut = 'Tanggal check-out harus setelah tanggal check-in.';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Silakan pilih tipe kamar.';
    }

    if (!formData.guestsCount || formData.guestsCount < 1) {
      newErrors.guestsCount = 'Jumlah tamu minimal 1 orang.';
    } else if (formData.guestsCount > 10) {
      newErrors.guestsCount = 'Jumlah tamu maksimal 10 orang per kamar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setSubmitError('');

      try {
        // Melakukan request HTTPS POST dengan Axios ke server/API mockup
        await submitBooking(formData);

        // Menghitung jumlah malam menginap
        const date1 = new Date(formData.checkIn);
        const date2 = new Date(formData.checkOut);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setBookingSummary({
          ...formData,
          nights: diffDays,
          bookingCode: 'ARC-' + Math.floor(100000 + Math.random() * 900000)
        });
        setIsSubmitted(true);
      } catch (err) {
        setSubmitError('Gagal mengirim pemesanan ke server. Silakan coba kembali.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      guestName: '',
      checkIn: '',
      checkOut: '',
      guestsCount: 1,
      roomType: ''
    });
    setErrors({});
    setIsSubmitted(false);
    setBookingSummary(null);
    
    // Auto-focus kembali ke input nama tamu setelah reset
    setTimeout(() => {
      if (guestNameInputRef.current) {
        guestNameInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <section id="booking" className="booking-section">
      <div className="booking-container">
        <h2 className="section-title">Reservation Form</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Book your dream stay at Hotel Arca Lombok. Fill in the details below to secure your booking.
        </p>

        {isSubmitted && bookingSummary ? (
          /* Tampilan ketika booking sukses */
          <div className="booking-success" role="alert">
            <FaCheckCircle size={50} style={{ color: '#67c23a', marginBottom: '16px' }} />
            <h3>Booking Successful!</h3>
            <p>Thank you, <strong>{bookingSummary.guestName}</strong>. Your luxury stay has been reserved.</p>
            
            <div className="booking-summary-box">
              <div className="booking-summary-row">
                <span>Booking Code:</span>
                <strong>{bookingSummary.bookingCode}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Room Type:</span>
                <strong>{bookingSummary.roomType}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Check-in:</span>
                <strong>{bookingSummary.checkIn}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Check-out:</span>
                <strong>{bookingSummary.checkOut}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Duration:</span>
                <strong>{bookingSummary.nights} Night(s)</strong>
              </div>
              <div className="booking-summary-row">
                <span>Guests:</span>
                <strong>{bookingSummary.guestsCount} Person(s)</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '24px' }}>
              A confirmation email has been sent. Please present the booking code upon arrival.
            </p>
            
            <button onClick={handleReset} className="btn-gold">
              Book Another Room
            </button>
          </div>
        ) : (
          /* Form Input Booking */
          <form onSubmit={handleSubmit} className="booking-form" noValidate>
            
            {/* Input: Nama Tamu */}
            <div className="form-group-full">
              <label htmlFor="guestName" className="booking-label">
                <FaUser style={{ marginRight: '6px' }} /> Nama Lengkap Tamu
              </label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                ref={guestNameInputRef}
                value={formData.guestName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda sesuai KTP/Paspor"
                className={`booking-input ${errors.guestName ? 'invalid' : ''}`}
                required
                maxLength={100}
                autocomplete="name"
              />
              {errors.guestName && (
                <span className="validation-error">{errors.guestName}</span>
              )}
            </div>

            {/* Input: Check-in Date */}
            <div>
              <label htmlFor="checkIn" className="booking-label">
                <FaCalendarAlt style={{ marginRight: '6px' }} /> Tanggal Check-in
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className={`booking-input ${errors.checkIn ? 'invalid' : ''}`}
                required
              />
              {errors.checkIn && (
                <span className="validation-error">{errors.checkIn}</span>
              )}
            </div>

            {/* Input: Check-out Date */}
            <div>
              <label htmlFor="checkOut" className="booking-label">
                <FaCalendarAlt style={{ marginRight: '6px' }} /> Tanggal Check-out
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className={`booking-input ${errors.checkOut ? 'invalid' : ''}`}
                required
              />
              {errors.checkOut && (
                <span className="validation-error">{errors.checkOut}</span>
              )}
            </div>

            {/* Input: Jumlah Tamu */}
            <div>
              <label htmlFor="guestsCount" className="booking-label">
                <FaUsers style={{ marginRight: '6px' }} /> Jumlah Tamu
              </label>
              <input
                type="number"
                id="guestsCount"
                name="guestsCount"
                min="1"
                max="10"
                value={formData.guestsCount}
                onChange={handleChange}
                className={`booking-input ${errors.guestsCount ? 'invalid' : ''}`}
                required
                inputmode="numeric"
              />
              {errors.guestsCount && (
                <span className="validation-error">{errors.guestsCount}</span>
              )}
            </div>

            {/* Input: Tipe Kamar */}
            <div>
              <label htmlFor="roomType" className="booking-label">
                <FaBed style={{ marginRight: '6px' }} /> Tipe Kamar
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className={`booking-select ${errors.roomType ? 'invalid' : ''}`}
                required
              >
                <option value="">-- Pilih Tipe Kamar --</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Ocean View Suite">Ocean View Suite</option>
                <option value="Family Room">Family Room</option>
                <option value="Private Villa">Private Villa</option>
              </select>
              {errors.roomType && (
                <span className="validation-error">{errors.roomType}</span>
              )}
            </div>

            {/* Error Message jika API gagal */}
            {submitError && (
              <div className="form-group-full" style={{ color: '#ff4d4f', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>
                {submitError}
              </div>
            )}

            {/* Tombol Submit */}
            <button 
              type="submit" 
              className="btn-gold booking-submit-btn"
              disabled={isLoading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" /> Submitting...
                </>
              ) : (
                'Submit Booking'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
