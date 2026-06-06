"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RoomCard from '../components/RoomCard';
import Facilities from '../components/Facilities';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';
import { getLombokWeather } from '../services/api';

// Icon tambahan untuk About Lombok
import { FaCheckCircle, FaMapMarkedAlt, FaCompass, FaSun } from 'react-icons/fa';

const rinjaniImg = "/assets/rinjani_mount.png";

// Data dummy tipe kamar
const DUMMY_ROOM_DATA = [
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

export default function Home() {
  // useState() - Menyimpan daftar kamar hotel (dimuat dari data dummy)
  const [rooms, setRooms] = useState([]);

  // useState() - Menyimpan tipe kamar yang dipilih untuk otomatis masuk ke form booking
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState('');

  // useState() - Trigger untuk memfokuskan kursor ke input nama di booking form
  const [focusTrigger, setFocusTrigger] = useState(0);

  // useState() - Menyimpan data cuaca Lombok dari API (Axios HTTPS GET)
  const [weather, setWeather] = useState(null);

  // useRef() - Mereferensikan elemen section Booking Form agar halaman bisa di-scroll secara otomatis
  const bookingSectionRef = useRef(null);

  // useEffect() - Berjalan satu kali saat halaman pertama kali dibuka
  useEffect(() => {
    // Menampilkan alert selamat datang di browser
    alert("Welcome to Hotel Arca! Enjoy your luxury virtual stay experience.");
    
    // Menampilkan pesan di console log
    console.log("Welcome to Hotel Arca - A Luxury Haven in Indonesia. Page initialized successfully!");

    // Meniru proses pengambilan data kamar dari API (Fetch simulation)
    const loadRooms = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedRooms = localStorage.getItem('hotel_rooms');
        let parsed = [];
        try {
          parsed = storedRooms ? JSON.parse(storedRooms) : [];
        } catch (e) {}

        const hasStandard = parsed.some(r => r.name === 'Standard Room');
        const hasDeluxe = parsed.some(r => r.name === 'Deluxe Room');

        if (!storedRooms || parsed.length === 0 || !hasStandard || hasDeluxe) {
          localStorage.setItem('hotel_rooms', JSON.stringify(DUMMY_ROOM_DATA));
          setRooms(DUMMY_ROOM_DATA);
        } else {
          setRooms(parsed);
        }
      } else {
        setRooms(DUMMY_ROOM_DATA);
      }
    }, 500);

    // Mengambil data cuaca Lombok real-time menggunakan Axios (GET)
    getLombokWeather()
      .then(data => {
        setWeather(data);
      })
      .catch(err => {
        console.error("Gagal mendapatkan cuaca Lombok via Axios:", err);
      });

    return () => clearTimeout(loadRooms);
  }, []);

  // Handler: Scroll ke section booking & fokus ke input nama tamu
  const handleScrollToBooking = (roomName = '') => {
    if (bookingSectionRef.current) {
      // useRef() - Mengontrol scroll ke koordinat elemen booking form
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    if (roomName) {
      setSelectedRoomForBooking(roomName);
    }

    // Trigger auto-focus pada input nama
    setFocusTrigger(prev => prev + 1);
  };

  return (
    <>
      {/* Sticky Top Navigation */}
      <Navbar onBookingClick={() => handleScrollToBooking()} />

      {/* Hero Header Banner */}
      <Hero onBookNowClick={() => handleScrollToBooking()} />

      {/* Room List Section */}
      <section id="rooms">
        <h2 className="section-title">Rooms & Suites</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Discover our curated collection of luxury sanctuaries. Handcrafted with local accents and modern elegance.
        </p>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBookRoom={(name) => handleScrollToBooking(name)}
            />
          ))}
        </div>
      </section>

      {/* Resort Facilities Section */}
      <Facilities />

      {/* About Lombok Destination Section */}
      <section id="about">
        <div className="about-lombok-container">
          {/* About Text */}
          <div className="about-lombok-text">
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              <span className="about-lombok-tag" style={{ marginBottom: 0 }}>Discover Lombok</span>
              {weather && (
                <div className="weather-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid var(--color-gold)',
                  color: 'var(--color-gold)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  gap: '6px',
                  fontWeight: '500'
                }}>
                  <FaSun style={{ color: '#ffb900' }} />
                  <span>Suhu Lombok: {weather.temperature}°C ({weather.windspeed} km/h Angin)</span>
                </div>
              )}
            </div>
            <h2 className="about-lombok-title">An Island of Untamed Beauty and Pristine Beaches</h2>
            <div className="gold-divider" style={{ margin: '15px 0' }}></div>
            <p className="about-lombok-desc">
              Lombok is a paradise defined by its clear turquoise waters, majestic white-sand coastlines, and the towering volcanic heights of Mount Rinjani. 
              Less commercialized than neighboring islands, Lombok offers a raw, authentic, and peaceful sanctuary for travelers looking to reconnect with nature.
            </p>
            <p className="about-lombok-desc" style={{ marginBottom: '32px' }}>
              At Hotel Arca, we offer custom guided excursions, beach trekking, surf lessons, and sunset cruises to help you explore the incredible landscapes of the island.
            </p>

            {/* Highlights Grid */}
            <div className="about-lombok-highlights">
              <div className="highlight-item">
                <FaCompass /> Guided Island Excursions
              </div>
              <div className="highlight-item">
                <FaSun /> Private Beach Lounge
              </div>
              <div className="highlight-item">
                <FaMapMarkedAlt /> Strategic Senggigi Location
              </div>
              <div className="highlight-item">
                <FaCheckCircle /> Sustainable Tourism Eco-resort
              </div>
            </div>

            <button 
              onClick={() => handleScrollToBooking()} 
              className="btn-gold"
            >
              Book Your Getaway
            </button>
          </div>

          {/* About Image Frame */}
          <div className="about-lombok-img-wrapper">
            <img 
              src={rinjaniImg} 
              alt="Beautiful Mount Rinjani landscape in Lombok" 
              className="about-lombok-img" 
              loading="lazy"
            />
            <div className="about-lombok-img-overlay">
              <h3 className="about-lombok-img-caption">Mount Rinjani</h3>
              <p className="about-lombok-img-sub">The Majestic Heart of Lombok</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Reservasi (Booking) Section */}
      <div ref={bookingSectionRef}>
        <BookingForm 
          selectedRoom={selectedRoomForBooking} 
          focusTrigger={focusTrigger} 
        />
      </div>

      {/* Footer Details */}
      <Footer />
    </>
  );
}
