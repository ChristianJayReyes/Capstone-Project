import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative w-full text-gray-200 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Subtle glowing background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div className="relative px-8 md:px-16 lg:px-24 xl:px-32 py-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-20">
          {/* Brand Section */}
          <div className="md:max-w-md">
            <div className="flex items-center gap-3">
              <img
                className="h-10 drop-shadow-lg"
                src={assets.logoPicture}
                alt="Rosario Resort Logo"
              />
              <h2 className="text-2xl font-bold text-white">
                Rosario Resort & Hotel
              </h2>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-gray-300">
              Discover and experience the perfect blend of luxury and comfort at
              Rosario Resort and Hotel. Our city resort offers a unique escape
              where modern amenities meet vibrant urban energy. Whether for
              business or leisure, we ensure an unforgettable stay with
              exceptional service.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com/Rosario.Resort"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-indigo-600 hover:scale-110 transition transform shadow-lg"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-pink-600 hover:scale-110 transition transform shadow-lg"
              >
                <FaInstagram />
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-600 hover:scale-110 transition transform shadow-lg"
              >
                <FaMapMarkerAlt />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 flex flex-col sm:flex-row gap-12 md:gap-20">
            <div>
              <h2 className="font-semibold mb-5 text-white text-lg">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/" className="hover:text-indigo-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-indigo-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.google.com/maps/place/Rosario+Resort+and+Hotel+Grand+Pavilion/@13.8603049,121.2040629,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd14489170a66b:0xd45d9221f9f1ea35!8m2!3d13.8602997!4d121.2066378!16s%2Fg%2F11bw66s9rc?entry=ttu"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 transition"
                  >
                    Location
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-semibold mb-5 text-white text-lg">
                Get in Touch
              </h2>
              <div className="text-sm space-y-3">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-indigo-400" /> 0949-990-6350 /
                  0977-806-4396
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-indigo-400" />{" "}
                  reserve.rosario@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-400" /> Brgy. Quilib,
                  Rosario, Batangas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs md:text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Rosario Resort and Hotel. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
