"use client";

import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaWifi, FaCoffee, FaTv, FaBath } from 'react-icons/fa';

// Component: RoomCard
export default function RoomCard({ room, onBookRoom }) {
  // useState() - Menyimpan status apakah kamar ini disukai (favorite) oleh tamu atau tidak
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Mencegah klik menyebar ke card body
    setIsLiked(!isLiked);
  };

  // Icon mapping untuk kelengkapan visual
  const renderAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi': return <FaWifi key={amenity} />;
      case 'breakfast': return <FaCoffee key={amenity} />;
      case 'smart tv': return <FaTv key={amenity} />;
      case 'bathtub': return <FaBath key={amenity} />;
      default: return null;
    }
  };

  return (
    <div className="room-card">
      <div className="room-img-container">
        <img src={room.image} alt={room.name} className="room-img" loading="lazy" />
        
        {/* Favorite (Like) Button */}
        <button
          onClick={handleLikeToggle}
          className={`room-favorite-btn ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? `Remove ${room.name} from favorites` : `Add ${room.name} to favorites`}
          title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>

        {/* Room Price Tag */}
        <div className="room-price-badge">
          Rp {room.price.toLocaleString('id-ID')}<span> / night</span>
        </div>
      </div>

      <div className="room-content">
        <h3 className="room-name">{room.name}</h3>
        <p className="room-desc">{room.description}</p>
        
        {/* Room Amenities list */}
        <div className="room-amenities">
          {room.amenities.map((amenity) => (
            <span key={amenity} className="room-amenity">
              {renderAmenityIcon(amenity)}
              {amenity}
            </span>
          ))}
        </div>

        {/* Book Room Action Button */}
        <button
          onClick={() => onBookRoom(room.name)}
          className="btn-gold room-btn"
          aria-label={`Book ${room.name} now`}
        >
          Book Room
        </button>
      </div>
    </div>
  );
}
