import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";
import StarRating from "../components/StarRating";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Calendar Pop-up
  const [isOpen, setIsOpen] = useState(false);

  // Inputs
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Calendar state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const room = roomsDummyData.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open modal with calendar
    setIsOpen(true);
  };

  return (
    room && (
      <div className="py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="font-inter text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Room Rating */}
        <div className="flex flex-row ">
          <StarRating />
          <p className="ml-2 text-sm font-inter">200+ Reviews</p>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="w-full lg:w-1/2">
            <img
              src={mainImage}
              alt="room"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="room-image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-10">
          <div className="flex flex-col">
            <h1 className="text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>

            <div className="flex flex-wrap ">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/100"
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
          </div>

          {/* Room Price */}
          <p className="text-2xl font-medium">₱{room.pricePerNight}/night</p>
        </div>

        {/* Check In/Out */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] rounded-xl p-6 mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row itemsstart md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max md:mt-4 md:px-25 py-3 md:py-4 text-base cursor-pointer"
          >
            Check Availability
          </button>
        </form>

        {/* Floating Calendar Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] md:w-[600px]">
              <h2 className="text-2xl font-bold mb-4">Select Your Dates</h2>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                moveRangeBackwards={false}
                ranges={range}
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // You can compare inputs with calendar dates here
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-15 space-y-5">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title} -icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Discover the perfect blend of luxury and comfort at Rosario Resort
            and Hotel. Our provincial resort offers a unique escape, where
            modern amenities meet the vibrant energy of urban life. Whether
            you're here for business or leisure, we ensure an unforgettable stay
            with exceptional service and stunning surroundings.
          </p>
        </div>

        {/* Hotel Manager */}
        <div className="flex flex-col items-start gap-4">
          <div>
            <img
              src={assets.logoPicture}
              alt="Hotel-Owner"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">
                Hosted By Rosario Resort and Hotel
              </p>
              <div className="flex items-center mt-2">
                <StarRating />
                <p className="ml-2">200+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
        <button>Contact Now</button>
      </div>
    )
  );
};

export default RoomDetails;
