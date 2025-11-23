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
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/70 backdrop-blur-[1px]"></div>

        {/* Floating Decorative Shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 font-semibold mb-4">
              Celebrate Life's Moments
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 via-indigo-500 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Plan Your Dream Event
              </span>
            </h1>

            <p className="text-lg md:text-2xl mb-10 text-gray-200 tracking-wide leading-relaxed">
              Weddings • Graduations • Birthdays • Anniversaries • Reunions
            </p>

            <motion.button
              onClick={() =>
                document
                  .getElementById("packages")
                  .scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-500 transition-all duration-300 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-pink-500/50 relative overflow-hidden group"
            >
              <span className="relative z-10">Explore Packages</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="event-categories container mx-auto py-24 px-6 relative bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl"></div>

        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-widest text-pink-600 font-semibold mb-3">
            Event Types
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 font-playfair mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              🎉 Our Event Categories
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-7xl mx-auto">
          {[
            {
              category: "Weddings",
              image: wed2,
              gradient: "from-pink-500 via-rose-500 to-red-500",
              icon: "💍",
              description: "Elegant ceremonies and unforgettable celebrations"
            },
            {
              category: "Birthdays",
              image: bday2,
              gradient: "from-purple-500 via-pink-500 to-fuchsia-500",
              icon: "🎂",
              description: "Joyful celebrations for all ages"
            },
            {
              category: "Christenings",
              image: binyag2,
              gradient: "from-indigo-500 via-blue-500 to-cyan-500",
              icon: "👶",
              description: "Blessed moments and family gatherings"
            }
          ].map((item, idx) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Enhanced Gradient border effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500`}></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl h-full">
                {/* Image with enhanced effects */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-125"
                  />
                  
                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Icon badge */}
                  <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {item.icon}
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="mb-3">
                    <h3 className="text-3xl md:text-4xl font-extrabold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-indigo-300 group-hover:bg-clip-text transition-all duration-300">
                      {item.category}
                    </h3>
                    <p className="text-sm sm:text-base opacity-95 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => {
                      setSelectedCategory(item.category.toLowerCase());
                      setOpenGallery(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-block bg-gradient-to-r ${item.gradient} hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base relative overflow-hidden group/btn`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      See More
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Gallery Modal */}
        <AnimatePresence>
          {openGallery && selectedCategory && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenGallery(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setOpenGallery(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:text-black transition-all duration-300 hover:scale-110 shadow-lg z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 capitalize mb-2">
                    <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {selectedCategory} Gallery
                    </span>
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {galleryImages[selectedCategory].map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${selectedCategory} ${idx}`}
                        className="w-full h-48 md:h-56 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enlarged Image Preview */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedImage(null)}
                  >
                    <motion.img
                      src={selectedImage}
                      alt="Preview"
                      className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full my-16"></div>

      {/* 🌅 EVENT GALLERY SECTION */}
      <div className="relative my-24 flex flex-col items-center bg-gradient-to-b from-white via-gray-50 to-white py-20 px-6 overflow-hidden">
        {/* Subtle Background Ornaments */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.1),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-widest text-pink-600 font-semibold mb-3">
            Memories Captured
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 font-playfair tracking-tight mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Event Gallery
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Image Gallery Component */}
        <div className="relative z-10 w-full max-w-6xl">
          <ImageGallery />
        </div>

        {/* Subtext or Decorative Line (optional) */}
        <motion.p
          className="text-gray-500 text-sm mt-10 tracking-wide uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Capturing the Best Moments at Rosario Resort
        </motion.p>
      </div>
      {/* EVENT PACKAGES / INCLUSIONS */}
      <section
        className="packages container mx-auto py-24 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
        id="packages"
      >
        {/* Decorative Background */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl"></div>

        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-widest text-pink-600 font-semibold mb-3">
            Choose Your Package
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ✨ Our Event Packages ✨
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-6xl mx-auto">
          {[
            {
              title: "💍 Premium Wedding Package",
              features: [
                "Elegant Venue Setup",
                "Gourmet Catering",
                "Stunning Decoration",
                "Photography & Videography",
              ],
              gradient: "from-pink-500 to-rose-600",
            },
            {
              title: "🎂 Birthday Celebration Package",
              features: [
                "Themed Decorations",
                "Fun Activities",
                "Tasty Food",
                "Customized Setup",
              ],
              gradient: "from-purple-500 to-indigo-600",
            },
            {
              title: "🎓 Graduation Celebration Package",
              features: [
                "Stage & Backdrop Setup",
                "Professional Sound System",
                "Themed Decorations",
                "Photography & Videography",
              ],
              gradient: "from-indigo-500 to-blue-600",
            },
            {
              title: "👨‍👩‍👧‍👦 Reunions Celebration Package",
              features: [
                "Cozy Venue Setup",
                "Team Activities",
                "Buffet Catering",
                "Souvenir Photos",
              ],
              gradient: "from-pink-500 to-purple-600",
            },
          ].map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Gradient border effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${pkg.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              <div className="relative p-8 rounded-3xl bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] h-full flex flex-col">
                <h3 className={`text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                  {pkg.title}
                </h3>

                <ul className="space-y-4 flex-grow mb-6">
                  {pkg.features.map((f, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (i * 0.1) + (idx * 0.05) }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${pkg.gradient} flex-shrink-0`}></div>
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${pkg.gradient} text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl`}
                  onClick={() => handleOpenForm(pkg.title)}
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full my-16"></div>

      {/* TESTIMONIALS */}
      <div className="bg-gradient-to-b from-gray-100 via-white to-gray-100 py-20">
        <Testimonial />
      </div>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full my-16"></div>

      <AnimatePresence>
        {openForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 md:p-10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setOpenForm(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:text-black transition-all duration-300 hover:scale-110 shadow-lg z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
                  <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Event Reservation
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
              </div>

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

              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-8">
                <motion.button
                  type="button"
                  onClick={() => setOpenCalendar(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-1/2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {range[0].startDate && range[0].endDate
                    ? "Change Dates"
                    : "Select Dates"}
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openCalendar && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCalendar(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                  <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Select Event Dates
                  </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden w-full shadow-lg">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  rangeColors={["#8b5cf6"]}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  onClick={() => setOpenCalendar(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    setOpenCalendar(false);
                    toast.success("Event date selected successfully!");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white hover:shadow-lg shadow-md transition-all duration-200 font-semibold"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventPage;