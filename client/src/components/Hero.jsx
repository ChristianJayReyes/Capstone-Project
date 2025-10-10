import React, { useState } from "react";
import { assets, roomsDummyData } from "../assets/assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const matchedRoom = roomsDummyData.find(
      (room) => room.roomType.toLowerCase() === selectedRoom.toLowerCase()
    );
    if (matchedRoom) {
      navigate(`/rooms/${matchedRoom._id}`);
      window.scrollTo(0, 0);
    } else {
      alert("No rooms found for the selected type.");
    }
  };

  //create unique list of room types (no duplicates, stable)
  const cities = [...new Set(roomsDummyData.map((room) => room.roomType))];

  return (
    <section className="relative h-[100vh] flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/background.jpg"
          alt="Resort"
          className="w-full h-full object-cover brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-8 md:px-20 lg:px-32 max-w-2xl text-white mt-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-md">
          Discover Your Perfect <br /> Gateway Destination
        </h1>

        <p className="mt-4 text-gray-200 text-base md:text-lg leading-relaxed">
          Experience refined comfort where modern luxury meets vibrant urban
          energy. Escape, unwind, and indulge — your perfect getaway awaits.
        </p>

        {/* Search Box */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shadow-xl w-180"
        >
          {/* Type of Room */}
          <div className="flex flex-col text-sm w-full md:w-auto">
            <label className="text-gray-200 mb-1 flex items-center gap-2 font-medium">
              <img
                src={assets.calenderIcon}
                alt="icon"
                className="h-4 opacity-80"
              />
              Type of Room
            </label>
            <input
              list="destinations"
              type="text"
              placeholder="Type here..."
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-[#007BFF]"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          {/* Children */}
          <div className="flex flex-col text-sm w-full md:w-auto">
            <label className="text-gray-200 mb-1 font-medium">Children</label>
            <input
              type="number"
              placeholder="0"
              min={1}
              max={500}
              className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-[#007BFF]"
            />
          </div>

          {/* Adults */}
          <div className="flex flex-col text-sm w-full md:w-auto">
            <label className="text-gray-200 mb-1 font-medium">Adults</label>
            <input
              type="number"
              placeholder="0"
              min={1}
              max={500}
              className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-[#007BFF]"
              required
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-[#005FDB] transition-all duration-300 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg w-full md:w-auto"
          >
            <img src={assets.searchIcon} alt="searchIcon" className="h-5" />
            <span>Search</span>
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Hero;
