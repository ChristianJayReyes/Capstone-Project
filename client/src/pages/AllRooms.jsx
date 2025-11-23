import React, { useState, useEffect } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import { motion } from "framer-motion";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm hover:text-indigo-600 transition-colors">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm hover:text-indigo-600 transition-colors">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [rooms, setRooms] = useState(roomsDummyData);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Room"];
  const priceRange = [
    "0 to 2999",
    "3000 to 3499",
    "3500 to 3999",
    "4000 to 5000",
  ];
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  const parsePriceRange = (range) => {
    const [min, max] = range.split(" to ").map(Number);
    return { min, max: max || Infinity };
  };

  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handleSortChange = (option) => {
    setSelectedSort(option);
  };

  useEffect(() => {
    let filteredRooms = [...roomsDummyData];

    if (selectedRoomTypes.length > 0) {
      filteredRooms = filteredRooms.filter((room) =>
        selectedRoomTypes.includes(room.roomType)
      );
    }

    if (selectedPriceRanges.length > 0) {
      filteredRooms = filteredRooms.filter((room) =>
        selectedPriceRanges.some((range) => {
          const { min, max } = parsePriceRange(range);
          return room.pricePerNight >= min && room.pricePerNight <= max;
        })
      );
    }

    if (selectedSort === "Price: Low to High") {
      filteredRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (selectedSort === "Price: High to Low") {
      filteredRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (selectedSort === "Newest First") {
      filteredRooms.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setRooms(filteredRooms);
  }, [selectedRoomTypes, selectedPriceRanges, selectedSort]);

  return (
    <motion.div
      className="flex flex-col-reverse lg:flex-row items-start justify-between pt-20 md:pt-30 px-4 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-b from-gray-50 to-white min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Left: Rooms List */}
      <div className="flex-1">
        <div className="mb-10">
          <h1 className="font-playfair text-4xl md:text-[42px] font-semibold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Hotel Rooms
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl">
            Take advantage of our limited offers and special packages to enhance
            your stay and create unforgettable memories.
          </p>
        </div>

        {rooms.map((room) => (
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-start py-8 px-5 mb-6 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            key={room._id}
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              className="max-h-72 md:w-1/2 rounded-xl object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2 md:pl-6 mt-4 md:mt-0">
              <p className="text-gray-500 text-sm">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-2xl font-semibold font-playfair cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {room.hotel.name}
              </p>

              <div className="flex items-center gap-2">
                <StarRating />
                <p className="ml-1 text-gray-500 text-sm">200+ Reviews</p>
              </div>

            
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-3">
                {room.amenities.map((item, index) => (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700"
                    key={index}
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-xl font-semibold text-indigo-600">
                ₱ {room.pricePerNight}{" "}
                <span className="text-gray-500 text-sm font-normal">/night</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right: Filters */}
      <div className="bg-white/80 backdrop-blur-md w-80 border border-gray-100 rounded-2xl shadow-md p-5 mb-10 lg:ml-10 sticky top-28">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <p className="text-lg font-semibold text-gray-800 tracking-wide">
            Filters
          </p>
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className="lg:hidden text-sm text-indigo-600"
          >
            {openFilters ? "Hide" : "Show"}
          </button>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="mb-5">
            <p className="font-semibold text-gray-800 pb-2 border-b border-gray-100">
              Popular Filters
            </p>
            {roomTypes.map((type, index) => (
              <CheckBox
                key={index}
                label={type}
                selected={selectedRoomTypes.includes(type)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          <div className="mb-5">
            <p className="font-semibold text-gray-800 pb-2 border-b border-gray-100">
              Price Range
            </p>
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={range}
                selected={selectedPriceRanges.includes(range)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          <div>
            <p className="font-semibold text-gray-800 pb-2 border-b border-gray-100">
              Sort By
            </p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AllRooms;
