"use client";

import React, { useState, useEffect, useRef } from 'react';

// Component: Hero Section
export default function Hero({ onBookNowClick }) {
  // useState() - Menyimpan index slide gambar aktif saat ini
  const [currentSlide, setCurrentSlide] = useState(0);

  // useRef() - Menyimpan ID interval untuk auto slideshow agar bisa di-clear
  const slideIntervalRef = useRef(null);

  // Array data gambar untuk slideshow
  const slides = [
    {
      image: "/assets/lobby.jpg",
      title: "Welcome to Hotel Arca",
      tagline: "Warm Sasak Hospitality",
      subtitle: "Experience the ultimate sanctuary of premium living, authentic Sasak hospitality, and state-of-the-art comfort."
    },
    {
      image: "/assets/tempat_duduk_loby.jpg",
      title: "Elegant Lounge Spaces",
      tagline: "Comfort & Style",
      subtitle: "Relax in our beautifully designed seating areas, perfect for casual gatherings and peaceful moments."
    },
    {
      image: "/assets/vip_tv.jpg",
      title: "Premium Suite Comforts",
      tagline: "Modern Luxury",
      subtitle: "Unwind in our rooms equipped with high-definition smart entertainment systems and custom interiors."
    }
  ];

  // useEffect() - Membuat dan membersihkan interval untuk auto-slideshow
  useEffect(() => {
    // Memulai interval untuk memutar slide setiap 5 detik
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    // Clean-up function: membersihkan interval saat component di-unmount
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [slides.length]);

  return (
    <header id="home" className="hero">
      {/* Background Slideshow */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      {/* Hero Content Overlay */}
      <div className="hero-content">
        <span className="hero-tagline">{slides[currentSlide].tagline}</span>
        <h1 className="hero-title">{slides[currentSlide].title}</h1>
        <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>
        <button 
          onClick={onBookNowClick} 
          className="btn-gold hero-btn"
          aria-label="Scroll to Booking Form"
        >
          Book Now
        </button>
      </div>
    </header>
  );
}
