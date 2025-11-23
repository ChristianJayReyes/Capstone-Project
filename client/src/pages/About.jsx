import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import heroImage from "../assets/heroImage.png";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import LoginForm from "./LoginForm";

const About = () => {
  const { user } = useAppContext();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleClick = () => {
    if (!user) {
      alert("Please log in first to send a message.");
      return;
    }

    // Once the user is logged in, open Gmail compose
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nonreplyrosarioresorts@gmail.com&su=Inquiry&body=Hello%20Rosario%20Resort,%0A%0AI%20would%20like%20to%20inquire%20about...`;
    window.open(gmailUrl, "_blank");
  };


  return (
    <motion.div
      className="about-page font-sans text-gray-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full bg-cover bg-center bg-fixed flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={assets.poolers}
          alt="Resort Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/70 backdrop-blur-[1px]"></div>

        {/* Floating Decorative Shapes */}
        <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-indigo-400 font-semibold mb-4">
              Our Journey
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 via-pink-500 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                About Rosario Resort
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 text-gray-200 tracking-wide leading-relaxed max-w-2xl mx-auto">
              Where luxury meets Filipino hospitality in the heart of Batangas
            </p>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Resort History */}
      <motion.section
        className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Image */}
          <motion.div
            className="relative group order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Gradient border effect */}
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={assets.pavillion}
                alt="Our Story"
                className="w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl border border-white/20 shadow-2xl space-y-5 sm:space-y-6 text-white order-1 md:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[0.2em] text-indigo-400 font-semibold text-xs sm:text-sm">
              Behind the Scene
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg">
              Nestled in the heart of Rosario, our resort has been a sanctuary
              of comfort and style since its founding. Combining modern luxury
              with Filipino hospitality, we've created an experience where every
              guest feels at home — surrounded by beauty, serenity, and joy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold text-sm sm:text-base rounded-full transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-indigo-500/50 relative overflow-hidden group"
              onClick={() => document.getElementById("vision-mission-section").scrollIntoView({ behavior: "smooth"})}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View More
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white via-indigo-50/30 via-purple-50/30 to-white overflow-hidden" 
        id="vision-mission-section"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold mb-3 sm:mb-4">
              Our Foundation
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-playfair mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vision, Mission & Philosophy
              </span>
            </h2>
            <div className="mt-4 sm:mt-6 w-20 sm:w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Philosophy Card */}
          <motion.div
            className="max-w-4xl mx-auto mb-10 sm:mb-12 md:mb-16 px-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              {/* Gradient border effect */}
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl border border-white/50 transform transition-all duration-500 group-hover:scale-[1.01]">
                <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Our Philosophy
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                      Resolves around creating memorable experiences for our guests. We believe in providing exceptional hospitality and ensuring that every individual who walks through our doors feels valued, cared for, and inspired.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto px-2">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative group h-full">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 h-full flex flex-col transform transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl mb-4">
                      <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed flex-grow">
                    Our mission is to contribute to Rosario, Batangas, by means of employment opportunities and to give exceptional hospitality, and to create unforgettable experiences for our guests, ensuring utmost comfort and fostering a welcoming atmosphere.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      <span className="text-sm sm:text-base">Community Impact</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative group h-full">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 h-full flex flex-col transform transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 flex items-center justify-center shadow-xl mb-4">
                      <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed flex-grow">
                    Our vision is to be a premier destination that epitomizes luxury, calmness, and exceptional service, creating lifelong memories for our guests, and to contribute, and be part of the growing economy in Rosario, Batangas.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-purple-600 font-semibold">
                      <span className="text-sm sm:text-base">Excellence & Growth</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto space-y-10 sm:space-y-12 md:space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-indigo-200 font-semibold mb-4">
              Get In Touch
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              Let's Connect
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Have questions or planning your next stay? Reach out to us — we're
              here to make your experience seamless and unforgettable.
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-white/50 to-white mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/30"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">📧 Email</h3>
              <p className="text-sm sm:text-base md:text-lg break-words">reserve.rosario@gmail.com</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/30"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">📞 Phone</h3>
              <p className="text-sm sm:text-base md:text-lg">
                0949-990-6350<br className="sm:hidden" />
                <span className="hidden sm:inline"> / </span>
                0977-806-4396
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/30 sm:col-span-2 md:col-span-1"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">📍 Location</h3>
              <p className="text-sm sm:text-base md:text-lg">
                Brgy. Quilib, Rosario Batangas, Philippines
              </p>
            </motion.div>
          </div>

          {/* Social Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-1 mt-8 sm:mt-10"
          >
            <div className="bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/30">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center justify-center">
                <img
                  src={assets.fb}
                  alt="fb-icon"
                  className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2"
                />
                Facebook
              </h3>
              <p className="text-sm sm:text-base md:text-lg">Rosario Resort and Hotel</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 md:mt-16 px-8 sm:px-10 py-4 sm:py-5 bg-white text-indigo-700 font-semibold text-base sm:text-lg rounded-full shadow-2xl hover:bg-indigo-50 transition-all duration-300 w-full sm:w-auto relative overflow-hidden group"
            onClick={handleClick}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Send Us a Message
              <img
                src={assets.mailIcon}
                alt="mail-icon"
                className="inline-block w-5 h-5 sm:w-6 sm:h-6"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </motion.button>

          {/* Floating Login Form */}
          {showLoginForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <LoginForm />
              {/* Optional: clicking outside the form closes it */}
              <div
                className="absolute inset-0"
                onClick={() => setShowLoginForm(false)}
              />
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default About;
