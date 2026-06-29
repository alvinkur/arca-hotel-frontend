"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RoomCard from '../components/RoomCard';
import Facilities from '../components/Facilities';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';
<<<<<<< HEAD
import { getLombokWeather, getRooms, getAuthToken } from '../services/api';
import { FaLock } from 'react-icons/fa';
=======
import { getLombokWeather } from '../services/api';
>>>>>>> upstream/main

// Icon tambahan untuk About Lombok
import { FaCheckCircle, FaMapMarkedAlt, FaCompass, FaSun } from 'react-icons/fa';

const rinjaniImg = "/assets/rinjani_mount.png";

<<<<<<< HEAD
// Static room type data for the cards (prices, images, descriptions) — shown to non-logged-in users
const STATIC_ROOM_TYPES = [
  { id: 1, name: "Economy Room", price: 150000, description: "Perfect for budget-conscious travelers. Cozy layout with basic facilities, comfortable bed, and pleasant surroundings.", image: "/assets/ekonomi_room.jpg", amenities: ["Free WiFi", "Smart TV"] },
  { id: 2, name: "Standard Room", price: 200000, description: "A blend of comfort and style. Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.", image: "/assets/standart_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV"] },
  { id: 3, name: "VIP Suite", price: 350000, description: "Experience absolute luxury. Spaciously designed with high-end furniture, private lounge, premium entertainment, and premium comfort.", image: "/assets/vip_room.jpg", amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"] }
];

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState('');
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [weather, setWeather] = useState(null);
  const bookingSectionRef = useRef(null);

  useEffect(() => {
    alert("Welcome to Hotel Arca! Enjoy your luxury virtual stay experience.");
    console.log("Welcome to Hotel Arca - A Luxury Haven in Indonesia. Page initialized successfully!");

    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      // Fetch real rooms from backend
      getRooms()
        .then((data) => {
          // data is array of { id_room, room_number, id_room_type, availability, room_type: { id_room_type, name, price, description } }
          // Filter unique room types for RoomCard display
          const seen = new Set();
          const unique = [];
          for (const r of data) {
            const typeName = r.room_type?.name || 'Unknown';
            if (!seen.has(typeName)) {
              seen.add(typeName);
              unique.push({
                id: r.id_room,
                name: typeName,
                price: r.room_type?.price || 0,
                description: r.room_type?.description || '',
                image: typeName === 'VIP Suite' ? '/assets/vip_room.jpg' :
                       typeName === 'Standard Room' ? '/assets/standart_room.jpg' :
                       '/assets/ekonomi_room.jpg',
                amenities: typeName === 'VIP Suite' ? ['Free WiFi', 'Breakfast', 'Smart TV', 'Private Lounge'] :
                           typeName === 'Standard Room' ? ['Free WiFi', 'Breakfast', 'Smart TV'] :
                           ['Free WiFi', 'Smart TV']
              });
            }
          }
          setRooms(unique.length > 0 ? unique : STATIC_ROOM_TYPES);
        })
        .catch(() => setRooms(STATIC_ROOM_TYPES));
    } else {
      setIsLoggedIn(false);
      // Show static room type info even when not logged in
      setTimeout(() => setRooms(STATIC_ROOM_TYPES), 500);
    }

    getLombokWeather()
      .then(data => setWeather(data))
      .catch(err => console.error("Gagal mendapatkan cuaca Lombok:", err));
  }, []);

  const handleScrollToBooking = (roomName = '') => {
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (roomName) setSelectedRoomForBooking(roomName);
=======
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
    price: 200000,
    description: "A blend of comfort and style. Equipped with premium bedding, modern utilities, and a refreshing garden view balcony.",
    image: "/assets/standart_room.jpg",
    amenities: ["Free WiFi", "Breakfast", "Smart TV"]
  },
  {
    id: 3,
    name: "VIP Suite",
    price: 350000,
    description: "Experience absolute luxury. Spaciously designed with high-end furniture, private lounge, premium entertainment, and premium comfort.",
    image: "/assets/vip_room.jpg",
    amenities: ["Free WiFi", "Breakfast", "Smart TV", "Private Lounge"]
  }
];

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
        const needsMigration = parsed.some(r => r.floor === 3 || r.roomNumber === '301');

        let activeRooms = [];
        if (!storedRooms || parsed.length < 10 || !hasStandard || hasDeluxe || needsMigration) {
          localStorage.setItem('hotel_rooms', JSON.stringify(DEFAULT_ROOMS));
          activeRooms = DEFAULT_ROOMS;
        } else {
          activeRooms = parsed;
        }

        // Filter unique types for rendering cards on the Home page
        const uniqueRooms = [];
        const seenTypes = new Set();
        for (const r of activeRooms) {
          if (!seenTypes.has(r.name)) {
            seenTypes.add(r.name);
            uniqueRooms.push(r);
          }
        }
        setRooms(uniqueRooms);
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
>>>>>>> upstream/main
    setFocusTrigger(prev => prev + 1);
  };

  return (
    <>
<<<<<<< HEAD
      <Navbar onBookingClick={() => handleScrollToBooking()} />
      <Hero onBookNowClick={() => handleScrollToBooking()} />

=======
      {/* Sticky Top Navigation */}
      <Navbar onBookingClick={() => handleScrollToBooking()} />

      {/* Hero Header Banner */}
      <Hero onBookNowClick={() => handleScrollToBooking()} />

      {/* Room List Section */}
>>>>>>> upstream/main
      <section id="rooms">
        <h2 className="section-title">Rooms & Suites</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Discover our curated collection of luxury sanctuaries. Handcrafted with local accents and modern elegance.
        </p>

<<<<<<< HEAD
        {!isLoggedIn && rooms.length === 0 ? (
          <div className="login-prompt-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FaLock size={40} style={{ color: 'var(--color-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-blue-deep)', fontSize: '1.4rem', marginBottom: '12px' }}>Login untuk Melihat Kamar</h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
              Silakan login atau daftar untuk melihat ketersediaan kamar dan melakukan reservasi.
            </p>
            <a href="/login" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Login / Register
            </a>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBookRoom={(name) => handleScrollToBooking(name)}
              />
            ))}
          </div>
        )}
      </section>

      <Facilities />

      <section id="about">
        <div className="about-lombok-container">
