"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaBed, FaCalendarAlt, FaUser, FaCheckCircle, FaLock,
  FaSignOutAlt, FaCheck, FaTrash, FaTachometerAlt, FaListAlt,
  FaCog, FaHome, FaTicketAlt, FaMoneyBillWave, FaChartLine,
  FaSave, FaClipboardList, FaUniversity, FaDoorOpen
} from 'react-icons/fa';
import { getRooms, getRoomTypes, getBookings, getCustomers, createPayment, updateBooking, deleteBooking, updateRoomType, clearAuth } from '../../services/api';

export default function OwnerDashboardPage() {
  const [rooms, setRooms]               = useState([]);
  const [bookings, setBookings]         = useState([]);
  const [roomTypes, setRoomTypes]       = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType]       = useState('success');
  const [activeNav, setActiveNav]       = useState('dashboard');
  const [currentUser, setCurrentUser]   = useState(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Build a map from id_room → room object for quick lookup
  const roomMap = {};
  for (const r of rooms) roomMap[r.id_room] = r;

  const loadData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([getRooms(), getBookings()]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (e) {}
    try {
      const rt = await getRoomTypes();
      setRoomTypes(rt);
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role === 'owner') {
          setIsAuthorized(true);
          loadData();
        }
      } catch (e) {}
    }
    setCheckingAuth(false);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg); setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ── Helpers ─────────────────────────────────────────────────
  const getRoomName = (idRoom) => roomMap[idRoom]?.room_type?.name || '-';
  const getRoomNumber = (idRoom) => roomMap[idRoom]?.room_number || '-';
  const getRoomPrice = (idRoom) => roomMap[idRoom]?.room_type?.price || 0;

  const getNights = (b) => {
    if (!b.date_in || !b.date_out) return 1;
    try {
      const d1 = new Date(b.date_in);
      const d2 = new Date(b.date_out);
      return Math.max(1, Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)));
    } catch { return 1; }
  };

  const formatIDR = (n) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n||0);
  const formatDate = (s) => {
    if (!s) return '-';
    try {
      const d = new Date(s);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
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
    bookings.find(b =>
      b.id_room === room.id_room && b.status_payment !== 'cancelled'
    ) || null;

  // ── Statistics ───────────────────────────────────────────────
  const paidBookets     = bookings.filter(b => b.status_payment === 'paid');
  const awaitingTF      = bookings.filter(b => b.status_payment === 'waiting_confirmation');
  const payHotel        = bookings.filter(b => b.status_payment === 'pay_at_hotel');
  const awaiting        = bookings.filter(b => b.status_payment === 'pending');

  const confirmedRevenue   = paidBookets.reduce((s,b) => s + (b.total_payment || 0), 0);
  const pendingTFRevenue   = awaitingTF.reduce((s,b)  => s + (b.total_payment || 0), 0);
  const pendingCashRevenue = payHotel.reduce((s,b)    => s + (b.total_payment || 0), 0);
  const totalExpected      = bookings.filter(b=>b.status_payment !== 'cancelled')
                                    .reduce((s,b) => s + (b.total_payment || 0), 0);

  const occupiedCount  = rooms.filter(r => getRoomBooking(r)).length;
  const availableCount = rooms.length - occupiedCount;

  // Revenue by room type
  const revenueByType = ['Economy Room','Standard Room','VIP Suite'].map(typeName => {
    const paid = paidBookets.filter(b => getRoomName(b.id_room) === typeName);
    return { name: typeName, revenue: paid.reduce((s,b)=>s+(b.total_payment||0),0), count: paid.length };
  });
  const maxRev = Math.max(...revenueByType.map(r => r.revenue), 1);

  // ── Actions ──────────────────────────────────────────────────
  const handleMarkAsPaid = async (idBooking) => {
    const booking = bookings.find(b => b.id_booking === idBooking);
    if (!booking) return;

    const method = booking.status_payment === 'pay_at_hotel' ? 'cash' : 'transfer';
    try {
      await Promise.all([
        createPayment({
          id_booking: idBooking,
          total_payment: booking.total_payment,
          method,
          status: 'paid'
        }),
        updateBooking(idBooking, { status_payment: 'paid' })
      ]);
      showToast(`Booking #${idBooking} berhasil dikonfirmasi Lunas!`);
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

  const handlePriceChange = (typeId, val) =>
    setRoomTypes(prev => prev.map(rt => rt.id_room_type === typeId ? {...rt, price: Number(val)} : rt));

  const handleSavePrices = async () => {
    try {
      for (const rt of roomTypes) {
        await updateRoomType(rt.id_room_type, { price: rt.price });
      }
      showToast('Harga kamar berhasil disimpan!');
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan harga.', 'error');
    }
  };

  const navItems = [
    { id:'dashboard', label:'Dashboard',    icon:<FaTachometerAlt /> },
    { id:'bookings',  label:'Booking List', icon:<FaCalendarAlt /> },
    { id:'analytics', label:'Revenue',      icon:<FaChartLine /> },
    { id:'pricing',   label:'Room Pricing', icon:<FaBed /> },
    { id:'settings',  label:'Settings',     icon:<FaCog /> },
  ];

  // ── Trend Chart Calculations ─────────────────────────────────
  const getTrendData = () => {
    const data = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const dayBks = bookings.filter(b => {
        if (!b.date_in) return false;
        const bin = new Date(b.date_in);
        return bin.toISOString().split('T')[0] === dateStr && b.status_payment !== 'cancelled';
      });
      const paidRev = dayBks.filter(b => b.status_payment === 'paid').reduce((s, b) => s + (b.total_payment || 0), 0);
      const totalRev = dayBks.reduce((s, b) => s + (b.total_payment || 0), 0);

      const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      data.push({ dateStr, label, paidRev, totalRev });
    }
    return data;
  };

  const trendData = getTrendData();
  const maxRevenueInTrend = Math.max(...trendData.map(d => d.totalRev), 350000);

  const chartWidth = 800;
  const chartHeight = 220;
  const paddingX = 75;
  const paddingY = 25;
  const paddingRight = 30;
  const paddingBottom = 35;

  const points = trendData.map((d, index) => {
    const x = paddingX + (index * (chartWidth - paddingX - paddingRight)) / (trendData.length - 1);
    const yPaid = chartHeight - paddingBottom - (d.paidRev / maxRevenueInTrend) * (chartHeight - paddingY - paddingBottom);
    const yTotal = chartHeight - paddingBottom - (d.totalRev / maxRevenueInTrend) * (chartHeight - paddingY - paddingBottom);
    return { x, yPaid, yTotal, ...d };
  });

  let areaPaidPath = "";
  let linePaidPath = "";
  let lineTotalPath = "";

  if (points.length > 0) {
    linePaidPath = `M ${points[0].x} ${points[0].yPaid} ` + points.slice(1).map(p => `L ${p.x} ${p.yPaid}`).join(' ');
    areaPaidPath = `${linePaidPath} L ${points[points.length-1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`;
    lineTotalPath = `M ${points[0].x} ${points[0].yTotal} ` + points.slice(1).map(p => `L ${p.x} ${p.yTotal}`).join(' ');
  }

  // Donut Chart calculations
  const getDonutData = () => {
    const counts = {};
    bookings.filter(b => b.status_payment !== 'cancelled').forEach(b => {
      const name = getRoomName(b.id_room);
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = Object.values(counts).reduce((s, c) => s + c, 0);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  };
  const donutData = getDonutData();
  const totalBookingsCount = bookings.filter(b => b.status_payment !== 'cancelled').length;

  let accumulatedPercent = 0;
  const donutCircles = donutData.map((d, i) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(d.percentage * circumference) / 100} ${circumference}`;
    const strokeDashoffset = `${- (accumulatedPercent * circumference) / 100}`;
    accumulatedPercent += d.percentage;

    const colors = ['var(--color-gold)', '#3b82f6', '#10b981'];
    return { ...d, radius, circumference, strokeDasharray, strokeDashoffset, color: colors[i] };
  });

  // ── Auth guards ───────────────────────────────────────────────
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
        <p>Anda harus masuk sebagai <strong>Owner</strong> untuk mengakses portal ini.</p>
        <div className="ad-actions">
          <Link href="/owner/login" className="btn-gold">Login Sebagai Owner</Link>
          <Link href="/" className="ad-back">Kembali ke Halaman Utama</Link>
        </div>
      </div>
      <style jsx>{`.ad-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f4;padding:20px;font-family:'Inter',sans-serif}.ad-card{background:white;max-width:420px;width:100%;padding:48px 40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.08);text-align:center}.ad-lock{font-size:3rem;color:#ef4444;margin-bottom:20px}.ad-card h2{font-family:var(--font-title);color:var(--color-blue-deep);font-size:1.6rem;font-weight:700;margin-bottom:12px}.ad-card p{color:var(--color-text-light);font-size:.95rem;margin-bottom:30px;line-height:1.5}.ad-actions{display:flex;flex-direction:column;gap:15px;align-items:center}.btn-gold{background-color:var(--color-gold);color:#fff;padding:12px 30px;font-weight:600;text-transform:uppercase;font-size:.8rem;letter-spacing:1px;border-radius:var(--radius-sm)}.ad-back{font-size:.9rem;color:var(--color-text-light);font-weight:500}`}</style>
    </div>
  );

  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <div className="sb-brand">
          <img src="/assets/logo.png" alt="Hotel Arca" style={{height:'36px',width:'auto'}} />
          <div className="sb-brand-text">
            <span className="sb-portal">Owner Portal</span>
            <span className="sb-sub">ARCA MANAGEMENT</span>
          </div>
        </div>
        <nav className="sb-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`nav-item ${activeNav===item.id?'active':''}`}
              onClick={() => setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sb-bottom">
          <Link href="/" className="sb-link"><FaHome /><span>Back to Website</span></Link>
          <button onClick={() => { clearAuth(); window.location.href='/owner/login'; }} className="sb-logout">
            <FaSignOutAlt /><span>Logout</span>
          </button>
          <div className="sb-avatar">
            <div className="av-circle"><FaUser /></div>
            <div className="av-info">
              <span className="av-name">{currentUser?.name||'Owner'}</span>
              <span className="av-role">Owner</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {toastMessage && (
          <div className={`toast ${toastType==='error'?'toast-err':''}`}>
            {toastType==='error' ? '⚠' : <FaCheckCircle style={{color:'var(--color-gold)'}} />}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeNav === 'dashboard' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Executive Overview</h1>
                <p className="pg-sub">Live performance — Arca Hotel · {new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
            </div>

            <div className="rev-cards-row">
              <div className="rev-card rev-confirmed">
                <div className="rc-top"><FaCheckCircle className="rc-icon" /><span className="rc-label">Revenue Terkonfirmasi</span></div>
                <div className="rc-value">{formatIDR(confirmedRevenue)}</div>
                <div className="rc-sub">{paidBookets.length} booking Lunas</div>
              </div>
              <div className="rev-card rev-pending-tf">
                <div className="rc-top"><FaUniversity className="rc-icon" /><span className="rc-label">Pending Transfer Bank</span></div>
                <div className="rc-value">{formatIDR(pendingTFRevenue)}</div>
                <div className="rc-sub">{awaitingTF.length} booking menunggu konfirmasi</div>
              </div>
              <div className="rev-card rev-pending-cash">
                <div className="rc-top"><FaMoneyBillWave className="rc-icon" /><span className="rc-label">Pending Bayar di Hotel</span></div>
                <div className="rc-value">{formatIDR(pendingCashRevenue)}</div>
                <div className="rc-sub">{payHotel.length} booking bayar saat check-in</div>
              </div>
              <div className="rev-card rev-total">
                <div className="rc-top"><FaChartLine className="rc-icon" /><span className="rc-label">Estimasi Total Revenue</span></div>
                <div className="rc-value">{formatIDR(totalExpected)}</div>
                <div className="rc-sub">Semua booking aktif</div>
              </div>
            </div>

            <div className="stats-grid">
              {[
                { icon:<FaClipboardList/>, label:'Total Booking',    value:bookings.length,   color:'blue' },
                { icon:<FaCheckCircle/>,   label:'Lunas',            value:paidBookets.length, color:'green' },
                { icon:<FaUniversity/>,    label:'TF Menunggu',      value:awaitingTF.length, color:'yellow' },
                { icon:<FaDoorOpen/>,      label:'Kamar Tersedia',   value:`${availableCount}/${rooms.length}`, color:'teal' },
              ].map((s,i)=>(
                <div key={i} className="stat-card">
                  <div className={`stat-icon si-${s.color}`}>{s.icon}</div>
                  <div className="stat-info">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-value">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="cc" style={{ position: 'relative' }}>
              <div className="cc-hdr">
                <h2 className="cc-title">Tren Pendapatan Harian (7 Hari Terakhir & Mendatang)</h2>
                <div style={{ display: 'flex', gap: '15px', fontSize: '.75rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--color-gold)', borderRadius: '50%' }}></span> Lunas
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', border: '1px dashed #3b82f6' }}></span> Estimasi Total
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', marginTop: '10px', overflowX: 'auto' }}>
                <svg viewBox="0 0 800 220" width="100%" height="220" style={{ overflow: 'visible', minWidth: '700px' }}>
                  <defs>
                    <linearGradient id="paidAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                    const y = paddingY + r * (chartHeight - paddingY - paddingBottom);
                    const val = maxRevenueInTrend * (1 - r);
                    return (
                      <g key={i} opacity="0.4">
                        <line x1={paddingX} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#e8e8e4" strokeWidth="1" />
                        <text x={paddingX - 10} y={y + 4} fill="#888" fontSize="10" textAnchor="end">{formatIDR(val)}</text>
                      </g>
                    );
                  })}
                  {areaPaidPath && <path d={areaPaidPath} fill="url(#paidAreaGrad)" />}
                  {linePaidPath && <path d={linePaidPath} fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" />}
                  {lineTotalPath && <path d={lineTotalPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" />}
                  {points.map((p, i) => (
                    <g key={i}>
                      <line x1={p.x} y1={paddingY} x2={p.x} y2={chartHeight - paddingBottom} stroke="#e8e8e4" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
                      <text x={p.x} y={chartHeight - 12} fill="#6b7280" fontSize="10" fontWeight="600" textAnchor="middle">{p.label}</text>
                      <rect x={p.x - 25} y={paddingY} width="50" height={chartHeight - paddingY - paddingBottom} fill="transparent" cursor="pointer"
                        onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                    </g>
                  ))}
                  {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                    <g pointerEvents="none">
                      <line x1={points[hoveredPointIndex].x} y1={paddingY} x2={points[hoveredPointIndex].x} y2={chartHeight - paddingBottom} stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.6" />
                      <circle cx={points[hoveredPointIndex].x} cy={points[hoveredPointIndex].yPaid} r="6" fill="var(--color-gold)" stroke="white" strokeWidth="2" />
                      <circle cx={points[hoveredPointIndex].x} cy={points[hoveredPointIndex].yTotal} r="4" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                      {(() => {
                        const pX = points[hoveredPointIndex].x;
                        const tooltipRectX = Math.max(10, Math.min(620, pX - 85));
                        const textX = tooltipRectX + 85;
                        const tooltipY = Math.max(10, Math.min(140, Math.min(points[hoveredPointIndex].yPaid, points[hoveredPointIndex].yTotal) - 80));
                        return (
                          <g pointerEvents="none">
                            <rect x={tooltipRectX} y={tooltipY} width="170" height="70" rx="8" fill="rgba(10, 37, 64, 0.96)" stroke="var(--color-gold)" strokeWidth="1.5" />
                            <text x={textX} y={tooltipY + 20} textAnchor="middle" fill="var(--color-gold)" style={{ fontSize: '10px', fontWeight: '700' }}>{points[hoveredPointIndex].label}</text>
                            <text x={textX - 70} y={tooltipY + 40} textAnchor="start" fill="white" style={{ fontSize: '9px' }}>✓ Lunas:</text>
                            <text x={textX + 70} y={tooltipY + 40} textAnchor="end" fill="var(--color-gold)" style={{ fontSize: '9px', fontWeight: '700' }}>{formatIDR(points[hoveredPointIndex].paidRev)}</text>
                            <text x={textX - 70} y={tooltipY + 56} textAnchor="start" fill="white" style={{ fontSize: '9px' }}>📊 Total:</text>
                            <text x={textX + 70} y={tooltipY + 56} textAnchor="end" fill="#93c5fd" style={{ fontSize: '9px', fontWeight: '700' }}>{formatIDR(points[hoveredPointIndex].totalRev)}</text>
                          </g>
                        );
                      })()}
                    </g>
                  )}
                </svg>
              </div>
            </div>

            <div className="two-col">
              <div className="cc">
                <div className="cc-hdr"><h2 className="cc-title">Revenue & Volume per Tipe Kamar</h2></div>
                <div className="revenue-widget-split">
                  <div className="rev-progress-col">
                    <h3 style={{ fontSize: '.78rem', color: '#6b7280', marginBottom: '12px', fontWeight: 600 }}>Nilai Transaksi Lunas</h3>
                    {revenueByType.map(item => (
                      <div key={item.name} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: '4px' }}>
                          <span style={{ color: '#374151', fontWeight: 600 }}>{item.name}</span>
                          <span style={{ fontWeight: 700, color: '#b45309' }}>{formatIDR(item.revenue)}</span>
                        </div>
                        <div style={{ height: '8px', background: '#f0ede8', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.round((item.revenue / maxRev) * 100)}%`, background: 'linear-gradient(90deg,var(--color-gold),#d4a84b)', borderRadius: '10px', transition: 'width .6s ease' }}></div>
                        </div>
                        <span style={{ fontSize: '.68rem', color: '#9ca3af' }}>{item.count} booking lunas</span>
                      </div>
                    ))}
                    {confirmedRevenue === 0 && (
                      <div className="empty-state" style={{ padding: '20px 0' }}><p style={{ fontSize: '.8rem' }}>Belum ada booking yang dikonfirmasi Lunas.</p></div>
                    )}
                  </div>
                  <div className="rev-donut-col">
                    <h3 style={{ fontSize: '.78rem', color: '#6b7280', marginBottom: '12px', fontWeight: 600, textAlign: 'center' }}>Volume Transaksi Aktif</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <svg viewBox="0 0 160 160" width="100" height="100">
                          <circle cx="80" cy="80" r="50" fill="none" stroke="#f0ede8" strokeWidth="14" />
                          {donutCircles.map((c, i) => (
                            <circle key={i} cx="80" cy="80" r="50" fill="none" stroke={c.color} strokeWidth="14"
                              strokeDasharray={c.strokeDasharray} strokeDashoffset={c.strokeDashoffset}
                              transform="rotate(-90 80 80)" strokeLinecap={c.percentage > 0 ? "round" : "butt"}
                              style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                          ))}
                          <circle cx="80" cy="80" r="40" fill="white" />
                          <text x="80" y="83" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--color-blue-deep)">{totalBookingsCount}</text>
                          <text x="80" y="94" textAnchor="middle" fontSize="8" fill="#888" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</text>
                        </svg>
                      </div>
                      <div className="donut-legend" style={{ width: '100%' }}>
                        {donutCircles.map((c, i) => (
                          <div key={i} className="donut-legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span className="legend-dot" style={{ backgroundColor: c.color, width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
                            <span className="legend-text" style={{ fontSize: '0.7rem', color: '#555' }}>
                              <strong>{c.count}</strong> {c.name?.split(' ')[0] || '?'} ({Math.round(c.percentage)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cc">
                <div className="cc-hdr">
                  <h2 className="cc-title">Transfer Bank — Perlu Konfirmasi</h2>
                  <button className="view-all" onClick={() => setActiveNav('bookings')}>Lihat Semua →</button>
                </div>
                {awaitingTF.length === 0 ? (
                  <div className="empty-state"><p>Tidak ada Transfer Bank yang menunggu konfirmasi.</p></div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {awaitingTF.map((b,i) => (
                      <div key={i} className="quick-item">
                        <div>
                          <span className="code-badge" style={{fontSize:'.68rem'}}><FaTicketAlt /> #{b.id_booking}</span>
                          <p style={{margin:'6px 0 2px',fontWeight:600,fontSize:'.88rem',color:'var(--color-blue-deep)'}}>{currentUser?.name || 'Tamu'}</p>
                          <p style={{margin:'0 0 2px',fontSize:'.75rem',color:'#6b7280'}}>Kamar {getRoomNumber(b.id_room)} — {getRoomName(b.id_room)}</p>
                          <p style={{margin:0,fontSize:'.75rem',color:'#6b7280'}}>Transfer Bank · {getNights(b)} malam</p>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px'}}>
                          <span style={{fontWeight:700,color:'#b45309',fontSize:'.92rem'}}>{formatIDR(b.total_payment)}</span>
                          <button onClick={() => handleMarkAsPaid(b.id_booking)} className="btn-paid">
                            <FaCheck /> Konfirmasi Lunas
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Status {rooms.length} Kamar</h2>
                <span style={{fontSize:'.8rem',color:'#6b7280'}}>{availableCount} tersedia · {occupiedCount} terpesan</span>
              </div>
              <div className="room-grid-mini">
                {rooms.map(room => {
                  const bk = getRoomBooking(room);
                  return (
                    <div key={room.id_room} className={`rgm-card ${bk?'rgm-occ':'rgm-avail'}`}>
                      <span className="rgm-num">{room.room_number}</span>
                      <span className="rgm-type">{room.room_type?.name==='Economy Room'?'ECO':room.room_type?.name==='Standard Room'?'STD':'VIP'}</span>
                      <span className={`rgm-dot ${bk?'dot-red':'dot-green'}`}></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKING LIST ── */}
        {activeNav === 'bookings' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Booking List</h1>
                <p className="pg-sub">Semua pemesanan. Owner mengkonfirmasi <strong>Transfer Bank</strong>. Staff mengkonfirmasi <strong>Cash</strong>.</p>
              </div>
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
            </div>

            <div className="rev-summary-bar">
              <div className="rsb-item"><span className="rsb-label">✓ Revenue Dikonfirmasi</span><span className="rsb-val rsb-green">{formatIDR(confirmedRevenue)}</span></div>
              <div className="rsb-sep"></div>
              <div className="rsb-item"><span className="rsb-label">🔄 Pending TF</span><span className="rsb-val rsb-blue">{formatIDR(pendingTFRevenue)}</span></div>
              <div className="rsb-sep"></div>
              <div className="rsb-item"><span className="rsb-label">⏳ Bayar Hotel</span><span className="rsb-val rsb-orange">{formatIDR(pendingCashRevenue)}</span></div>
              <div className="rsb-sep"></div>
              <div className="rsb-item"><span className="rsb-label">📊 Total Estimasi</span><span className="rsb-val rsb-gold">{formatIDR(totalExpected)}</span></div>
            </div>

            <div className="cc">
              <div className="cc-hdr">
                <h2 className="cc-title">Semua Booking <span className="badge-cnt">{bookings.length}</span></h2>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state"><FaListAlt style={{fontSize:'2rem',color:'var(--color-gold)',marginBottom:'10px'}}/><p>Belum ada booking masuk.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="dt">
                    <thead><tr>
                      <th>ID Booking</th><th>Kamar</th><th>Tipe</th>
                      <th>Check-in</th><th>Check-out</th><th>Durasi</th>
                      <th>Status</th><th>Revenue</th><th>Aksi</th>
                    </tr></thead>
                    <tbody>
                      {bookings.map((b,i) => {
                        const canConfirm = b.status_payment !== 'paid' && b.status_payment !== 'cancelled';
                        return (
                          <tr key={b.id_booking||i}>
                            <td><span className="code-badge"><FaTicketAlt /> #{b.id_booking}</span></td>
                            <td><span className="room-num-badge">{getRoomNumber(b.id_room)}</span></td>
                            <td><span className="room-tag">{getRoomName(b.id_room)}</span></td>
                            <td className="date-cell">{formatDate(b.date_in)}</td>
                            <td className="date-cell">{formatDate(b.date_out)}</td>
                            <td><span className="dur-badge">{getNights(b)} Mlm</span></td>
                            <td>
                              <span className={`pill ${mapStatus(b.status_payment).cssClass}`}>
                                {mapStatus(b.status_payment).label}
                              </span>
                            </td>
                            <td><strong style={{color:b.status_payment==='paid'?'#16a34a':'#6b7280',fontSize:'.84rem',whiteSpace:'nowrap'}}>{formatIDR(b.total_payment)}</strong></td>
                            <td>
                              <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                                {canConfirm && (
                                  <button onClick={() => handleMarkAsPaid(b.id_booking)} className="btn-paid" title="Konfirmasi Lunas">
                                    <FaCheck /> Konfirmasi
                                  </button>
                                )}
                                <button onClick={() => handleCancelBooking(b.id_booking)} className="btn-cancel" title="Batalkan">
                                  <FaTrash />
                                </button>
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

        {/* ── REVENUE ANALYTICS ── */}
        {activeNav === 'analytics' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Revenue & Analitik</h1>
                <p className="pg-sub">Laporan keuangan Hotel Arca.</p>
              </div>
              <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
            </div>

            <div className="rev-hero">
              <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
                <FaMoneyBillWave style={{fontSize:'2.8rem',color:'var(--color-gold)'}} />
                <div>
                  <p style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'.5px'}}>Revenue Terkonfirmasi</p>
                  <p style={{fontSize:'2.2rem',fontWeight:800,color:'var(--color-gold)',lineHeight:1}}>{formatIDR(confirmedRevenue)}</p>
                  <p style={{fontSize:'.75rem',color:'rgba(255,255,255,.5)',marginTop:'4px'}}>Estimasi total semua booking: {formatIDR(totalExpected)}</p>
                </div>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                <span className="rev-pill rp-green">✓ Lunas: {paidBookets.length}</span>
                <span className="rev-pill rp-blue">🔄 TF Pending: {awaitingTF.length}</span>
                <span className="rev-pill rp-orange">⏳ Bayar Hotel: {payHotel.length}</span>
                <span className="rev-pill rp-red">⚠ Belum Bayar: {awaiting.length}</span>
              </div>
            </div>

            <div className="rev-cards-row" style={{marginBottom:'24px'}}>
              <div className="rev-card rev-confirmed">
                <div className="rc-top"><FaCheckCircle className="rc-icon" /><span className="rc-label">Terkonfirmasi</span></div>
                <div className="rc-value">{formatIDR(confirmedRevenue)}</div>
                <div className="rc-sub">{paidBookets.length} booking</div>
              </div>
              <div className="rev-card rev-pending-tf">
                <div className="rc-top"><FaUniversity className="rc-icon" /><span className="rc-label">TF Pending</span></div>
                <div className="rc-value">{formatIDR(pendingTFRevenue)}</div>
                <div className="rc-sub">{awaitingTF.length} booking</div>
              </div>
              <div className="rev-card rev-pending-cash">
                <div className="rc-top"><FaMoneyBillWave className="rc-icon" /><span className="rc-label">Cash Pending</span></div>
                <div className="rc-value">{formatIDR(pendingCashRevenue)}</div>
                <div className="rc-sub">{payHotel.length} booking</div>
              </div>
              <div className="rev-card rev-total">
                <div className="rc-top"><FaChartLine className="rc-icon" /><span className="rc-label">Estimasi Total</span></div>
                <div className="rc-value">{formatIDR(totalExpected)}</div>
                <div className="rc-sub">Semua booking aktif</div>
              </div>
            </div>

            <div className="cc">
              <div className="cc-hdr"><h2 className="cc-title">Revenue per Tipe Kamar (Booking Lunas)</h2></div>
              {revenueByType.map(item => (
                <div key={item.name} style={{marginBottom:'18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'.92rem',marginBottom:'7px'}}>
                    <span style={{color:'#374151',fontWeight:600}}>{item.name}</span>
                    <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                      <span style={{fontSize:'.75rem',color:'#9ca3af'}}>{item.count} booking</span>
                      <span style={{fontWeight:800,color:'#b45309',fontSize:'1rem'}}>{formatIDR(item.revenue)}</span>
                    </div>
                  </div>
                  <div style={{height:'12px',background:'#f0ede8',borderRadius:'10px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${Math.round((item.revenue/maxRev)*100)}%`,background:'linear-gradient(90deg,var(--color-gold),#d4a84b)',borderRadius:'10px',transition:'width .6s ease',minWidth:item.revenue>0?'8px':0}}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cc">
              <div className="cc-hdr"><h2 className="cc-title">Daftar Booking Lunas <span className="badge-cnt">{paidBookets.length}</span></h2></div>
              {paidBookets.length === 0 ? (
                <div className="empty-state"><p>Belum ada booking yang dikonfirmasi Lunas.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="dt">
                    <thead><tr>
                      <th>ID</th><th>No. Kamar</th><th>Tipe</th>
                      <th>Check-in</th><th>Check-out</th><th>Durasi</th>
                      <th>Revenue</th>
                    </tr></thead>
                    <tbody>
                      {paidBookets.map((b,i) => (
                        <tr key={b.id_booking||i}>
                          <td><span className="code-badge"><FaTicketAlt /> #{b.id_booking}</span></td>
                          <td><span className="room-num-badge">{getRoomNumber(b.id_room)}</span></td>
                          <td><span className="room-tag">{getRoomName(b.id_room)}</span></td>
                          <td className="date-cell">{formatDate(b.date_in)}</td>
                          <td className="date-cell">{formatDate(b.date_out)}</td>
                          <td><span className="dur-badge">{getNights(b)} Mlm</span></td>
                          <td><strong style={{color:'#16a34a',fontSize:'.88rem'}}>{formatIDR(b.total_payment)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ROOM PRICING ── */}
        {activeNav === 'pricing' && (
          <div className="cs">
            <div className="page-hdr">
              <div>
                <h1 className="pg-title">Kelola Harga Kamar</h1>
                <p className="pg-sub">Ubah harga per malam untuk setiap tipe kamar. Perubahan langsung tersinkron ke halaman booking.</p>
              </div>
            </div>
            {roomTypes.map(rt => (
              <div key={rt.id_room_type} className="cc" style={{maxWidth:'600px',marginBottom:'20px'}}>
                <div className="cc-hdr">
                  <h2 className="cc-title">{rt.name}</h2>
                </div>
                <p style={{fontSize:'.82rem',color:'#6b7280',marginBottom:'16px'}}>
                  {rt.description || ''}
                </p>
                <div className="price-row">
                  <div>
                    <strong style={{display:'block',color:'var(--color-blue-deep)',marginBottom:'3px'}}>Harga per Malam</strong>
                    <span style={{fontSize:'.8rem',color:'#6b7280'}}>Berlaku untuk semua kamar tipe {rt.name}</span>
                  </div>
                  <div className="price-input-group">
                    <span className="currency-prefix">Rp</span>
                    <input type="number" value={rt.price}
                      onChange={(e) => handlePriceChange(rt.id_room_type, e.target.value)}
                      className="price-input" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={handleSavePrices} className="save-btn">
              <FaSave /> Simpan Semua Harga
            </button>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeNav === 'settings' && (
          <div className="cs">
            <div className="page-hdr"><div>
              <h1 className="pg-title">Pengaturan</h1>
              <p className="pg-sub">Informasi akun portal owner.</p>
            </div></div>
            <div className="cc" style={{maxWidth:'480px'}}>
              <h2 className="cc-title" style={{marginBottom:'20px'}}>Informasi Akun</h2>
              {[['Nama',currentUser?.name||'Owner'],['Email',currentUser?.email||'owner@arca.com'],['Role','Owner']].map(([l,v])=>(
                <div key={l} className="set-row"><span>{l}</span><strong>{v}</strong></div>
              ))}
              <button onClick={() => { clearAuth(); window.location.href='/owner/login'; }}
                style={{marginTop:'24px',background:'#ef4444',color:'white',border:'none',padding:'11px 22px',borderRadius:'8px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .revenue-widget-split { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: start; }
        .rev-progress-col { display: flex; flex-direction: column; }
        .rev-donut-col { display: flex; flex-direction: column; border-left: 1px solid #f0ede8; padding-left: 20px; }
        .donut-legend { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
        @media(max-width: 900px) { .revenue-widget-split { grid-template-columns: 1fr; gap: 20px; } .rev-donut-col { border-left: none; padding-left: 0; border-top: 1px solid #f0ede8; padding-top: 16px; } }
        .portal-layout{display:flex;min-height:100vh;font-family:'Inter',sans-serif;background:#f5f5f4}
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
        .sb-bottom{padding:16px;border-top:1px solid #f0ede8;display:flex;flex-direction:column;gap:8px}
        .sb-link,.sb-logout{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:.84rem;font-weight:500;color:#6b7280;background:none;border:none;cursor:pointer;transition:all .18s;text-decoration:none;width:100%;text-align:left}
        .sb-link:hover{background:#f0f9f0;color:#16a34a}.sb-logout:hover{background:#fef2f2;color:#ef4444}
        .sb-avatar{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:#f9f8f6;margin-top:4px}
        .av-circle{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--color-gold),#d4a84b);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.85rem;flex-shrink:0}
        .av-info{display:flex;flex-direction:column;line-height:1.2;overflow:hidden}
        .av-name{font-size:.82rem;font-weight:600;color:var(--color-blue-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .av-role{font-size:.68rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px}
        .main-content{margin-left:220px;flex:1;min-height:100vh;min-width:0;width:calc(100% - 220px)}
        .cs{padding:36px 40px}
        .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
        .pg-title{font-family:var(--font-title);font-size:1.85rem;color:var(--color-blue-deep);font-weight:700;margin-bottom:5px}
        .pg-sub{color:#6b7280;font-size:.9rem}
        .refresh-btn{background:#fff;border:1px solid #e8e8e4;color:var(--color-gold);padding:8px 16px;border-radius:8px;font-weight:600;font-size:.82rem;cursor:pointer;transition:all .2s}
        .refresh-btn:hover{background:var(--color-gold);color:#fff}
        .rev-cards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .rev-card{border-radius:14px;padding:20px;border:1px solid}
        .rev-confirmed{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#bbf7d0}
        .rev-pending-tf{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#bfdbfe}
        .rev-pending-cash{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fed7aa}
        .rev-total{background:linear-gradient(135deg,#fdf8ed,#fef3c7);border-color:#fde68a}
        .rc-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .rc-icon{font-size:1.1rem}
        .rev-confirmed .rc-icon{color:#16a34a}.rev-pending-tf .rc-icon{color:#3b82f6}.rev-pending-cash .rc-icon{color:#ea580c}.rev-total .rc-icon{color:#d97706}
        .rc-label{font-size:.75rem;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:.5px}
        .rc-value{font-size:1.3rem;font-weight:800;color:#111827;margin-bottom:4px;line-height:1}
        .rc-sub{font-size:.72rem;color:#6b7280}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:24px}
        .stat-card{background:#fff;border-radius:14px;padding:20px;display:flex;align-items:center;gap:14px;border:1px solid #e8e8e4;box-shadow:0 2px 8px rgba(0,0,0,.03);transition:box-shadow .2s}
        .stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .stat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0}
        .si-blue{background:#eff6ff;color:#3b82f6}.si-green{background:#f0fdf4;color:#16a34a}.si-yellow{background:#fefce8;color:#ca8a04}.si-teal{background:#f0fdfa;color:#0d9488}
        .stat-info{display:flex;flex-direction:column;gap:3px}
        .stat-label{font-size:.78rem;color:#6b7280;font-weight:500}
        .stat-value{font-size:1.7rem;font-weight:700;color:var(--color-blue-deep);line-height:1}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px}
        .cc{background:#fff;border-radius:14px;padding:26px;border:1px solid #e8e8e4;box-shadow:0 2px 8px rgba(0,0,0,.03);margin-bottom:22px}
        .cc-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #f0ede8}
        .cc-title{font-family:var(--font-title);font-size:1.1rem;color:var(--color-blue-deep);font-weight:600}
        .badge-cnt{background:var(--color-gold);color:#fff;font-size:.68rem;padding:2px 8px;border-radius:20px;font-weight:600;margin-left:8px}
        .view-all{background:none;border:none;color:var(--color-gold);font-size:.84rem;font-weight:600;cursor:pointer}
        .rev-summary-bar{display:flex;align-items:center;background:#fff;border:1px solid #e8e8e4;border-radius:12px;padding:16px 24px;margin-bottom:20px;gap:0}
        .rsb-item{display:flex;flex-direction:column;gap:4px;flex:1;text-align:center}
        .rsb-sep{width:1px;height:36px;background:#e8e8e4;flex-shrink:0}
        .rsb-label{font-size:.72rem;color:#6b7280;font-weight:500}
        .rsb-val{font-size:1rem;font-weight:800}
        .rsb-green{color:#16a34a}.rsb-blue{color:#3b82f6}.rsb-orange{color:#ea580c}.rsb-gold{color:#b45309}
        .room-grid-mini{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
        .rgm-card{border-radius:8px;padding:8px 6px;text-align:center;border:1px solid;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .2s}
        .rgm-avail{background:#f0fdf4;border-color:#bbf7d0}.rgm-occ{background:#fef2f2;border-color:#fecaca}
        .rgm-num{font-weight:800;font-size:.9rem;color:var(--color-blue-deep);font-family:'Courier New',monospace}
        .rgm-type{font-size:.55rem;color:#6b7280;text-transform:uppercase;letter-spacing:.5px}
        .rgm-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .dot-green{background:#16a34a}.dot-red{background:#ef4444}
        .quick-item{display:flex;justify-content:space-between;align-items:flex-start;padding:14px;background:#fdf8ed;border:1px solid #f5e6c0;border-radius:10px;gap:12px}
        .rev-hero{background:linear-gradient(135deg,var(--color-blue-deep),#061924);color:#fff;padding:28px 32px;border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:24px;box-shadow:0 8px 32px rgba(10,37,64,.2);margin-bottom:24px;flex-wrap:wrap}
        .rev-pill{font-size:.74rem;font-weight:600;padding:5px 12px;border-radius:20px}
        .rp-green{background:rgba(22,163,74,.2);color:#4ade80}
        .rp-blue{background:rgba(59,130,246,.2);color:#93c5fd}
        .rp-orange{background:rgba(234,88,12,.2);color:#fdba74}
        .rp-red{background:rgba(239,68,68,.2);color:#fca5a5}
        .price-row{display:flex;justify-content:space-between;align-items:center;padding:18px;background:#f9f8f6;border:1px solid #e8e8e4;border-radius:10px;gap:16px;margin-bottom:16px}
        .price-input-group{display:flex;align-items:center;background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:0 10px;overflow:hidden}
        .currency-prefix{font-weight:600;color:#6b7280;font-size:.9rem;margin-right:4px}
        .price-input{border:none;padding:10px 8px;font-size:.95rem;font-weight:600;color:var(--color-blue-deep);width:120px;outline:none;text-align:right;background:transparent}
        .save-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 26px;font-size:.93rem;font-weight:600;background:var(--color-gold);color:#fff;border:none;border-radius:10px;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(197,160,89,.3)}
        .save-btn:hover{background:#b8983d;transform:translateY(-1px)}
        .table-responsive{width:100%;overflow-x:auto;border-radius:8px}
        .dt{width:100%;border-collapse:collapse;font-size:.83rem;min-width:1000px}
        .dt th{background:#f9f8f6;color:#374151;font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.5px;padding:10px 11px;text-align:left;border-bottom:2px solid #e8e8e4;white-space:nowrap}
        .dt td{padding:11px;border-bottom:1px solid #f0ede8;color:#374151;vertical-align:middle}
        .dt tr:hover td{background:#fdf8ed}.dt tr:last-child td{border-bottom:none}
        .code-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,var(--color-blue-deep),#1a5276);color:var(--color-gold);padding:4px 9px;border-radius:6px;font-size:.7rem;font-weight:700;font-family:'Courier New',monospace;white-space:nowrap}
        .room-num-badge{display:inline-block;background:#fdf8ed;color:#b45309;border:1px solid #f5e6c0;padding:2px 7px;border-radius:5px;font-size:.75rem;font-weight:700;font-family:'Courier New',monospace;margin-right:3px}
        .room-tag{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 8px;border-radius:5px;font-size:.72rem;font-weight:600;white-space:nowrap}
        .date-cell{white-space:nowrap;font-size:.81rem}
        .dur-badge{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:2px 7px;border-radius:5px;font-size:.72rem;font-weight:600;white-space:nowrap}
        .pill{display:inline-block;padding:3px 9px;border-radius:20px;font-size:.68rem;font-weight:600;white-space:nowrap}
        .pill-g{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
        .pill-o{background:#fff7ed;color:#ea580c;border:1px solid #fed7aa}
        .pill-b{background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe}
        .pill-r{background:#fef2f2;color:#ef4444;border:1px solid #fecaca}
        .btn-paid{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;font-size:.72rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#16a34a,#15803d);border:none;border-radius:6px;cursor:pointer;transition:all .2s;white-space:nowrap}
        .btn-paid:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(22,163,74,.3)}
        .btn-cancel{display:inline-flex;align-items:center;gap:4px;padding:5px 9px;font-size:.72rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);border:none;border-radius:6px;cursor:pointer;transition:all .2s}
        .btn-cancel:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(239,68,68,.3)}
        .empty-state{padding:36px 20px;text-align:center;color:#9ca3af;background:#fafaf9;border-radius:10px;border:1px dashed #d1d5db}
        .set-row{display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #f0ede8;font-size:.9rem}
        .set-row span:first-child{color:#6b7280}.set-row strong{color:var(--color-blue-deep)}
        .toast{position:fixed;top:22px;right:22px;background:rgba(10,37,64,.96);backdrop-filter:blur(10px);color:#fff;padding:13px 20px;border-radius:12px;border:1px solid var(--color-gold);box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;align-items:center;gap:10px;z-index:2000;font-size:.88rem;font-weight:500;animation:slideInR .3s both}
        .toast-err{border-color:#ef4444;background:rgba(127,29,29,.95)}
        @keyframes slideInR{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}.rev-cards-row{grid-template-columns:repeat(2,1fr)}.two-col{grid-template-columns:1fr}.room-grid-mini{grid-template-columns:repeat(6,1fr)}}
        @media(max-width:768px){.main-content{margin-left:0;width:100%}.cs{padding:20px 16px}.stats-grid{grid-template-columns:1fr 1fr}.rev-summary-bar{flex-direction:column;gap:12px}.rsb-sep{display:none}.room-grid-mini{grid-template-columns:repeat(4,1fr)}}
      `}</style>
    </div>
  );
}
