"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaUsers, FaBed, FaCheckCircle, FaSpinner, FaCoffee, FaLock, FaPhone, FaMapMarkerAlt, FaDoorOpen } from 'react-icons/fa';
import { submitBooking } from '../services/api';

// 18 Kamar Default dengan Nomor Kamar
const DEFAULT_ROOMS = [
  // Economy Room — Lantai 1 (6 kamar: 101–106)
  { id: 1, roomNumber: "101", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 2, roomNumber: "102", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 3, roomNumber: "103", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 4, roomNumber: "104", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 5, roomNumber: "105", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 6, roomNumber: "106", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  // Standard Room — Lantai 1 (8 kamar: 107–114)
  { id: 7, roomNumber: "107", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 8, roomNumber: "108", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 9, roomNumber: "109", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 10, roomNumber: "110", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 11, roomNumber: "111", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 12, roomNumber: "112", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 13, roomNumber: "113", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 14, roomNumber: "114", name: "Standard Room", price: 200000, floor: 1, description: "Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  // VIP Suite — Lantai 2 (4 kamar: 201–204)
  { id: 15, roomNumber: "201", name: "VIP Suite", price: 350000, floor: 2, description: "Spaciously designed with high-end furniture, private lounge, and premium entertainment.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"] },
  { id: 16, roomNumber: "202", name: "VIP Suite", price: 350000, floor: 2, description: "Spaciously designed with high-end furniture, private lounge, and premium entertainment.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"] },
  { id: 17, roomNumber: "203", name: "VIP Suite", price: 350000, floor: 2, description: "Spaciously designed with high-end furniture, private lounge, and premium entertainment.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"] },
  { id: 18, roomNumber: "204", name: "VIP Suite", price: 350000, floor: 2, description: "Spaciously designed with high-end furniture, private lounge, and premium entertainment.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"] },
];

