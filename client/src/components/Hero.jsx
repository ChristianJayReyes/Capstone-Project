import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[100vh] flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={assets.background}
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
        className="relative z-10 px-6 md:px-12 lg:px-20 xl:px-32 max-w-4xl text-white"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-md">
          Discover Your Perfect Gateway Destination
        </h1>

        <p className="mt-4 text-gray-200 text-base md:text-lg leading-relaxed">
          Experience refined comfort where modern luxury meets vibrant urban
          energy. Escape, unwind, and indulge — your perfect getaway awaits.
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() => {
              navigate("/accommodation");
              window.scrollTo(0, 0);
            }}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Rooms
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </motion.div>

      
        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 md:right-20 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-10 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
