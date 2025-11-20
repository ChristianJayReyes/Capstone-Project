import React, { useEffect, useState } from "react";
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
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(""); // Will be auto-assigned

  // Discount
  const [selectedDiscount, setSelectedDiscount] = useState("None");
  
  // ID Image Upload
  const [idImage, setIdImage] = useState(null);
  const [idImagePreview, setIdImagePreview] = useState(null);

  // Context
  const { axios, token, user, setBookings } = useAppContext();

  // Confirm Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Calendar state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Load Room Numbers from API (filter out Booked and Maintenance)
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!room) return;

      try {
        // Fetch all rooms and filter by status and room type
        const response = await fetch(
          `https://rrh-backend.vercel.app/api/rooms/getRooms.php`
        );
        const data = await response.json();

        if (data.success && data.data) {
          // Get the room type name from the current room
          const roomTypeName = room?.hotel?.name || room?.roomType || "";
          
          // Filter rooms: exclude Booked and Maintenance, match room type
          const availableRooms = data.data.filter((r) => {
            const status = (r.status || "").toLowerCase();
            // Exclude Booked and Maintenance rooms
            if (status === "booked" || status === "maintenance") {
              return false;
            }
            // Only show Available rooms
            if (status !== "available") {
              return false;
            }
            // Match room type if we have a room type name
            if (roomTypeName && r.type_name) {
              return r.type_name === roomTypeName;
            }
            // If no room type match needed, show all available
            return true;
          });

          // Extract room numbers
          const filteredRoomNumbers = availableRooms
            .map((r) => r.room_number)
            .filter((num) => num) // Remove any null/undefined
            .sort((a, b) => {
              // Sort room numbers naturally (101, 102, 201, etc.)
              const numA = parseInt(a) || 0;
              const numB = parseInt(b) || 0;
              return numA - numB;
            });

          setRoomNumbers(filteredRoomNumbers);
          
          // Auto-select first available room number
          if (filteredRoomNumbers.length > 0) {
            setSelectedRoomNumber(filteredRoomNumbers[0]);
          } else {
            setSelectedRoomNumber("");
          }
        } else {
          // Fallback to dummy data if API fails
          const hotel = hotelDummyData.find(
            (hotelItem) => hotelItem.name === room.hotel.name
          );
          if (hotel && hotel.roomNumbers) {
            setRoomNumbers(hotel.roomNumbers);
            if (hotel.roomNumbers.length > 0) {
              setSelectedRoomNumber(hotel.roomNumbers[0]);
            }
          } else {
            setRoomNumbers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching available rooms:", error);
        // Fallback to dummy data on error
        const hotel = hotelDummyData.find(
          (hotelItem) => hotelItem.name === room.hotel.name
        );
        if (hotel && hotel.roomNumbers) {
          setRoomNumbers(hotel.roomNumbers);
          if (hotel.roomNumbers.length > 0) {
            setSelectedRoomNumber(hotel.roomNumbers[0]);
          }
        } else {
          setRoomNumbers([]);
        }
      }
    };

    fetchAvailableRooms();
  }, [room]);

  // Handle ID Image Upload
  const handleIdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }
      setIdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    
    // Validate discount and ID image
    if (selectedDiscount !== "None" && !idImage) {
      alert("Please upload your ID image to avail the discount.");
      return;
    }

    try {
      const response = await fetch(
        `https://rrh-backend.vercel.app/api/rooms/check/${selectedRoomNumber}`
      );
      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setIsOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error checking room availability");
    }
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

      // Discount
      discount: selectedDiscount,

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
      roomNumber: selectedRoomNumber,
      roomRate: room?.pricePerNight || 0,
      idImage: idImagePreview, // Base64 preview for display
      idImageFile: idImage, // Actual file for upload

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

      // Calculate base price
      let basePrice = Number(formData.roomRate) * nights;
      
      // Apply 20% discount if PWD or Senior Citizen
      let discountAmount = 0;
      if (formData.discount === "PWD" || formData.discount === "Senior Citizen") {
        discountAmount = basePrice * 0.2;
      }
      
      const totalPrice = basePrice - discountAmount;

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("roomId", room?._id);
      formDataToSend.append("roomNumber", formData.roomNumber || ""); // Can be empty, assigned by admin
      formDataToSend.append("checkInDate", formData.checkIn);
      formDataToSend.append("checkOutDate", formData.checkOut);
      formDataToSend.append("adults", formData.adults);
      formDataToSend.append("children", formData.children);
      formDataToSend.append("totalPrice", totalPrice);
      formDataToSend.append("basePrice", basePrice);
      formDataToSend.append("discountAmount", discountAmount);
      formDataToSend.append("isPaid", "false");
      formDataToSend.append("guestName", formData.name);
      formDataToSend.append("phoneNumber", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("nationality", formData.nationality || "");
      formDataToSend.append("discountType", formData.discount || "None");
      formDataToSend.append("roomName", formData.roomName);
      formDataToSend.append("roomRate", formData.roomRate);
      formDataToSend.append("deposit", formData.deposit || 0);
      formDataToSend.append("paymentMode", formData.payment || "Cash");
      formDataToSend.append("signature", formData.signature || "");
      formDataToSend.append("remarks", formData.remarks || "");
      
      // Append ID image if exists
      if (formData.idImageFile) {
        formDataToSend.append("idImage", formData.idImageFile);
      }

      const { data } = await axios.post("/api/bookings/book", formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (data.success) {
        toast.success("Booking confirmed! Check your email for confirmation.");
        setBookings((prev) => [data.booking, ...prev]);
        setShowForm(false);
        // Reset form
        setIdImage(null);
        setIdImagePreview(null);
        setSelectedDiscount("None");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong while confirming the booking.";
      toast.error(errorMessage);
    }
  };

  return (
    room && (
      <div className="py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name} <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="font-inter text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Room Rating */}
        <div className="flex flex-row">
          <StarRating />
          <p className="ml-2 text-sm font-inter">200+ Reviews</p>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="w-full lg:w-1/2">
            <img src={mainImage} alt="room" className="w-full rounded-xl shadow-lg object-cover" />
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
            <h1 className="text-4xl font-playfair">Experience Luxury Like Never Before</h1>
            <div className="flex flex-wrap">
              {room.amenities.map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/100">
                  <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Room Price */}
          <p className="text-2xl font-medium">₱{room.pricePerNight}/night</p>
        </div>

        {/* Check In/Out Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] rounded-xl p-6 mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            {/* Adults */}
            <div className="flex flex-col">
              <label htmlFor="adults" className="font-medium">
                Adults
              </label>
              <input
                type="number"
                id="adults"
                placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                defaultValue={1}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Children */}
            <div className="flex flex-col">
              <label htmlFor="children" className="font-medium">
                Children
              </label>
              <input
                type="number"
                id="children"
                placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                defaultValue={0}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Room Number (Static Display) */}
            <div className="flex flex-col">
              <label className="font-medium">
                Available Rooms
              </label>
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">
                {roomNumbers.length > 0 
                  ? roomNumbers.join(", ") 
                  : "No rooms available"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Room will be assigned by admin</p>
            </div>

            {/* Divider */}
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Discount Selection */}
            <div className="flex flex-col">
              <label htmlFor="discount" className="font-medium">
                Discount
              </label>
              <select
                id="discount"
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-[#007BFF] border border-gray-300"
              >
                <option value="None">None</option>
                <option value="PWD">PWD (20% off)</option>
                <option value="Senior Citizen">Senior Citizen (20% off)</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* ID Image Upload */}
            {selectedDiscount !== "None" && (
              <div className="flex flex-col">
                <label htmlFor="idImage" className="font-medium">
                  Upload ID {selectedDiscount === "PWD" ? "(PWD ID)" : "(Senior Citizen ID)"}
                </label>
                <input
                  id="idImage"
                  type="file"
                  accept="image/*"
                  onChange={handleIdImageChange}
                  className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 outline-none focus:ring-2 focus:ring-[#007BFF] text-sm"
                  required={selectedDiscount !== "None"}
                />
                {idImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={idImagePreview} 
                      alt="ID Preview" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full md:mt-4 md:px-25 py-3 md:py-4 text-base cursor-pointer"
          >
            Check Date
          </button>
        </form>

        {/* Date Picker Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
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

        {/* Room Common Data */}
        <div className="mt-15 space-y-5">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Discover the perfect blend of luxury and comfort at Rosario Resort and Hotel. Our provincial resort offers a unique escape, where modern amenities meet the vibrant energy of urban life. Whether you're here for business or leisure, we ensure an unforgettable stay with exceptional service and stunning surroundings.
          </p>
        </div>

        {/* Hotel Manager */}
        <div className="flex flex-col items-start gap-4">
          <div>
            <img src={assets.logoPicture} alt="Hotel-Owner" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
            <div>
              <p className="text-lg md:text-xl">Hosted By Rosario Resort and Hotel</p>
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
