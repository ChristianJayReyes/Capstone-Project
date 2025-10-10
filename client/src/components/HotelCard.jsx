import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-white text-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100"
    >
      {/* Image */}
      <div className="relative group">
        <img
          src={room.images[0]}
          alt={room.roomType}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Tag */}
        {index % 2 === 0 && (
          <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white/90 text-gray-900 font-semibold rounded-full shadow-md tracking-wide">
            🌟 Best Seller
          </p>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        {/* Room Title */}
        <div className="flex items-start justify-between">
          <p className="font-playfair text-xl font-bold text-gray-900 leading-tight">
            {room.roomType}
          </p>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <img src={assets.starIconFilled} alt="star" className="w-4 h-4" />
            <span className="text-gray-700">4.5</span>
          </div>
        </div>

        {/* Hotel Name */}
        <p className="text-sm text-sky-600 font-medium mt-1">
          {room.hotel.name}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location" className="w-4 h-4" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ₱{room.pricePerNight.toLocaleString()}
            <span className="text-sm text-gray-500 font-normal"> /night</span>
          </p>

          {/* Minimalist Button */}
          <button className="px-4 py-2 text-sm font-semibold text-gray-800 border border-gray-300 rounded-full bg-white hover:bg-gray-100 hover:shadow-md transition-all duration-300">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