=======
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
>>>>>>> upstream/main
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
<<<<<<< HEAD
              Lombok is a paradise defined by its clear turquoise waters, majestic white-sand coastlines, and the towering volcanic heights of Mount Rinjani.
=======
              Lombok is a paradise defined by its clear turquoise waters, majestic white-sand coastlines, and the towering volcanic heights of Mount Rinjani. 
>>>>>>> upstream/main
              Less commercialized than neighboring islands, Lombok offers a raw, authentic, and peaceful sanctuary for travelers looking to reconnect with nature.
            </p>
            <p className="about-lombok-desc" style={{ marginBottom: '32px' }}>
              At Hotel Arca, we offer custom guided excursions, beach trekking, surf lessons, and sunset cruises to help you explore the incredible landscapes of the island.
            </p>
<<<<<<< HEAD
            <div className="about-lombok-highlights">
              <div className="highlight-item"><FaCompass /> Guided Island Excursions</div>
              <div className="highlight-item"><FaSun /> Private Beach Lounge</div>
              <div className="highlight-item"><FaMapMarkedAlt /> Strategic Senggigi Location</div>
              <div className="highlight-item"><FaCheckCircle /> Sustainable Tourism Eco-resort</div>
            </div>
            <button onClick={() => handleScrollToBooking()} className="btn-gold">Book Your Getaway</button>
          </div>
          <div className="about-lombok-img-wrapper">
            <img src={rinjaniImg} alt="Beautiful Mount Rinjani landscape in Lombok" className="about-lombok-img" loading="lazy" />
=======

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
>>>>>>> upstream/main
            <div className="about-lombok-img-overlay">
              <h3 className="about-lombok-img-caption">Mount Rinjani</h3>
              <p className="about-lombok-img-sub">The Majestic Heart of Lombok</p>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <div ref={bookingSectionRef}>
        <BookingForm selectedRoom={selectedRoomForBooking} focusTrigger={focusTrigger} />
      </div>

=======
      {/* Form Reservasi (Booking) Section */}
      <div ref={bookingSectionRef}>
        <BookingForm 
          selectedRoom={selectedRoomForBooking} 
          focusTrigger={focusTrigger} 
        />
      </div>

      {/* Footer Details */}
>>>>>>> upstream/main
      <Footer />
    </>
  );
}
