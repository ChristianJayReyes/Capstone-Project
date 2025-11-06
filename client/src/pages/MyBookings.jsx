import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, token, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        console.log("Fetched bookings:", data.bookings);
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data?.message?.includes("jwt expired")
      ) {
        toast.error("Session expired. Please log in again."); 
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUserBookings();
    }
  }, [user, token]);

  useEffect(() => {
    if (bookings.length > 0) fetchUserBookings();
  }, [bookings.length]);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current and upcoming hotel reservations in one place."
        align="left"
      />

      <div>
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Rooms</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
            >
              {/* Room Details */}
              <div className="flex flex-col md:flex-row">
                <img
                  src={assets.sampleRoomImg || "/default-room.jpg"}
                  alt="room"
                  className="min-md:w-44 rounded shadow object-cover"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="font-playfair text-2xl">
                    Room #{booking.room_number}
                    <span className="font-inter text-sm text-gray-500">
                      {" "}
                      ({booking.roomType})
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <img src={assets.guestsIcon} alt="guest-icon" />
                    <span>Adults: {booking.capacity_adults}</span>
                    <span>Children: {booking.capacity_children}</span>
                  </div>
                  <p className="text-base">Total: ₱{booking.totalPrice}</p>
                </div>
              </div>

              {/* Date & Timings */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In:</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.paymentStatus === "Paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.paymentStatus === "Paid"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {booking.paymentStatus}
                  </p>
                </div>
                {booking.paymentStatus !== "Paid" && (
                  <button className="px-4 py-1.5 mt-2 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
