"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { FaBed, FaCalendarAlt, FaUser, FaCheckCircle, FaLock, FaSignOutAlt, FaCheck, FaTrash, FaHome, FaDoorOpen, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { getRooms, getBookings, createPayment, updateBooking, clearAuth } from '../../services/api';

export default function StaffDashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Build a map from id_room -> room object for quick lookup
  const roomMap = {};
  for (const r of rooms) roomMap[r.id_room] = r;

  const loadData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([getRooms(), getBookings()]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (e) {}
  };
=======
import {
  FaBed, FaCalendarAlt, FaUser, FaCheckCircle, FaLock,
  FaSignOutAlt, FaCheck, FaTrash, FaTachometerAlt, FaListAlt,
  FaCog, FaHome, FaTicketAlt, FaMoneyBillWave, FaClipboardList,
  FaDoorOpen
} from 'react-icons/fa';

const DEFAULT_ROOMS = [
  { id: 1,  roomNumber: "101", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 2,  roomNumber: "102", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 3,  roomNumber: "103", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 4,  roomNumber: "104", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 5,  roomNumber: "105", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 6,  roomNumber: "106", name: "Economy Room", price: 150000, floor: 1, description: "Cozy room with basic facilities.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi","Smart TV"] },
  { id: 7,  roomNumber: "107", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 8,  roomNumber: "108", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 9,  roomNumber: "109", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 10, roomNumber: "110", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 11, roomNumber: "111", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 12, roomNumber: "112", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 13, roomNumber: "113", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 14, roomNumber: "114", name: "Standard Room", price: 200000, floor: 1, description: "Premium bedding with garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV"] },
  { id: 15, roomNumber: "201", name: "VIP Suite", price: 350000, floor: 2, description: "Luxury suite with private lounge.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV","Private Lounge"] },
  { id: 16, roomNumber: "202", name: "VIP Suite", price: 350000, floor: 2, description: "Luxury suite with private lounge.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV","Private Lounge"] },
  { id: 17, roomNumber: "203", name: "VIP Suite", price: 350000, floor: 2, description: "Luxury suite with private lounge.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV","Private Lounge"] },
  { id: 18, roomNumber: "204", name: "VIP Suite", price: 350000, floor: 2, description: "Luxury suite with private lounge.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi","Breakfast","Smart TV","Private Lounge"] },
];

export default function StaffDashboardPage() {
  const [rooms, setRooms]           = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeNav, setActiveNav]   = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType]   = useState('success');
>>>>>>> upstream/main

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
<<<<<<< HEAD
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role === 'staff') {
          setIsAuthorized(true);
          loadData();
        }
      } catch (e) {}
    }
    setCheckingAuth(false);
  }, []);

