import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  assets,
  facilityIcons,
  hotelDummyData,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ReservationFormModal from "../components/ReservationFormModal";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Reservation Form (floating)
  const [form, setShowForm] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);

  // Calendar Pop-up
  const [isOpen, setIsOpen] = useState(false);

  // Room Number (static - for display only)
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [roomQuantity, setRoomQuantity] = useState(1);

  // Context
  const { axios, token, user, setBookings } = useAppContext();

  // Confirm Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Room Info Modal
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);

  // Calendar state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const fetchAvailableRooms = useCallback(async () => {
    if (!room) return;

    try {
      const typeName = room?.hotel?.name || room?.roomType || "";
      if (!typeName) {
        setRoomNumbers([]);
        setRoomQuantity(1);
        return;
      }

      const response = await fetch(
        `https://rrh-backend.vercel.app/api/rooms/available?typeName=${encodeURIComponent(
          typeName
        )}`
      );
      const data = await response.json();

      if (data.success && data.roomNumbers) {
        const filteredRoomNumbers = data.roomNumbers
          .filter((num) => num)
          .sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (isNaN(numA) || isNaN(numB)) {
              return (a || "").localeCompare(b || "");
            }
            return numA - numB;
          });

        setRoomNumbers(filteredRoomNumbers);
        // Reset quantity to 1 when rooms change
        setRoomQuantity(1);
      } else {
        const hotel = hotelDummyData.find(
          (hotelItem) => hotelItem.name === room.hotel.name
        );
        if (hotel && hotel.roomNumbers) {
          setRoomNumbers(hotel.roomNumbers);
          setRoomQuantity(1);
        } else {
          setRoomNumbers([]);
          setRoomQuantity(1);
        }
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      const hotel = hotelDummyData.find(
        (hotelItem) => hotelItem.name === room.hotel.name
      );
      if (hotel && hotel.roomNumbers) {
        setRoomNumbers(hotel.roomNumbers);
        setRoomQuantity(1);
      } else {
        setRoomNumbers([]);
        setRoomQuantity(1);
      }
    }
  }, [room]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

  // Load Room Details
  useEffect(() => {
    const roomData = roomsDummyData.find((r) => r._id === id);
    if (roomData) {
      setRoom(roomData);
      setMainImage(roomData.images[0]);
    }
  }, [id]);

  // Handle Check Availability (opens date modal)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roomQuantity < 1 || roomQuantity > roomNumbers.length) {
      alert(`Please select a quantity between 1 and ${roomNumbers.length}.`);
      return;
    }

    if (roomNumbers.length === 0) {
      alert("No rooms available for booking.");
      return;
    }

    setIsOpen(true);
  };

  // Build reservationDetails from current inputs and state.
  const handleOpenReservationForm = () => {
    const checkInDate = range[0].startDate;
    const checkOutDate = range[0].endDate;

    // Format date using local timezone to avoid day shift issues
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    // Grab values from inputs (we used simple uncontrolled inputs earlier)
    const adults = document.getElementById("adults")?.value || "1";
    const children = document.getElementById("children")?.value || "0";

    // Create reservation details object with ALL fields requested (displayed & some auto-set)
    const details = {
      // Guest Information (user answered yes to save)
      name: user?.name || "",
      email: user?.email || document.getElementById("email")?.value || user?.email || "",
      phone: document.getElementById("phone")?.value || user?.phone || "",
      address: document.getElementById("address")?.value || "",
      nationality: document.getElementById("nationality")?.value || "",

      // Company 
      company: "",

      // Stay Information
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      adults,
      children,
      // Purpose & Special Requests 
      purpose: "",
      requests: "",

      // Room Information — auto-fill as requested
      roomName: room?.hotel?.name || "",
      roomNumber: "", // Will be assigned by admin later
      roomNumbers: [], // Will be assigned by admin later
      roomQuantity: roomQuantity, // Pass quantity instead
      roomRate: room?.pricePerNight || 0,
      // Deposit & Payment — included for display; if inputs are filled they'll be included
      deposit: document.getElementById("deposit")?.value || 0,
      payment: document.getElementById("paymentMode")?.value || "Cash",

      // Signature & Remarks — optional
      signature: document.getElementById("signature")?.value || "",
      remarks: document.getElementById("remarks")?.value || "",
    };

    setReservationDetails(details);
    setShowConfirmModal(false);
    setIsOpen(false);
    setShowForm(true); // open floating side modal
  };

  // Final submit from floating reservation modal -> call backend and save booking
  const handleFinalSubmit = async (formData) => {
    // formData is the current reservationDetails from modal (includes any edits)
    try {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);

      const nights = Math.max(
        1,
        Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      );

      const roomCount = formData.roomQuantity || 1;

      const pricePerRoom = Number(formData.roomRate) * nights;
      const totalPrice = pricePerRoom * roomCount;

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("roomId", room?._id);
      // Send quantity - admin will assign room numbers later
      formDataToSend.append("roomQuantity", roomCount.toString());
      formDataToSend.append("roomNumbers", JSON.stringify([])); // Empty array - admin assigns
      formDataToSend.append("roomNumber", ""); // Empty - admin assigns
      formDataToSend.append("checkInDate", formData.checkIn);
      formDataToSend.append("checkOutDate", formData.checkOut);
      formDataToSend.append("adults", formData.adults);
      formDataToSend.append("children", formData.children);
      formDataToSend.append("totalPrice", pricePerRoom);
      formDataToSend.append("basePrice", pricePerRoom);
      formDataToSend.append("bookingTotalPrice", totalPrice);
      formDataToSend.append("roomCount", roomCount);
      formDataToSend.append("discountAmount", 0);
      formDataToSend.append("isPaid", "false");
      formDataToSend.append("guestName", formData.name);
      formDataToSend.append("phoneNumber", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("nationality", formData.nationality || "");
      formDataToSend.append("discountType", "None");
      formDataToSend.append("roomName", formData.roomName);
      formDataToSend.append("roomRate", formData.roomRate);
      formDataToSend.append("deposit", formData.deposit || 0);
      formDataToSend.append("paymentMode", formData.payment || "Cash");
      formDataToSend.append("signature", formData.signature || "");
      formDataToSend.append("remarks", formData.remarks || "");
      
      const { data } = await axios.post("/api/bookings/book", formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (data.success) {
        toast.success("Booking request submitted successfully! Please wait for email confirmation.");
        const newBookings = data.bookings || (data.booking ? [data.booking] : []);
        setBookings((prev) => [...newBookings, ...prev]);
        setShowForm(false);
        setRoomQuantity(1);
        fetchAvailableRooms();
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong while confirming the booking.";
      toast.error(errorMessage);
    }
  };

  return (
    room && (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content - starts below navbar */}
        <div className="relative z-10 pt-32 md:pt-40 pb-16 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
          {/* Hero Section with Room Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Room Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-2"
                  >
                    <span className="text-blue-400">
                      {room.hotel.name}
                    </span>
                    <span className="text-gray-600 text-2xl md:text-3xl lg:text-4xl font-normal ml-3">
                      ({room.roomType})
                    </span>
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex items-center gap-4 mt-3"
                  >
                    <div className="flex items-center gap-2">
                      <StarRating />
                      <span className="text-sm font-medium text-gray-600">200+ Reviews</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span className="text-sm font-medium text-gray-600">⭐ 4.8 Rating</span>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-600 via-cyan-500 to-yellow-400 rounded-2xl p-6 shadow-2xl"
                >
                  <p className="text-white/80 text-sm font-medium mb-1">Starting from</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">₱{room.pricePerNight.toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-1">per night</p>
                </motion.div>
              </div>
            </div>

            {/* Room Images Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="lg:col-span-2 relative group overflow-hidden rounded-2xl shadow-2xl"
              >
                <img
                  src={mainImage}
                  alt="room"
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {room?.images.length > 1 &&
                  room.images.slice(0, 2).map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer"
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`room-image-${index}`}
                      className={`w-full h-[190px] md:h-[240px] object-cover transition-all duration-300 ${
                        mainImage === image
                          ? "ring-4 ring-blue-500 scale-105"
                          : "group-hover:scale-110"
                      }`}
                      />
                      {mainImage === image && (
                        <div className="absolute inset-0 bg-blue-500/20 pointer-events-none"></div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>

          {/* Room Highlights & Amenities */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
                  Experience Luxury Like Never Before
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                  Indulge in unparalleled comfort and sophistication. Every detail has been carefully curated to provide you with an unforgettable stay.
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {room.amenities.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
                        <img src={facilityIcons[item]} alt={item} className="w-6 h-6 filter brightness-0 invert" />
                      </div>
                      <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {item}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* More Info Button */}
              <motion.button
                onClick={() => setShowRoomInfoModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>More info</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </motion.section>

        {/* Booking Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-16"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 md:p-10 max-w-6xl mx-auto border border-gray-200 relative overflow-hidden"
          >
            {/* Decorative Gradient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-100/50 to-amber-100/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-3">
                  Book Your Stay
                </h3>
                <p className="text-gray-600 text-lg">Select your preferences and check availability</p>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-500 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Adults */}
                <div className="flex flex-col group">
                    <label htmlFor="adults" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Adults
                    </label>
                    <input
                      type="number"
                      id="adults"
                      placeholder="1"
                      min="1"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                    required
                    defaultValue={1}
                  />
                </div>

                {/* Children */}
                <div className="flex flex-col group">
                    <label htmlFor="children" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      Children
                    </label>
                    <input
                      type="number"
                      id="children"
                      placeholder="0"
                      min="0"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm hover:shadow-md"
                    defaultValue={0}
                  />
                </div>

                {/* Available Rooms Count */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Available Rooms
                    </label>
                    <div className="relative">
                      <div className="w-full rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-yellow-500 border-2 border-transparent px-4 py-3.5 text-center shadow-lg">
                      <span className="text-4xl font-bold text-white block">{roomNumbers.length}</span>
                      <p className="text-xs text-white/90 mt-1 font-medium">rooms available</p>
                    </div>
                  </div>
                </div>

                {/* Room Quantity Selection */}
                <div className="flex flex-col group">
                    <label htmlFor="roomQuantity" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      How Many Rooms?
                    </label>
                    {roomNumbers.length > 0 ? (
                      <select
                        id="roomQuantity"
                        value={roomQuantity}
                        onChange={(e) => setRoomQuantity(parseInt(e.target.value))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-right-3 bg-[length:12px_8px] pr-10"
                    >
                      {Array.from({ length: roomNumbers.length }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Room' : 'Rooms'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-500 bg-gray-50 text-center">
                      No rooms available
                    </div>
                  )}
                </div>
              </div>

              {/* Info Message */}
              {roomNumbers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-blue-900 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">ℹ️</span>
                    <span className="font-medium">
                      Room numbers will be assigned by the admin after your booking is confirmed. You will receive an email with your assigned room numbers.
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={roomNumbers.length === 0}
                  whileHover={{ scale: roomNumbers.length > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: roomNumbers.length > 0 ? 0.95 : 1 }}
                  className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-500 hover:from-blue-700 hover:via-cyan-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Check Availability & Select Dates
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.section>

        {/* Date Picker Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/95 p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] md:w-[600px] border border-gray-100"
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
                  Select Your Dates
                </h2>

                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <DateRange
                    editableDateInputs
                    onChange={(item) => setRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    moveRangeBackwards={false}
                    ranges={range}
                    rangeColors={["#4F46E5"]}
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-md active:scale-95 transition-all duration-200"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] md:w-[450px]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  Are you sure you want to proceed with the reservation?
                </h2>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                  >
                    Cancel
                  </button>

                  {/* Confirm now opens the floating reservation form */}
                  <button
                    onClick={handleOpenReservationForm}
                    className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating reservation form modal component */}
        <ReservationFormModal
          isOpen={form}
          onClose={() => setShowForm(false)}
          data={reservationDetails}
          onSubmit={handleFinalSubmit}
        />

        {/* Room Information Modal */}
        <AnimatePresence>
          {showRoomInfoModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoomInfoModal(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-500 p-6 sm:p-8 rounded-t-3xl sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        Room Information & Policies
                      </h2>
                      <p className="text-sm text-white/90">
                        Important information about your stay
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRoomInfoModal(false)}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-8">
                

                  {/* Extra Bed Policy */}
                  <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white text-xl">🛏️</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Extra Bed Policy</h3>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Extra Bed Availability:</strong> Extra beds and rollaway beds are subject to room type and availability. Not all room types can accommodate extra beds.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Charges:</strong> Additional charges apply for extra beds. The standard rate is ₱500 per night per extra bed. This includes bedding and amenities.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Request Process:</strong> Extra beds must be requested at the time of booking or at least 48 hours before check-in to ensure availability.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Please note that extra beds are subject to room capacity and fire safety regulations.
                      </p>
                    </div>
                  </section>

                  {/* Cancellation Policy */}
                  <section className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <span className="text-white text-xl">❌</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Cancellation Policy</h3>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Free Cancellation:</strong> Cancellations made 48 hours or more before the scheduled check-in date will receive a full refund, minus any processing fees.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Late Cancellation (24-48 hours):</strong> Cancellations made between 24-48 hours before check-in will be charged 50% of the total booking amount.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">No-Show or Same-Day Cancellation:</strong> No refund will be provided for cancellations made less than 24 hours before check-in or for no-shows.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Refund Processing:</strong> Refunds, if applicable, will be processed within 5-10 business days to the original payment method.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        For special events or peak season bookings, different cancellation policies may apply. Please check your booking confirmation for specific terms.
                      </p>
                    </div>
                  </section>

                  {/* Privacy Statement */}
                  <section className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center">
                        <span className="text-white text-xl">🔒</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Privacy Statement</h3>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Data Collection:</strong> We collect personal information including name, email, phone number, and payment details solely for the purpose of processing your reservation and providing you with the best service.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Data Protection:</strong> Your personal information is securely stored and protected using industry-standard encryption and security measures. We do not sell, trade, or share your personal information with third parties without your consent.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Communication:</strong> We may use your contact information to send booking confirmations, important updates about your stay, and promotional offers. You can opt-out of promotional communications at any time.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-gray-900">Your Rights:</strong> You have the right to access, update, or delete your personal information at any time. Please contact us at reservations@rosarioresort.com for any privacy-related requests.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        By making a reservation, you acknowledge that you have read and understood our privacy policy. For more details, please visit our website.
                      </p>
                    </div>
                  </section>

                  {/* Contact Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Questions?</strong> Contact us at{" "}
                      <a href="tel:09499906350" className="text-blue-600 hover:text-blue-700 font-semibold">
                        📞 0949-990-6350
                      </a>
                      {" "}or{" "}
                      <a href="mailto:reservations@rosarioresort.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                        ✉️ reservations@rosarioresort.com
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-8">Room Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roomCommonData.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                    <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">{spec.title}</p>
                    <p className="text-gray-600 leading-relaxed">{spec.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Description Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-6">About This Room</h3>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
              Discover the perfect blend of luxury and comfort at Rosario Resort and Hotel. Our provincial resort offers a unique escape, where modern amenities meet the vibrant energy of urban life. Whether you're here for business or leisure, we ensure an unforgettable stay with exceptional service and stunning surroundings.
            </p>
          </div>
        </motion.section>

        {/* Host Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={assets.logoPicture}
                  alt="Hotel-Owner"
                  className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl md:text-2xl font-playfair font-bold text-gray-900 mb-2">
                  Hosted By Rosario Resort and Hotel
                </h4>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <StarRating />
                  <span className="text-sm font-medium text-gray-600">200+ Reviews</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
