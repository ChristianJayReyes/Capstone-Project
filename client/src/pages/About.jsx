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
      <div
        className="h-[750px] bg-full bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${assets.poolers})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            
          </motion.div>
        </div>
      </div>

      {/* Resort History */}
      <motion.section
        className="relative py-24 px-6 overflow-hidden bg-gray-900"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="relative rounded-xl overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-xl blur opacity-30"></div>
            <img
              src={assets.pavillion}
              alt="Our Story"
              className="relative w-full h-[500px] object-cover rounded-xl"
            />
          </motion.div>

          {/* Text */}
          <div className="backdrop-blur-lg bg-white/10 p-10 rounded-2xl border border-white/20 shadow-xl space-y-6 text-white">
            <p className="uppercase tracking-widest text-indigo-400 font-semibold">
              Behind the Scene
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Nestled in the heart of Rosario, our resort has been a sanctuary
              of comfort and style since its founding. Combining modern luxury
              with Filipino hospitality, we’ve created an experience where every
              guest feels at home — surrounded by beauty, serenity, and joy.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(99,102,241,0.5)",
              }}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-full transition-all"
              onClick={() => document.getElementById("vision-mission-section").scrollIntoView({ behavior: "smooth"})}
            >
              View More →
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <section 
        className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50 overflow-hidden" 
        id="vision-mission-section"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">
              Our Foundation
            </p>
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vision, Mission & Philosophy
            </h2>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Philosophy Card */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              {/* Gradient border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Our Philosophy
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Resolves around creating memorable experiences for our guests. We believe in providing exceptional hospitality and ensuring that every individual who walks through our doors feels valued, cared for, and inspired.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative group h-full">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-grow">
                    Our mission is to contribute to Rosario, Batangas, by means of employment opportunities and to give exceptional hospitality, and to create unforgettable experiences for our guests, ensuring utmost comfort and fostering a welcoming atmosphere.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      <span className="text-sm">Community Impact</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg mb-4">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-grow">
                    Our vision is to be a premier destination that epitomizes luxury, calmness, and exceptional service, creating lifelong memories for our guests, and to contribute, and be part of the growing economy in Rosario, Batangas.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-purple-600 font-semibold">
                      <span className="text-sm">Excellence & Growth</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="relative py-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-5xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold">Let’s Connect</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Have questions or planning your next stay? Reach out to us — we’re
            here to make your experience seamless and unforgettable.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p className="text-lg">reserve.rosario@gmail.com</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
              <p className="text-lg">0949-990-6350 /
                  0977-806-4396</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📍 Location</h3>
              <p className="text-lg">
                Brgy. Quilib, Rosario Batangas, Philippines
              </p>
            </div>
          </div>

          {/* Social Card */}
          <div className="grid md:grid-cols-1 mt-8">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
                <img
                  src={assets.fb}
                  alt="fb-icon"
                  className="inline-block w-5 h-5 mr-2"
                />
                Facebook
              </h3>
              <p className="text-lg">Rosario Resort and Hotel</p>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="mt-12 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-100 transition transform"
            onClick={handleClick}
          >
            Send Us a Message{" "}
            <img
              src={assets.mailIcon}
              alt="mail-icon"
              className="inline-block w-5 h-5 ml-2"
            />
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
