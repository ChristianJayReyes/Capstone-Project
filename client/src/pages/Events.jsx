import React, { use, useState } from "react";
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

const EventPage = () => {
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    "Weddings",
    "Graduations",
    "Birthdays",
    "Anniversaries",
    "Reunions",
    "Christenings",
  ];

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
                    className="w-full h-40 object-cover rounded-xl shadow-md hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
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

              <button className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
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
    </motion.div>
  );
};

export default EventPage;