=======
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      if (user.role === 'staff' || user.email === 'staff@arca.com') {
        setIsAuthorized(true);
        // Seed / migrate rooms to 18-room format
        let stored = [];
        try { stored = JSON.parse(localStorage.getItem('hotel_rooms') || '[]'); } catch(e) {}
        const needsMigration = stored.some(r => r.floor === 3 || r.roomNumber === '301');
        if (stored.length < 10 || needsMigration) {
          localStorage.setItem('hotel_rooms', JSON.stringify(DEFAULT_ROOMS));
          setRooms(DEFAULT_ROOMS);
        } else {
          setRooms(stored);
        }
        // Load bookings
        let bk = [];
        try { bk = JSON.parse(localStorage.getItem('hotel_bookings') || '[]'); } catch(e) {}
        setBookings(bk);
      }
    }
    setCheckingAuth(false);

    // Listen to localStorage changes in real time
    const handleStorageChange = () => {
      let bk = [];
      try { bk = JSON.parse(localStorage.getItem('hotel_bookings') || '[]'); } catch(e) {}
      setBookings(bk);
      let rm = [];
      try { rm = JSON.parse(localStorage.getItem('hotel_rooms') || '[]'); } catch(e) {}
      if (rm.length > 0) setRooms(rm);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const reloadBookings = () => {
    let bk = [];
    try { bk = JSON.parse(localStorage.getItem('hotel_bookings') || '[]'); } catch(e) {}
    setBookings(bk);
  };

>>>>>>> upstream/main
  const showToast = (msg, type = 'success') => {
    setToastMessage(msg); setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

<<<<<<< HEAD
  // ── Helpers ─────────────────────────────────────────────────
  const getRoomName = (idRoom) => roomMap[idRoom]?.room_type?.name || '-';
  const getRoomNumber = (idRoom) => roomMap[idRoom]?.room_number || '-';
  const getRoomPrice = (idRoom) => roomMap[idRoom]?.room_type?.price || 0;
  const getRoomFloor = (idRoom) => {
    const num = parseInt(roomMap[idRoom]?.room_number, 10);
    if (num >= 101 && num <= 114) return 1;
    if (num >= 201 && num <= 204) return 2;
    return 0;
  };

  const getNights = (b) => {
    if (!b.date_in || !b.date_out) return 1;
    try {
      const d1 = new Date(b.date_in);
      const d2 = new Date(b.date_out);
      return Math.max(1, Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)));
    } catch { return 1; }
=======
  const handleMarkAsPaid = (bookingCode) => {
    const booking = bookings.find(b => b.bookingCode === bookingCode);
    if (!booking) return;
    
    const isCash = booking.paymentStatus === 'Pay at Hotel' ||
                   booking.paymentMethod === 'Bayar di Hotel' ||
                   booking.paymentStatus === 'Awaiting Payment' ||
                   !booking.paymentMethod;
                   
    if (!isCash) {
      showToast('Staff hanya dapat mengkonfirmasi pembayaran Cash (Bayar di Hotel).', 'error');
      return;
    }
    
    const updatedBookings = bookings.map(b => {
      if (b.bookingCode !== bookingCode) return b;
      const room = rooms.find(r => r.roomNumber === b.roomNumber) ||
                   rooms.find(r => r.name === b.roomType);
      const price = room ? room.price : 150000;
      const rev = b.totalRevenue || price * (b.nights || 1);
      
      return { ...b, paymentStatus: 'Paid', paymentMethod: b.paymentMethod || 'Bayar di Hotel', totalRevenue: rev,
               paidAt: new Date().toISOString(), confirmedBy: 'staff' };
    });
    setBookings(updatedBookings);
    localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));
    showToast(`Booking ${bookingCode} berhasil dikonfirmasi Lunas (Cash)!`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancelBooking = (bookingCode) => {
    if (!window.confirm(`Batalkan booking ${bookingCode}?`)) return;
    const updated = bookings.filter(b => b.bookingCode !== bookingCode);
    setBookings(updated);
    localStorage.setItem('hotel_bookings', JSON.stringify(updated));
    showToast(`Booking ${bookingCode} dibatalkan.`);
    window.dispatchEvent(new Event('storage'));
>>>>>>> upstream/main
  };

  const formatIDR = (n) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n||0);
  const formatDate = (s) => {
    if (!s) return '-';
    try {
      const d = new Date(s);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
<<<<<<< HEAD
    } catch { return '-'; }
  };

  const mapStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return { label: 'Lunas', cssClass: 'pill-g' };
    if (s === 'pay_at_hotel') return { label: 'Bayar Hotel', cssClass: 'pill-o' };
    if (s === 'waiting_confirmation') return { label: 'Menunggu Verifikasi', cssClass: 'pill-b' };
    if (s === 'cancelled') return { label: 'Dibatalkan', cssClass: 'pill-r' };
    return { label: 'Belum Bayar', cssClass: 'pill-r' };
  };

  const getRoomBooking = (room) =>
    bookings.find(b => b.id_room === room.id_room && b.status_payment !== 'cancelled') || null;

  // ── Statistics ──────────────────────────────────────────────
  const totalBookings     = bookings.length;
  const paidCount         = bookings.filter(b => b.status_payment === 'paid').length;
  const pendingCash       = bookings.filter(b => b.status_payment === 'pay_at_hotel').length;
  const awaitingTF        = bookings.filter(b => b.status_payment === 'waiting_confirmation').length;
  const occupiedRooms     = rooms.filter(r => getRoomBooking(r)).length;
  const availableRooms    = rooms.length - occupiedRooms;

  // ── Actions ──────────────────────────────────────────────────
  const handleMarkAsPaid = async (idBooking) => {
    const booking = bookings.find(b => b.id_booking === idBooking);
    if (!booking) return;

    // Staff can only confirm pay_at_hotel (cash) bookings
    if (booking.status_payment !== 'pay_at_hotel') {
      showToast('Staff hanya dapat mengkonfirmasi pembayaran Cash (Bayar di Hotel).', 'error');
      return;
    }

    try {
      await Promise.all([
        createPayment({
          id_booking: idBooking,
          total_payment: booking.total_payment,
          method: 'cash',
          status: 'paid'
        }),
        updateBooking(idBooking, { status_payment: 'paid' })
      ]);
      showToast(`Booking #${idBooking} berhasil dikonfirmasi Lunas (Cash)!`);
      loadData();
    } catch (err) {
      showToast('Gagal mengkonfirmasi pembayaran.', 'error');
    }
  };

  const handleCancelBooking = async (idBooking) => {
    if (!window.confirm(`Batalkan booking #${idBooking}?`)) return;
    try {
      await updateBooking(idBooking, { status_payment: 'cancelled' });
      showToast(`Booking #${idBooking} dibatalkan.`);
      loadData();
    } catch (err) {
      showToast('Gagal membatalkan booking.', 'error');
    }
  };

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',     icon: <FaBed /> },
    { id: 'reservations', label: 'Reservasi',     icon: <FaCalendarAlt /> },
    { id: 'rooms',        label: 'Status Kamar',  icon: <FaDoorOpen /> },
    { id: 'settings',     label: 'Pengaturan',    icon: <FaUser /> },
=======
    } catch (e) {
      return '-';
    }
  };

  // ── Statistics ──────────────────────────────────────────────
  const totalBookings     = bookings.length;
  const paidCount         = bookings.filter(b => b.paymentStatus === 'Paid').length;
  const pendingCash       = bookings.filter(b => b.paymentStatus === 'Pay at Hotel').length;
  const awaitingTF        = bookings.filter(b => b.paymentStatus === 'Awaiting Confirmation').length;
  const occupiedRooms     = rooms.filter(room => bookings.some(b =>
    (b.roomNumber ? b.roomNumber === room.roomNumber : b.roomType === room.name) &&
    b.paymentStatus !== 'Cancelled')).length;
  const availableRooms    = rooms.length - occupiedRooms;

  // ── Helper: is room occupied ─────────────────────────────────
  const getRoomBooking = (room) =>
    bookings.find(b =>
      (b.roomNumber ? b.roomNumber === room.roomNumber : b.roomType === room.name) &&
      b.paymentStatus !== 'Cancelled'
    ) || null;

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',     icon: <FaTachometerAlt /> },
    { id: 'reservations', label: 'Reservations',  icon: <FaCalendarAlt /> },
    { id: 'rooms',        label: 'Room Status',   icon: <FaDoorOpen /> },
    { id: 'settings',     label: 'Settings',      icon: <FaCog /> },
>>>>>>> upstream/main
  ];

  // ── Auth guards ──────────────────────────────────────────────
  if (checkingAuth) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',background:'#f5f5f4'}}>
      <p>Memverifikasi otorisasi...</p>
    </div>
  );

  if (!isAuthorized) return (
    <div className="ad-page">
      <div className="ad-card">
        <FaLock className="ad-lock" />
        <h2>Akses Ditolak</h2>
        <p>Anda harus masuk sebagai <strong>Staff</strong> untuk mengakses portal ini.</p>
        <div className="ad-actions">
          <Link href="/staff/login" className="btn-gold">Login Sebagai Staff</Link>
          <Link href="/" className="ad-back">Kembali ke Halaman Utama</Link>
        </div>
      </div>
      <style jsx>{`.ad-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f4;padding:20px;font-family:'Inter',sans-serif}.ad-card{background:white;max-width:420px;width:100%;padding:48px 40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.08);text-align:center}.ad-lock{font-size:3rem;color:#ef4444;margin-bottom:20px}.ad-card h2{font-family:var(--font-title);color:var(--color-blue-deep);font-size:1.6rem;font-weight:700;margin-bottom:12px}.ad-card p{color:var(--color-text-light);font-size:.95rem;margin-bottom:30px;line-height:1.5}.ad-actions{display:flex;flex-direction:column;gap:15px;align-items:center}.btn-gold{background-color:var(--color-gold);color:#fff;padding:12px 30px;font-weight:600;text-transform:uppercase;font-size:.8rem;letter-spacing:1px;border-radius:var(--radius-sm)}.ad-back{font-size:.9rem;color:var(--color-text-light);font-weight:500}`}</style>
    </div>
  );

  return (
    <div className="portal-layout">
<<<<<<< HEAD
      {/* ── SIDEBAR ── */}
=======
      {/* ── SIDEBAR ────────────────────── */}
>>>>>>> upstream/main
      <aside className="sidebar">
        <div className="sb-brand">
          <img src="/assets/logo.png" alt="Hotel Arca" style={{height:'36px',width:'auto'}} />
          <div className="sb-brand-text">
            <span className="sb-portal">Staff Portal</span>
            <span className="sb-sub">ARCA MANAGEMENT</span>
          </div>
        </div>

        <nav className="sb-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <Link href="/#booking" className="new-booking-btn">+ NEW BOOKING</Link>

        <div className="sb-bottom">
          <Link href="/" className="sb-link"><FaHome /><span>Back to Website</span></Link>
<<<<<<< HEAD
          <button onClick={() => { clearAuth(); window.location.href='/staff/login'; }} className="sb-logout">
=======
          <button onClick={() => { localStorage.removeItem('currentUser'); window.location.href='/staff/login'; }} className="sb-logout">
>>>>>>> upstream/main
            <FaSignOutAlt /><span>Logout</span>
          </button>
          <div className="sb-avatar">
            <div className="av-circle"><FaUser /></div>
            <div className="av-info">
              <span className="av-name">{currentUser?.name || 'Staff'}</span>
              <span className="av-role">Staff</span>
            </div>
          </div>
        </div>
      </aside>

<<<<<<< HEAD
      {/* ── MAIN ── */}
=======
      {/* ── MAIN ────────────────────────── */}
>>>>>>> upstream/main
      <main className="main-content">
        {toastMessage && (
          <div className={`toast ${toastType === 'error' ? 'toast-err' : ''}`}>
            {toastType === 'error' ? '⚠' : <FaCheckCircle style={{color:'var(--color-gold)'}} />}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeNav === 'dashboard' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Staff Dashboard</h1>
                <p className="pg-sub">Selamat datang, {currentUser?.name || 'Staff'}. Ringkasan harian Arca Hotel.</p>
              </div>
<<<<<<< HEAD
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
            </div>

            <div className="stats-grid">
              {[
                { icon:<FaClipboardList/>, label:'Total Booking',  value:totalBookings,      color:'blue' },
                { icon:<FaCheckCircle/>,   label:'Terkonfirmasi',  value:paidCount,          color:'green' },
                { icon:<FaMoneyBillWave/>, label:'Bayar di Hotel', value:pendingCash,        color:'orange' },
                { icon:<FaDoorOpen/>,      label:'Kamar Tersedia',  value:`${availableRooms}/${rooms.length}`, color:'teal' },
=======
              <button className="refresh-btn" onClick={reloadBookings} title="Refresh">↻ Refresh</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                { icon:<FaClipboardList/>, label:'Total Booking', value:totalBookings, color:'blue' },
                { icon:<FaCheckCircle/>,   label:'Terkonfirmasi', value:paidCount,     color:'green' },
                { icon:<FaMoneyBillWave/>, label:'Bayar di Hotel', value:pendingCash,  color:'orange' },
                { icon:<FaDoorOpen/>,      label:'Kamar Tersedia', value:availableRooms+'/'+rooms.length, color:'teal' },
>>>>>>> upstream/main
              ].map((s,i) => (
                <div key={i} className="stat-card">
                  <div className={`stat-icon si-${s.color}`}>{s.icon}</div>
                  <div className="stat-info">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-value">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            {/* Mini room grid */}
            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Status Kamar</h2>
=======
            {/* Room Overview Grid */}
            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Status 18 Kamar</h2>
>>>>>>> upstream/main
                <button className="view-all" onClick={() => setActiveNav('rooms')}>Lihat Detail →</button>
              </div>
              <div className="room-grid-mini">
                {rooms.map(room => {
                  const bk = getRoomBooking(room);
                  return (
<<<<<<< HEAD
                    <div key={room.id_room} className={`rgm-card ${bk ? 'rgm-occ' : 'rgm-avail'}`}>
                      <span className="rgm-num">{room.room_number}</span>
                      <span className="rgm-type">{room.room_type?.name==='Economy Room'?'ECO':room.room_type?.name==='Standard Room'?'STD':'VIP'}</span>
                      <span className={`rgm-dot ${bk ? 'dot-red' : 'dot-green'}`}></span>
=======
                    <div key={room.roomNumber} className={`rgm-card ${bk ? 'rgm-occ' : 'rgm-avail'}`}>
                      <span className="rgm-num">{room.roomNumber}</span>
                      <span className="rgm-type">{room.name === 'Economy Room' ? 'ECO' : room.name === 'Standard Room' ? 'STD' : 'VIP'}</span>
                      <span className={`rgm-dot ${bk ? 'dot-red' : 'dot-green'}`}></span>
                      {bk && <span className="rgm-guest" title={bk.guestName}>{bk.guestName?.split(' ')[0]}</span>}
>>>>>>> upstream/main
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent bookings */}
            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Reservasi Terbaru</h2>
                <button className="view-all" onClick={() => setActiveNav('reservations')}>Lihat Semua →</button>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state"><FaCalendarAlt style={{fontSize:'2rem',color:'var(--color-gold)',marginBottom:'10px'}}/><p>Belum ada booking masuk.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="dt">
                    <thead><tr>
<<<<<<< HEAD
                      <th>ID Booking</th><th>Kamar</th><th>Tipe</th><th>Check-in</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {bookings.slice(0,6).map((b,i) => (
                        <tr key={b.id_booking||i}>
                          <td><span className="code-badge"><FaCalendarAlt /> #{b.id_booking}</span></td>
                          <td><span className="room-num-badge">{getRoomNumber(b.id_room)}</span></td>
                          <td><span className="room-tag">{getRoomName(b.id_room)}</span></td>
                          <td className="date-cell">{formatDate(b.date_in)}</td>
                          <td><span className={`pill ${mapStatus(b.status_payment).cssClass}`}>{mapStatus(b.status_payment).label}</span></td>
=======
                      <th>Kode Booking</th><th>Tamu</th><th>Kamar</th>
                      <th>Check-in</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {bookings.slice(0,6).map((b,i) => (
                        <tr key={b.bookingCode||i}>
                          <td><span className="code-badge"><FaTicketAlt /> {b.bookingCode}</span></td>
                          <td><strong>{b.guestName}</strong></td>
                          <td>
                            {b.roomNumber && <span className="room-num-badge">{b.roomNumber}</span>}
                            <span className="room-tag">{b.roomType}</span>
                          </td>
                          <td className="date-cell">{formatDate(b.checkIn)}</td>
                          <td><span className={`pill ${b.paymentStatus==='Paid'?'pill-g':b.paymentStatus==='Pay at Hotel'?'pill-o':b.paymentStatus==='Awaiting Confirmation'?'pill-b':'pill-r'}`}>
                            {b.paymentStatus==='Paid'?'✓ Lunas':b.paymentStatus==='Pay at Hotel'?'⏳ Bayar Hotel':b.paymentStatus==='Awaiting Confirmation'?'🔄 TF Menunggu':'⚠ Belum Bayar'}
                          </span></td>
>>>>>>> upstream/main
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RESERVATIONS ── */}
        {activeNav === 'reservations' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Daftar Reservasi</h1>
                <p className="pg-sub">Staff dapat mengkonfirmasi pembayaran <strong>Cash (Bayar di Hotel)</strong>.</p>
              </div>
<<<<<<< HEAD
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
=======
              <button className="refresh-btn" onClick={reloadBookings}>↻ Refresh</button>
>>>>>>> upstream/main
            </div>
            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Booking List <span className="badge-cnt">{bookings.length}</span></h2>
              </div>
              {bookings.length === 0 ? (
<<<<<<< HEAD
                <div className="empty-state"><FaCalendarAlt style={{fontSize:'2rem',color:'var(--color-gold)',marginBottom:'10px'}}/><p>Belum ada booking masuk.</p></div>
=======
                <div className="empty-state"><FaListAlt style={{fontSize:'2rem',color:'var(--color-gold)',marginBottom:'10px'}}/><p>Belum ada booking masuk.</p></div>
>>>>>>> upstream/main
              ) : (
                <div className="table-responsive">
                  <table className="dt">
                    <thead><tr>
<<<<<<< HEAD
                      <th>ID Booking</th><th>No. Kamar</th><th>Tipe Kamar</th>
                      <th>Check-in</th><th>Check-out</th><th>Durasi</th>
                      <th>Status</th><th>Total</th><th>Aksi</th>
                    </tr></thead>
                    <tbody>
                      {bookings.map((b,i) => {
                        const isCash = b.status_payment === 'pay_at_hotel';
                        const canConfirm = b.status_payment !== 'paid' && b.status_payment !== 'cancelled' && isCash;
                        const isWaitingOwner = b.status_payment === 'waiting_confirmation';
                        return (
                          <tr key={b.id_booking||i}>
                            <td><span className="code-badge"><FaCalendarAlt /> #{b.id_booking}</span></td>
                            <td><span className="room-num-badge">{getRoomNumber(b.id_room)}</span></td>
                            <td><span className="room-tag">{getRoomName(b.id_room)}</span></td>
                            <td className="date-cell">{formatDate(b.date_in)}</td>
                            <td className="date-cell">{formatDate(b.date_out)}</td>
                            <td><span className="dur-badge">{getNights(b)} Mlm</span></td>
                            <td><span className={`pill ${mapStatus(b.status_payment).cssClass}`}>{mapStatus(b.status_payment).label}</span></td>
                            <td><strong style={{color:b.status_payment==='paid'?'#16a34a':'#6b7280',fontSize:'.84rem',whiteSpace:'nowrap'}}>{formatIDR(b.total_payment)}</strong></td>
                            <td>
                              <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                                {canConfirm && (
                                  <button onClick={() => handleMarkAsPaid(b.id_booking)} className="btn-paid" title="Konfirmasi Lunas">
                                    <FaCheck /> Lunas
                                  </button>
                                )}
                                {isWaitingOwner && (
                                  <span style={{fontSize:'.7rem',color:'#3b82f6',fontStyle:'italic',whiteSpace:'nowrap'}}>Tunggu Owner</span>
                                )}
                                {b.status_payment !== 'paid' && b.status_payment !== 'cancelled' && (
                                  <button onClick={() => handleCancelBooking(b.id_booking)} className="btn-cancel" title="Batalkan">
                                    <FaTrash />
                                  </button>
                                )}
=======
                      <th>Kode Booking</th><th>Nama Tamu</th><th>Telepon</th><th>Domisili</th>
                      <th>No. Kamar</th><th>Tipe Kamar</th><th>Check-in</th><th>Check-out</th>
                      <th>Durasi</th><th>Tamu</th><th>Drink</th><th>Pembayaran</th><th>Total</th><th>Aksi</th>
                    </tr></thead>
                    <tbody>
                      {bookings.map((b,i) => {
                        const isCash = b.paymentStatus === 'Pay at Hotel' || 
                                       (b.paymentMethod && b.paymentMethod.includes('Bayar di Hotel')) || 
                                       b.paymentStatus === 'Awaiting Payment' || 
                                       !b.paymentMethod;
                        const canConfirm = b.paymentStatus !== 'Paid' && b.paymentStatus !== 'Cancelled' && isCash;
                        const room = rooms.find(r => r.roomNumber === b.roomNumber) || rooms.find(r => r.name === b.roomType);
                        const price = room ? room.price : 150000;
                        const revenue = b.totalRevenue || price * (b.nights || 1);
                        return (
                          <tr key={b.bookingCode||i}>
                            <td><span className="code-badge"><FaTicketAlt /> {b.bookingCode}</span></td>
                            <td><strong>{b.guestName}</strong></td>
                            <td>{b.phoneNumber||'-'}</td>
                            <td>{b.domicile||'-'}</td>
                            <td>{b.roomNumber ? <span className="room-num-badge">{b.roomNumber}</span> : '-'}</td>
                            <td><span className="room-tag">{b.roomType}</span></td>
                            <td className="date-cell">{formatDate(b.checkIn)}</td>
                            <td className="date-cell">{formatDate(b.checkOut)}</td>
                            <td><span className="dur-badge">{b.nights} Mlm</span></td>
                            <td>{b.guestsCount} Org</td>
                            <td><span className="drink-tag">{b.welcomeDrink}</span></td>
                            <td>
                              <span className={`pill ${b.paymentStatus==='Paid'?'pill-g':b.paymentStatus==='Pay at Hotel'?'pill-o':b.paymentStatus==='Awaiting Confirmation'?'pill-b':'pill-r'}`}>
                                {b.paymentStatus==='Paid'?'✓ Lunas':b.paymentStatus==='Pay at Hotel'?'⏳ Bayar Hotel':b.paymentStatus==='Awaiting Confirmation'?'🔄 TF Menunggu':'⚠ Belum Bayar'}
                              </span>
                              {b.paymentMethod && <div style={{fontSize:'0.65rem',color:'#6b7280',marginTop:'2px'}}>{b.paymentMethod}</div>}
                            </td>
                            <td><strong style={{color: b.paymentStatus==='Paid' ? '#16a34a':'#6b7280', fontSize:'0.85rem', whiteSpace:'nowrap'}}>{formatIDR(revenue)}</strong></td>
                            <td>
                              <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                                {canConfirm && (
                                  <button onClick={() => handleMarkAsPaid(b.bookingCode)} className="btn-paid" title="Konfirmasi Lunas">
                                    <FaCheck /> Lunas
                                  </button>
                                )}
                                {b.paymentStatus === 'Awaiting Confirmation' && (
                                  <span style={{fontSize:'0.65rem',color:'#3b82f6',fontStyle:'italic',whiteSpace:'nowrap'}}>Tunggu Owner</span>
                                )}
                                <button onClick={() => handleCancelBooking(b.bookingCode)} className="btn-cancel" title="Batalkan">
                                  <FaTrash />
                                </button>
>>>>>>> upstream/main
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ROOM STATUS ── */}
        {activeNav === 'rooms' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Status Kamar</h1>
                <p className="pg-sub">Total <strong>{rooms.length} kamar</strong> — {availableRooms} tersedia, {occupiedRooms} terpesan.</p>
              </div>
<<<<<<< HEAD
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
            </div>

            {[1, 2].map(flr => {
              const flrRooms = rooms.filter(r => getRoomFloor(r.id_room) === flr);
              const flrLabel = flr === 1 ? 'Lantai 1 — Economy & Standard Room' : 'Lantai 2 — VIP Suite';
              const flrColor = flr === 1 ? '#3b82f6' : '#d97706';
              const flrAvail = flrRooms.filter(r => !getRoomBooking(r)).length;
              return (
                <div key={flr} className="cc" style={{marginBottom:'20px'}}>
                  <div className="cc-hdr">
                    <h2 className="cc-title" style={{color: flrColor}}>{flrLabel}</h2>
                    <span style={{fontSize:'.8rem',color:'#6b7280'}}>{flrAvail} tersedia / {flrRooms.length} total</span>
=======
              <button className="refresh-btn" onClick={reloadBookings}>↻ Refresh</button>
            </div>

            {/* Floor by floor */}
            {[
              { floor: 1, label: 'Lantai 1 — Economy & Standard Room', color: '#3b82f6' },
              { floor: 2, label: 'Lantai 2 — VIP Suite',     color: '#d97706' },
            ].map(flr => {
              const flrRooms = rooms.filter(r => r.floor === flr.floor);
              return (
                <div key={flr.floor} className="cc" style={{marginBottom:'20px'}}>
                  <div className="cc-hdr">
                    <h2 className="cc-title" style={{color: flr.color}}>{flr.label}</h2>
                    <span style={{fontSize:'0.8rem',color:'#6b7280'}}>{flrRooms.filter(r=>!getRoomBooking(r)).length} tersedia / {flrRooms.length} total</span>
>>>>>>> upstream/main
                  </div>
                  <div className="rooms-floor-grid">
                    {flrRooms.map(room => {
                      const bk = getRoomBooking(room);
                      return (
<<<<<<< HEAD
                        <div key={room.id_room} className={`room-card-big ${bk ? 'rbc-occ' : 'rbc-avail'}`}>
                          <div className="rbc-top">
                            <span className="rbc-num">{room.room_number}</span>
=======
                        <div key={room.roomNumber} className={`room-card-big ${bk ? 'rbc-occ' : 'rbc-avail'}`}>
                          <div className="rbc-top">
                            <span className="rbc-num">{room.roomNumber}</span>
>>>>>>> upstream/main
                            <span className={`rbc-status ${bk ? 'st-occ' : 'st-avail'}`}>
                              {bk ? '● TERPESAN' : '● TERSEDIA'}
                            </span>
                          </div>
<<<<<<< HEAD
                          <div className="rbc-price">{formatIDR(getRoomPrice(room.id_room))}/malam</div>
                          {bk ? (
                            <div className="rbc-guest-info">
                              <p><span className="pill" style={{fontSize:'.68rem',display:'inline-block'}}>#{bk.id_booking}</span></p>
                              <p>📅 {formatDate(bk.date_in)} → {formatDate(bk.date_out)}</p>
                              <p>🌙 {getNights(bk)} malam</p>
                              <span className={`pill ${mapStatus(bk.status_payment).cssClass}`} style={{fontSize:'.68rem',marginTop:'6px',display:'inline-block'}}>
                                {mapStatus(bk.status_payment).label}
=======
                          <div className="rbc-price">{formatIDR(room.price)}/malam</div>
                          {bk ? (
                            <div className="rbc-guest-info">
                              <p><strong>{bk.guestName}</strong></p>
                              <p>📅 {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}</p>
                              <p>🌙 {bk.nights} malam · 👤 {bk.guestsCount} tamu</p>
                              <span className={`pill ${bk.paymentStatus==='Paid'?'pill-g':bk.paymentStatus==='Pay at Hotel'?'pill-o':'pill-b'}`} style={{fontSize:'0.68rem',marginTop:'6px',display:'inline-block'}}>
                                {bk.paymentStatus==='Paid'?'✓ Lunas':bk.paymentStatus==='Pay at Hotel'?'⏳ Bayar Hotel':'🔄 Menunggu'}
>>>>>>> upstream/main
                              </span>
                            </div>
                          ) : (
                            <div className="rbc-empty">Kamar siap ditempati</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeNav === 'settings' && (
          <div className="cs">
            <div className="page-hdr"><div>
              <h1 className="pg-title">Pengaturan</h1>
              <p className="pg-sub">Informasi akun portal staff.</p>
            </div></div>
            <div className="cc" style={{maxWidth:'480px'}}>
              <h2 className="cc-title" style={{marginBottom:'20px'}}>Informasi Akun</h2>
              {[['Nama',currentUser?.name||'Staff'],['Email',currentUser?.email||'staff@arca.com'],['Role','Staff']].map(([l,v])=>(
                <div key={l} className="set-row"><span>{l}</span><strong>{v}</strong></div>
              ))}
<<<<<<< HEAD
              <button onClick={() => { clearAuth(); window.location.href='/staff/login'; }}
=======
              <button onClick={() => { localStorage.removeItem('currentUser'); window.location.href='/staff/login'; }}
>>>>>>> upstream/main
                style={{marginTop:'24px',background:'#ef4444',color:'white',border:'none',padding:'11px 22px',borderRadius:'8px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
<<<<<<< HEAD
        .portal-layout{display:flex;min-height:100vh;font-family:'Inter',sans-serif;background:#f5f5f4}
=======
        /* Layout */
        .portal-layout{display:flex;min-height:100vh;font-family:'Inter',sans-serif;background:#f5f5f4}
        /* Sidebar */
>>>>>>> upstream/main
        .sidebar{width:220px;min-width:220px;background:#fff;border-right:1px solid #e8e8e4;display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;box-shadow:2px 0 12px rgba(0,0,0,.04)}
        .sb-brand{display:flex;align-items:center;gap:12px;padding:24px 20px 20px;border-bottom:1px solid #f0ede8}
        .sb-brand-text{display:flex;flex-direction:column;line-height:1.2}
        .sb-portal{font-family:var(--font-title);font-size:1rem;font-weight:700;color:var(--color-gold);letter-spacing:.5px}
        .sb-sub{font-size:.58rem;font-weight:500;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase}
        .sb-nav{padding:20px 12px;flex:1;display:flex;flex-direction:column;gap:4px}
        .nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;border:none;background:none;cursor:pointer;font-size:.88rem;font-weight:500;color:#6b7280;text-align:left;transition:all .18s;width:100%}
        .nav-item:hover{background:#fdf8ed;color:var(--color-blue-deep)}
        .nav-item.active{background:#fdf8ed;color:var(--color-gold);font-weight:600;border-left:3px solid var(--color-gold)}
        .nav-icon{font-size:.95rem;width:18px;text-align:center;flex-shrink:0}
<<<<<<< HEAD
        .new-booking-btn{margin:0 16px 16px;display:block;text-align:center;padding:11px;background:linear-gradient(135deg,var(--color-gold),#d4a84b);color:#fff;font-size:.75rem;font-weight:700;letter-spacing:1.5px;border-radius:10px;transition:all .2s;box-shadow:0 4px 12px rgba(197,160,89,.3);text-decoration:none}
=======
        .new-booking-btn{margin:0 16px 16px;display:block;text-align:center;padding:11px;background:linear-gradient(135deg,var(--color-gold),#d4a84b);color:#fff;font-size:.75rem;font-weight:700;letter-spacing:1.5px;border-radius:10px;transition:all .2s;box-shadow:0 4px 12px rgba(197,160,89,.3)}
>>>>>>> upstream/main
        .new-booking-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(197,160,89,.4)}
        .sb-bottom{padding:16px;border-top:1px solid #f0ede8;display:flex;flex-direction:column;gap:8px}
        .sb-link,.sb-logout{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:.84rem;font-weight:500;color:#6b7280;background:none;border:none;cursor:pointer;transition:all .18s;text-decoration:none;width:100%;text-align:left}
        .sb-link:hover{background:#f0f9f0;color:#16a34a}
        .sb-logout:hover{background:#fef2f2;color:#ef4444}
        .sb-avatar{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:#f9f8f6;margin-top:4px}
        .av-circle{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--color-blue-deep),#1a5276);display:flex;align-items:center;justify-content:center;color:var(--color-gold);font-size:.85rem;flex-shrink:0}
        .av-info{display:flex;flex-direction:column;line-height:1.2;overflow:hidden}
        .av-name{font-size:.82rem;font-weight:600;color:var(--color-blue-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .av-role{font-size:.68rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px}
<<<<<<< HEAD
=======
        /* Main */
>>>>>>> upstream/main
        .main-content{margin-left:220px;flex:1;min-height:100vh;min-width:0;width:calc(100% - 220px)}
        .cs{padding:36px 40px}
        .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
        .pg-title{font-family:var(--font-title);font-size:1.85rem;color:var(--color-blue-deep);font-weight:700;margin-bottom:5px}
        .pg-sub{color:#6b7280;font-size:.9rem}
        .refresh-btn{background:#fff;border:1px solid #e8e8e4;color:var(--color-gold);padding:8px 16px;border-radius:8px;font-weight:600;font-size:.82rem;cursor:pointer;transition:all .2s}
        .refresh-btn:hover{background:var(--color-gold);color:#fff}
<<<<<<< HEAD
=======
        /* Stats */
>>>>>>> upstream/main
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:24px}
        .stat-card{background:#fff;border-radius:14px;padding:20px;display:flex;align-items:center;gap:14px;border:1px solid #e8e8e4;box-shadow:0 2px 8px rgba(0,0,0,.03);transition:box-shadow .2s}
        .stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .stat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0}
        .si-blue{background:#eff6ff;color:#3b82f6}.si-green{background:#f0fdf4;color:#16a34a}.si-orange{background:#fff7ed;color:#ea580c}.si-teal{background:#f0fdfa;color:#0d9488}
        .stat-info{display:flex;flex-direction:column;gap:3px}
        .stat-label{font-size:.78rem;color:#6b7280;font-weight:500}
        .stat-value{font-size:1.7rem;font-weight:700;color:var(--color-blue-deep);line-height:1}
<<<<<<< HEAD
=======
        /* Content Card */
>>>>>>> upstream/main
        .cc{background:#fff;border-radius:14px;padding:26px;border:1px solid #e8e8e4;box-shadow:0 2px 8px rgba(0,0,0,.03);margin-bottom:22px}
        .cc-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #f0ede8}
        .cc-title{font-family:var(--font-title);font-size:1.1rem;color:var(--color-blue-deep);font-weight:600}
        .badge-cnt{background:var(--color-gold);color:#fff;font-size:.68rem;padding:2px 8px;border-radius:20px;font-weight:600;margin-left:8px}
        .view-all{background:none;border:none;color:var(--color-gold);font-size:.84rem;font-weight:600;cursor:pointer}
<<<<<<< HEAD
        .room-grid-mini{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
        .rgm-card{border-radius:8px;padding:8px 6px;text-align:center;border:1px solid;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .2s}
=======
        /* Room mini grid (dashboard) */
        .room-grid-mini{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
        .rgm-card{border-radius:8px;padding:8px 6px;text-align:center;border:1px solid;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .2s;position:relative}
>>>>>>> upstream/main
        .rgm-avail{background:#f0fdf4;border-color:#bbf7d0}.rgm-occ{background:#fef2f2;border-color:#fecaca}
        .rgm-num{font-weight:800;font-size:.9rem;color:var(--color-blue-deep);font-family:'Courier New',monospace}
        .rgm-type{font-size:.55rem;color:#6b7280;text-transform:uppercase;letter-spacing:.5px}
        .rgm-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .dot-green{background:#16a34a}.dot-red{background:#ef4444}
<<<<<<< HEAD
=======
        .rgm-guest{font-size:.6rem;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
        /* Table */
>>>>>>> upstream/main
        .table-responsive{width:100%;overflow-x:auto;border-radius:8px}
        .dt{width:100%;border-collapse:collapse;font-size:.84rem;min-width:900px}
        .dt th{background:#f9f8f6;color:#374151;font-weight:600;font-size:.74rem;text-transform:uppercase;letter-spacing:.5px;padding:11px 12px;text-align:left;border-bottom:2px solid #e8e8e4;white-space:nowrap}
        .dt td{padding:12px;border-bottom:1px solid #f0ede8;color:#374151;vertical-align:middle}
        .dt tr:hover td{background:#fdf8ed}
        .dt tr:last-child td{border-bottom:none}
<<<<<<< HEAD
        .code-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,var(--color-blue-deep),#1a5276);color:var(--color-gold);padding:4px 9px;border-radius:6px;font-size:.72rem;font-weight:700;font-family:'Courier New',monospace;white-space:nowrap}
        .room-num-badge{display:inline-block;background:#fdf8ed;color:#b45309;border:1px solid #f5e6c0;padding:2px 7px;border-radius:5px;font-size:.75rem;font-weight:700;font-family:'Courier New',monospace;margin-right:5px}
        .room-tag{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 8px;border-radius:5px;font-size:.73rem;font-weight:600;white-space:nowrap}
        .date-cell{white-space:nowrap;font-size:.82rem}
        .dur-badge{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 7px;border-radius:5px;font-size:.73rem;font-weight:600;white-space:nowrap}
=======
        /* Badges */
        .code-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,var(--color-blue-deep),#1a5276);color:var(--color-gold);padding:4px 9px;border-radius:6px;font-size:.72rem;font-weight:700;font-family:'Courier New',monospace;white-space:nowrap}
        .room-num-badge{display:inline-block;background:#fdf8ed;color:var(--color-gold-hover);border:1px solid #f5e6c0;padding:2px 7px;border-radius:5px;font-size:.75rem;font-weight:700;font-family:'Courier New',monospace;margin-right:5px}
        .room-tag{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 8px;border-radius:5px;font-size:.73rem;font-weight:600;white-space:nowrap}
        .date-cell{white-space:nowrap;font-size:.82rem}
        .dur-badge{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 7px;border-radius:5px;font-size:.73rem;font-weight:600;white-space:nowrap}
        .drink-tag{background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;padding:2px 7px;border-radius:5px;font-size:.7rem;font-weight:500;white-space:nowrap}
>>>>>>> upstream/main
        .pill{display:inline-block;padding:3px 9px;border-radius:20px;font-size:.7rem;font-weight:600;white-space:nowrap}
        .pill-g{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
        .pill-o{background:#fff7ed;color:#ea580c;border:1px solid #fed7aa}
        .pill-b{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe}
        .pill-r{background:#fef2f2;color:#ef4444;border:1px solid #fecaca}
<<<<<<< HEAD
=======
        /* Action Buttons */
>>>>>>> upstream/main
        .btn-paid{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;font-size:.73rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#16a34a,#15803d);border:none;border-radius:6px;cursor:pointer;transition:all .2s;white-space:nowrap}
        .btn-paid:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(22,163,74,.3)}
        .btn-cancel{display:inline-flex;align-items:center;gap:4px;padding:5px 9px;font-size:.73rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);border:none;border-radius:6px;cursor:pointer;transition:all .2s}
        .btn-cancel:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(239,68,68,.3)}
<<<<<<< HEAD
=======
        /* Floor room cards */
>>>>>>> upstream/main
        .rooms-floor-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .room-card-big{border-radius:12px;padding:16px;border:1px solid;transition:all .2s}
        .rbc-avail{background:#f0fdf4;border-color:#bbf7d0}
        .rbc-occ{background:#fff5f5;border-color:#fecaca}
        .rbc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .rbc-num{font-size:1.3rem;font-weight:800;color:var(--color-blue-deep);font-family:'Courier New',monospace}
        .rbc-status{font-size:.65rem;font-weight:700;letter-spacing:.5px}
        .st-avail{color:#16a34a}.st-occ{color:#ef4444}
        .rbc-price{font-size:.78rem;color:#6b7280;margin-bottom:10px}
        .rbc-guest-info{font-size:.78rem;color:#374151;line-height:1.5;background:rgba(255,255,255,.7);padding:10px;border-radius:8px}
        .rbc-guest-info p{margin:0 0 2px}
        .rbc-empty{font-size:.78rem;color:#16a34a;font-style:italic;padding:8px 0}
<<<<<<< HEAD
=======
        /* Empty / Settings */
>>>>>>> upstream/main
        .empty-state{padding:40px 20px;text-align:center;color:#9ca3af;background:#fafaf9;border-radius:10px;border:1px dashed #d1d5db}
        .set-row{display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #f0ede8;font-size:.9rem}
        .set-row span:first-child{color:#6b7280}
        .set-row strong{color:var(--color-blue-deep)}
<<<<<<< HEAD
        .toast{position:fixed;top:22px;right:22px;background:rgba(10,37,64,.96);backdrop-filter:blur(10px);color:#fff;padding:13px 20px;border-radius:12px;border:1px solid var(--color-gold);box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;align-items:center;gap:10px;z-index:2000;font-size:.88rem;font-weight:500;animation:slideInR .3s both}
        .toast-err{border-color:#ef4444;background:rgba(127,29,29,.95)}
        @keyframes slideInR{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
=======
        /* Toast */
        .toast{position:fixed;top:22px;right:22px;background:rgba(10,37,64,.96);backdrop-filter:blur(10px);color:#fff;padding:13px 20px;border-radius:12px;border:1px solid var(--color-gold);box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;align-items:center;gap:10px;z-index:2000;font-size:.88rem;font-weight:500;animation:slideInR .3s both}
        .toast-err{border-color:#ef4444;background:rgba(127,29,29,.95)}
        @keyframes slideInR{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        /* Responsive */
>>>>>>> upstream/main
        @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.room-grid-mini{grid-template-columns:repeat(6,1fr)}.rooms-floor-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:768px){.main-content{margin-left:0;width:100%}.cs{padding:20px 16px}.stats-grid{grid-template-columns:1fr 1fr}.room-grid-mini{grid-template-columns:repeat(4,1fr)}.rooms-floor-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
