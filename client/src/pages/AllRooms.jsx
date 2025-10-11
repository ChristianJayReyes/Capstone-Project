import React, { useState, useEffect } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="w-4 h-4"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
        className="w-4 h-4"
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

  const roomTypes = ["Dormitory Room", "Superior Queen", "Superior Twin", "Deluxe Queen", "Deluxe Twin", "Presidential Queen", " Presidential Twin", "Family Room"];
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

    // Filter by room type
    if (selectedRoomTypes.length > 0) {
      filteredRooms = filteredRooms.filter((room) =>
        selectedRoomTypes.includes(room.roomType)
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filteredRooms = filteredRooms.filter((room) =>
        selectedPriceRanges.some((range) => {
          const { min, max } = parsePriceRange(range);
          return room.pricePerNight >= min && room.pricePerNight <= max;
        })
      );
    }

    // Sort
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
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-20 md:pt-30 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div>
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take Advantage of our limited offers and special packages to enhance
            your stay and create unforgettable memories
          </p>
        </div>

        {rooms.map((room) => (
          <div
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-200 last:border-0"
            key={room._id}
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-large object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center gap-2">
                <StarRating />
                <p className="ml-2">200+ Reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-Icon" />
                <span>{room.hotel.address}</span>
              </div>
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
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
              <p className="text-xl font-medium text-gray-700">
                ₱ {room.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="cursor-pointer text-xs">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span className="hidden lg:block"> CLEAR</span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypes.map((type, index) => (
              <CheckBox
                key={index}
                label={type}
                selected={selectedRoomTypes.includes(type)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={range}
                selected={selectedPriceRanges.includes(range)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
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
    </div>
  );
};

export default AllRooms;