export default function BookingForm({ selectedRoom, focusTrigger }) {
  const router = useRouter();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState({
    guestName: '',
    phoneNumber: '',
    domicile: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
    roomType: '',
    roomNumber: '',
    welcomeDrink: 'Air Putih'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const guestNameInputRef = useRef(null);

  // Rooms & availability
  const [allRooms, setAllRooms] = useState([]);
  const [bookedRoomNumbers, setBookedRoomNumbers] = useState(new Set());

  // Load rooms from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let stored = [];
      try { stored = JSON.parse(localStorage.getItem('hotel_rooms') || '[]'); } catch(e) {}
      // If old format (< 10 rooms) or empty, seed with 18-room data. Force update if 3rd floor exists.
      const needsMigration = stored.some(r => r.floor === 3 || r.roomNumber === '301');
      if (stored.length < 10 || needsMigration) {
        stored = DEFAULT_ROOMS;
        localStorage.setItem('hotel_rooms', JSON.stringify(DEFAULT_ROOMS));
      }
      setAllRooms(stored);

      // Determine currently booked room numbers
      let bookings = [];
      try { bookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]'); } catch(e) {}
      const active = bookings.filter(b => b.paymentStatus !== 'Cancelled');
      const bookedSet = new Set(active.map(b => b.roomNumber).filter(Boolean));
      setBookedRoomNumbers(bookedSet);
    }
  }, []);

  // When selectedRoom (type) passed from parent, pick first available room of that type
  useEffect(() => {
    if (selectedRoom && allRooms.length > 0) {
      const available = allRooms.find(r => r.name === selectedRoom && !bookedRoomNumbers.has(r.roomNumber));
      if (available) {
        setFormData(prev => ({ ...prev, roomType: available.name, roomNumber: available.roomNumber }));
      } else {
        setFormData(prev => ({ ...prev, roomType: selectedRoom, roomNumber: '' }));
      }
    }
  }, [selectedRoom, allRooms, bookedRoomNumbers]);

  useEffect(() => {
    if (focusTrigger && guestNameInputRef.current) {
      guestNameInputRef.current.focus();
    }
  }, [focusTrigger]);

  const [currentUser, setCurrentUser] = useState(null);

  // Load user session and prefill guestName + phoneNumber
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          guestName: user.name,
          phoneNumber: user.phoneNumber || prev.phoneNumber
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'checkIn' && prev.checkOut && value >= prev.checkOut) {
        updated.checkOut = '';
      }
      return updated;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'checkIn' && errors.checkOut) setErrors(prev => ({ ...prev, checkOut: '' }));
  };

  // Handle room selection by room number
  const handleRoomChange = (e) => {
    const roomNum = e.target.value;
    const room = allRooms.find(r => r.roomNumber === roomNum);
    setFormData(prev => ({
      ...prev,
      roomNumber: roomNum,
      roomType: room ? room.name : ''
    }));
    if (errors.roomType) setErrors(prev => ({ ...prev, roomType: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Nama tamu wajib diisi.';
    else if (formData.guestName.trim().length < 3) newErrors.guestName = 'Nama minimal terdiri dari 3 karakter.';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Nomor telepon wajib diisi.';
    else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phoneNumber.trim())) newErrors.phoneNumber = 'Format nomor telepon tidak valid.';
    if (!formData.domicile.trim()) newErrors.domicile = 'Domisili asal wajib diisi.';
    if (!formData.checkIn) newErrors.checkIn = 'Tanggal check-in wajib diisi.';
    else if (formData.checkIn < todayStr) newErrors.checkIn = 'Tanggal check-in tidak boleh di masa lampau.';
    if (!formData.checkOut) newErrors.checkOut = 'Tanggal check-out wajib diisi.';
    else if (formData.checkIn && formData.checkOut <= formData.checkIn) newErrors.checkOut = 'Tanggal check-out harus setelah tanggal check-in.';
    if (!formData.roomNumber) newErrors.roomType = 'Silakan pilih nomor kamar.';
    if (!formData.guestsCount || formData.guestsCount < 1) newErrors.guestsCount = 'Jumlah tamu minimal 1 orang.';
    else if (formData.guestsCount > 2) newErrors.guestsCount = 'Jumlah tamu maksimal 2 orang per kamar.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setSubmitError('');
      try {
        await submitBooking(formData);
        const date1 = new Date(formData.checkIn);
        const date2 = new Date(formData.checkOut);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const bookingCode = 'ARC-' + Math.floor(100000 + Math.random() * 900000);

        // Get room price
        const room = allRooms.find(r => r.roomNumber === formData.roomNumber);
        const pricePerNight = room ? room.price : 150000;
        const totalRevenue = pricePerNight * diffDays;

        if (typeof window !== 'undefined') {
          const currentBookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
          const newBooking = {
            ...formData,
            nights: diffDays,
            bookingCode,
            totalRevenue,
            paymentStatus: 'Awaiting Payment',
            paymentMethod: '',
            status: 'Awaiting Payment',
            createdAt: new Date().toISOString()
          };
          currentBookings.push(newBooking);
          localStorage.setItem('hotel_bookings', JSON.stringify(currentBookings));
          router.push(`/payment?code=${bookingCode}`);
        }
      } catch (err) {
        setSubmitError('Gagal mengirim pemesanan ke server. Silakan coba kembali.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      guestName: currentUser ? currentUser.name : '',
      phoneNumber: currentUser ? (currentUser.phoneNumber || '') : '',
      domicile: '',
      checkIn: '',
      checkOut: '',
      guestsCount: 1,
      roomType: '',
      roomNumber: '',
      welcomeDrink: 'Air Putih'
    });
    setErrors({});
    setIsSubmitted(false);
    setBookingSummary(null);
    setTimeout(() => { if (guestNameInputRef.current) guestNameInputRef.current.focus(); }, 100);
  };

  // Group rooms by type for the selector
  const economyRooms = allRooms.filter(r => r.name === 'Economy Room');
  const standardRooms = allRooms.filter(r => r.name === 'Standard Room');
  const vipRooms = allRooms.filter(r => r.name === 'VIP Suite');

  // Get price of selected room
  const selectedRoomData = allRooms.find(r => r.roomNumber === formData.roomNumber);
  const pricePerNight = selectedRoomData ? selectedRoomData.price : 0;

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <section id="booking" className="booking-section">
      <div className="booking-container">
        <h2 className="section-title">Reservation Form</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Book your dream stay at Hotel Arca. Fill in the details below to secure your booking.
        </p>

        {isSubmitted && bookingSummary ? (
          <div className="booking-success" role="alert">
            <FaCheckCircle size={50} style={{ color: '#67c23a', marginBottom: '16px' }} />
            <h3>Booking Successful!</h3>
            <p>Thank you, <strong>{bookingSummary.guestName}</strong>. Your luxury stay has been reserved.</p>
            <div className="booking-summary-box">
              <div className="booking-summary-row"><span>Booking Code:</span><strong>{bookingSummary.bookingCode}</strong></div>
              <div className="booking-summary-row"><span>Kamar:</span><strong>No. {bookingSummary.roomNumber} — {bookingSummary.roomType}</strong></div>
              <div className="booking-summary-row"><span>Check-in:</span><strong>{bookingSummary.checkIn}</strong></div>
              <div className="booking-summary-row"><span>Check-out:</span><strong>{bookingSummary.checkOut}</strong></div>
              <div className="booking-summary-row"><span>Duration:</span><strong>{bookingSummary.nights} Night(s)</strong></div>
              <div className="booking-summary-row"><span>Guests:</span><strong>{bookingSummary.guestsCount} Person(s)</strong></div>
            </div>
            <button onClick={handleReset} className="btn-gold">Book Another Room</button>
          </div>
        ) : !currentUser ? (
          <div className="login-prompt-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FaLock size={45} style={{ color: 'var(--color-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-blue-deep)', fontSize: '1.6rem', marginBottom: '12px' }}>Login Diperlukan</h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
              Silakan login atau daftarkan akun Anda terlebih dahulu untuk melakukan reservasi kamar di Hotel Arca.
            </p>
            <Link href="/login" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Login / Register Sekarang
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form" noValidate>

            {/* Input: Nama Tamu */}
            <div className="form-group-full">
              <label htmlFor="guestName" className="booking-label">
                <FaUser style={{ marginRight: '6px' }} /> Nama Lengkap Tamu
              </label>
              <input
                type="text" id="guestName" name="guestName"
                ref={guestNameInputRef} value={formData.guestName}
                onChange={handleChange} placeholder="Masukkan nama lengkap sesuai KTP/Paspor"
                className={`booking-input ${errors.guestName ? 'invalid' : ''}`}
                required maxLength={100} autoComplete="name"
              />
              {errors.guestName && <span className="validation-error">{errors.guestName}</span>}
            </div>

            {/* Input: Nomor Telepon */}
            <div>
              <label htmlFor="phoneNumber" className="booking-label">
                <FaPhone style={{ marginRight: '6px' }} /> Nomor Telepon
              </label>
              <input
                type="tel" id="phoneNumber" name="phoneNumber"
                value={formData.phoneNumber} onChange={handleChange}
                placeholder="Contoh: 08123456789"
                className={`booking-input ${errors.phoneNumber ? 'invalid' : ''}`}
                required maxLength={15} autoComplete="tel"
              />
              {errors.phoneNumber && <span className="validation-error">{errors.phoneNumber}</span>}
            </div>

            {/* Input: Domisili */}
            <div>
              <label htmlFor="domicile" className="booking-label">
                <FaMapMarkerAlt style={{ marginRight: '6px' }} /> Domisili Asal
              </label>
              <input
                type="text" id="domicile" name="domicile"
                value={formData.domicile} onChange={handleChange}
                placeholder="Contoh: Jakarta, Surabaya, Bandung"
                className={`booking-input ${errors.domicile ? 'invalid' : ''}`}
                required maxLength={100} autoComplete="address-level2"
              />
              {errors.domicile && <span className="validation-error">{errors.domicile}</span>}
            </div>

            {/* Input: Check-in */}
            <div>
              <label htmlFor="checkIn" className="booking-label">
                <FaCalendarAlt style={{ marginRight: '6px' }} /> Tanggal Check-in
              </label>
              <input
                type="date" id="checkIn" name="checkIn"
                value={formData.checkIn} onChange={handleChange}
                className={`booking-input ${errors.checkIn ? 'invalid' : ''}`}
                required min={todayStr}
              />
              {errors.checkIn && <span className="validation-error">{errors.checkIn}</span>}
            </div>

            {/* Input: Check-out */}
            <div>
              <label htmlFor="checkOut" className="booking-label">
                <FaCalendarAlt style={{ marginRight: '6px' }} /> Tanggal Check-out
              </label>
              <input
                type="date" id="checkOut" name="checkOut"
                value={formData.checkOut} onChange={handleChange}
                className={`booking-input ${errors.checkOut ? 'invalid' : ''}`}
                required
                min={(() => {
                  if (!formData.checkIn) return todayStr;
                  const d = new Date(formData.checkIn);
                  if (isNaN(d.getTime())) return todayStr;
                  d.setDate(d.getDate() + 1);
                  try { return d.toISOString().split('T')[0]; } catch (e) { return todayStr; }
                })()}
              />
              {errors.checkOut && <span className="validation-error">{errors.checkOut}</span>}
            </div>

            {/* Input: Jumlah Tamu */}
            <div>
              <label htmlFor="guestsCount" className="booking-label">
                <FaUsers style={{ marginRight: '6px' }} /> Jumlah Tamu
              </label>
              <input
                type="number" id="guestsCount" name="guestsCount"
                min="1" max="2" value={formData.guestsCount}
                onChange={handleChange}
                className={`booking-input ${errors.guestsCount ? 'invalid' : ''}`}
                required inputMode="numeric"
              />
              {errors.guestsCount && <span className="validation-error">{errors.guestsCount}</span>}
            </div>

            {/* Input: Pilih Nomor Kamar */}
            <div className="form-group-full">
              <label htmlFor="roomNumber" className="booking-label">
                <FaDoorOpen style={{ marginRight: '6px' }} /> Pilih Nomor Kamar
              </label>
              <select
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleRoomChange}
                className={`booking-select ${errors.roomType ? 'invalid' : ''}`}
                required
              >
                <option value="">-- Pilih Nomor Kamar --</option>
                {economyRooms.length > 0 && (
                  <optgroup label="🏠 Economy Room — Rp 150.000/malam (Lantai 1, 101–106)">
                    {economyRooms.map(room => {
                      const booked = bookedRoomNumbers.has(room.roomNumber);
                      return (
                        <option key={room.roomNumber} value={room.roomNumber} disabled={booked}>
                          Kamar {room.roomNumber} — {booked ? '🔴 Terpesan' : '🟢 Tersedia'} | Rp 150.000
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {standardRooms.length > 0 && (
                  <optgroup label="🛏 Standard Room — Rp 200.000/malam (Lantai 1, 107–114)">
                    {standardRooms.map(room => {
                      const booked = bookedRoomNumbers.has(room.roomNumber);
                      return (
                        <option key={room.roomNumber} value={room.roomNumber} disabled={booked}>
                          Kamar {room.roomNumber} — {booked ? '🔴 Terpesan' : '🟢 Tersedia'} | Rp 200.000
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {vipRooms.length > 0 && (
                  <optgroup label="👑 VIP Suite — Rp 350.000/malam (Lantai 2, 201–204)">
                    {vipRooms.map(room => {
                      const booked = bookedRoomNumbers.has(room.roomNumber);
                      return (
                        <option key={room.roomNumber} value={room.roomNumber} disabled={booked}>
                          Kamar {room.roomNumber} — {booked ? '🔴 Terpesan' : '🟢 Tersedia'} | Rp 350.000
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
              {errors.roomType && <span className="validation-error">{errors.roomType}</span>}
              {/* Show selected room info */}
              {formData.roomNumber && selectedRoomData && (
                <div className="room-selected-info">
                  <span className="room-sel-num">Kamar {formData.roomNumber}</span>
                  <span className="room-sel-type">{selectedRoomData.name}</span>
                  <span className="room-sel-price">{formatIDR(pricePerNight)} / malam</span>
                </div>
              )}
            </div>

            {/* Input: Welcome Drink */}
            <div>
              <label htmlFor="welcomeDrink" className="booking-label">
                <FaCoffee style={{ marginRight: '6px' }} /> Welcome Drink (Free)
              </label>
              <select
                id="welcomeDrink" name="welcomeDrink"
                value={formData.welcomeDrink} onChange={handleChange}
                className="booking-select" required
              >
                <option value="Air Putih">Air Putih (Mineral Water)</option>
                <option value="Kopi">Kopi (Coffee)</option>
              </select>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="form-group-full" style={{ color: '#ff4d4f', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-gold booking-submit-btn"
              disabled={isLoading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isLoading ? (
                <><FaSpinner className="spinner" /> Submitting...</>
              ) : (
                'Submit Booking'
              )}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .room-selected-info {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          padding: 8px 16px;
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, #0d3655 100%);
          border-radius: 8px;
          border: 1px solid var(--color-gold);
        }
        .room-sel-num {
          font-weight: 800;
          color: var(--color-gold);
          font-size: 0.95rem;
          font-family: 'Courier New', monospace;
        }
        .room-sel-type {
          color: rgba(255,255,255,0.8);
          font-size: 0.82rem;
        }
        .room-sel-price {
          color: var(--color-gold);
          font-weight: 600;
          font-size: 0.85rem;
        }
      `}</style>
    </section>
  );
}
