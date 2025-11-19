import React, { useState } from "react";
import { assets, eventImages } from "../assets/assets";
import Testimonial from "../components/Testimonial";
import ImageGallery from "../components/ImageGallery";
import wed1 from "../assets/wedding/wed1.png";
import wed2 from "../assets/wedding/wed2.jpg";
import wed3 from "../assets/wedding/wed3.png";
import wed4 from "../assets/wedding/wed4.jpg";
import bday1 from "../assets/birthday/bday1.png";
import bday2 from "../assets/birthday/bday2.jpg";
import bday3 from "../assets/birthday/bday3.jpg";
import bday4 from "../assets/birthday/bday4.jpg";
import binyag1 from "../assets/christening/binyag1.jpg";
import binyag2 from "../assets/christening/binyag2.jpg";
import binyag3 from "../assets/christening/binyag3.jpeg";
import binyag4 from "../assets/christening/binyag4.jpeg";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";

const EventPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [openGallery, setOpenGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    specialRequest: "",
    eventType: "",
  });

  const handleOpenForm = (eventType = "") => {
    if (!token) {
      toast.error("You must log in first to reserve an event.");
      return navigate("/login");
    }

    setFormData({
      customerName: "",
      email: "",
      contactNumber: "",
      specialRequest: "",
      eventType: eventType,
    });
    setOpenForm(true);
  };

  const categories = ["Weddings", "Birthdays", "Christenings"];

  const formatDateToLocal = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const galleryImages = {
    weddings: [wed1, wed2, wed3, wed4],
    graduations: [
      eventImages["graduations"],
      eventImages["graduations"],
      eventImages["graduations"],
    ],
    birthdays: [bday1, bday2, bday3, bday4],
    anniversaries: [
      eventImages["anniversaries"],
      eventImages["anniversaries"],
      eventImages["anniversaries"],
    ],
    reunions: [
      eventImages["reunions"],
      eventImages["reunions"],
      eventImages["reunions"],
    ],
    christenings: [binyag1, binyag2, binyag3, binyag4],
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://rrh-backend.vercel.app/api/eventBookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: formData.customerName,
          email: formData.email,
          contact_number: formData.contactNumber,
          special_request: formData.specialRequest,
          event_type: formData.eventType,
          event_start_date: (() => {
            const date = range[0].startDate;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })(),
          event_end_date: (() => {
            const date = range[0].endDate;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Event booked successfully!, wait for the email confirmation.");
        setOpenForm(false);
        setFormData({
          customerName: "",
          email: "",
          contactNumber: "",
          specialRequest: "",
        });
      } else {
        toast.error(
          data.message || "Failed to submit booking. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      scrollBehavior={"smooth"}
    >
      {/* HERO SECTION */}
      <section className="hero relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={assets.diff_events}
          alt="Event Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

        {/* Floating Decorative Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-text">
              Plan Your Dream Event
            </span>
          </h1>

          <p className="text-lg md:text-2xl mb-10 text-gray-200 tracking-wide ">
            Weddings • Graduations • Birthdays • Anniversaries • Reunions
          </p>

          <button
            onClick={() =>
              document
                .getElementById("packages")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 transition-all duration-300 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-pink-500/50 hover:scale-105"
          >
            Explore Packages
          </button>
        </div>
      </section>

      <section className="event-categories container mx-auto py-20 px-6 relative">
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800 font-playfair relative z-10">
          🎉 Our Event Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {categories.map((category) => (
            <div
              key={category}
              className="group relative rounded-3xl overflow-hidden shadow-xl transition transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Image */}
              <img
                src={eventImages[category.toLowerCase()]}
                alt={category}
                className="w-full h-80 object-cover group-hover:scale-110 transition duration-700 ease-out"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition duration-500"></div>

              {/* Content */}
              <div className="absolute bottom-0 p-6 w-full text-white">
                <h3 className="text-2xl font-bold mb-2">{category}</h3>
                <p className="text-sm opacity-90 leading-snug">
                  Celebrate your special day with our luxurious{" "}
                  {category.toLowerCase()} packages.
                </p>

                <button
                  onClick={() => {
                    setSelectedCategory(category.toLowerCase());
                    setOpenGallery(true);
                  }}
                  className="mt-5 inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-500/50 transition-all text-sm"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Gallery Modal */}
        {openGallery && selectedCategory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[70%] lg:w-[60%] relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setOpenGallery(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-3xl font-bold mb-6 text-gray-800 capitalize text-center">
                {selectedCategory} Gallery
              </h3>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages[selectedCategory].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedCategory} ${idx}`}
                    className="w-full h-40 object-cover rounded-xl shadow-md hover:scale-105 transition cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* Enlarged Image Preview */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setSelectedImage(null)}
              >
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 text-white text-3xl font-bold"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {/* 🌅 EVENT GALLERY SECTION */}
      <div className="relative my-24 flex flex-col items-center bg-gradient-to-b from-gray-100 via-white to-gray-100 py-16 px-6 overflow-hidden">
        {/* Subtle Background Ornaments */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />

        {/* Heading */}
        <h2 className="text-5xl font-extrabold text-center mb-14 text-gray-800 font-playfair tracking-tight relative">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Event Gallery
          </span>
        </h2>

        {/* Image Gallery Component */}
        <div className="relative z-10 w-full max-w-6xl">
          <ImageGallery />
        </div>

        {/* Subtext or Decorative Line (optional) */}
        <p className="text-gray-500 text-sm mt-10 tracking-wide uppercase">
          Capturing the Best Moments at Rosario Resort
        </p>
      </div>
      {/* EVENT PACKAGES / INCLUSIONS */}
      <section
        className="packages container mx-auto py-20 px-6 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden rounded-3xl"
        id="packages"
      >
        {/* Decorative Background */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800 relative z-10">
          ✨ Our Event Packages ✨
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {[
            {
              title: "💍 Premium Wedding Package",
              features: [
                "Elegant Venue Setup",
                "Gourmet Catering",
                "Stunning Decoration",
                "Photography & Videography",
              ],
            },
            {
              title: "🎂 Birthday Celebration Package",
              features: [
                "Themed Decorations",
                "Fun Activities",
                "Tasty Food",
                "Customized Setup",
              ],
            },
            {
              title: "🎓 Graduation Celebration Package",
              features: [
                "Stage & Backdrop Setup",
                "Professional Sound System",
                "Themed Decorations",
                "Photography & Videography",
              ],
            },
            {
              title: "👨‍👩‍👧‍👦 Reunions Celebration Package",
              features: [
                "Cozy Venue Setup",
                "Team Activities",
                "Buffet Catering",
                "Souvenir Photos",
              ],
            },
          ].map((pkg, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl hover:shadow-2xl hover:scale-105 transition transform duration-300"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {pkg.title}
              </h3>

              <ul className="space-y-3">
                {pkg.features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 font-medium"
                  >
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                onClick={() => handleOpenForm(pkg.title)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {/* TESTIMONIALS */}
      <div className="bg-gray-200 py-20">
        <Testimonial />
      </div>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {openForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-[90%] max-w-lg bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8"
          >
            {/* Close button */}
            <button
              onClick={() => setOpenForm(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-800">
              Form for Event Reservation
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Event Type <span className="text-red-500">*</span>
                </label>
                {formData.eventType ? (
                  // Show pre-selected event type (from package selection) as read-only
                  <div>
                    <div className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-blue-50 text-gray-700 font-medium">
                      {formData.eventType}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Event type automatically selected from package.
                    </p>
                  </div>
                ) : (
                  // Show message if no event type is selected (shouldn't happen if opened from package)
                  <div className="w-full px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700">
                    Please select a package to book an event.
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name..."
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your email address..."
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact number..."
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  rows="3"
                  placeholder="Additional requests or details..."
                  value={formData.specialRequest}
                  onChange={(e) =>
                    setFormData({ ...formData, specialRequest: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  Selected Dates:
                </p>
                <p className="text-sm text-gray-600">
                  {range[0].startDate && range[0].endDate
                    ? `${formatDateToLocal(
                        range[0].startDate
                      )} to ${formatDateToLocal(range[0].endDate)}`
                    : "No dates selected"}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenCalendar(true)}
                  className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg shadow-lg hover:scale-105 transition"
                >
                  📅{" "}
                  {range[0].startDate && range[0].endDate
                    ? "Change Dates"
                    : "Select Dates"}
                </button>

                <button
                  type="submit"
                  className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg shadow-lg hover:scale-105 transition"
                >
                  Confirm
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {openCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] md:w-[450px] border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
              Select Event Dates
            </h2>

            <div className="rounded-lg border border-gray-200 overflow-hidden w-full">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                rangeColors={["#2563eb"]}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setOpenCalendar(false)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOpenCalendar(false);
                  toast.success("Event date selected successfully!");
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EventPage;