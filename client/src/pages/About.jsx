import React from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import heroImage from "../assets/heroImage.png"

const About = () => {
  const team = [
    {
      name: "Juan Dela Cruz",
      role: "General Manager",
      img: "https://source.unsplash.com/400x400/?businessman,portrait",
    },
    {
      name: "Maria Santos",
      role: "Front Desk Staffs",
      img: "https://source.unsplash.com/400x400/?woman,portrait",
    },
    {
      name: "Carlos Reyes",
      role: "Head Chef",
      img: "https://source.unsplash.com/400x400/?chef,portrait",
    },
    {
      name: "Carlos Reyes",
      role: "Head Chef",
      img: "https://source.unsplash.com/400x400/?chef,portrait",
    },
    {
      name: "Carlos Reyes",
      role: "Head Chef",
      img: "https://source.unsplash.com/400x400/?chef,portrait",
    },
    {
      name: "Carlos Reyes",
      role: "Head Chef",
      img: "https://source.unsplash.com/400x400/?chef,portrait",
    },
  ];

  return (
    <div className="about-page font-sans text-gray-900">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center text-center text-white px-6">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-2xl">
              Welcome to Paradise
            </h1>
            <p className="mt-4 text-xl opacity-90 max-w-2xl mx-auto">
              Experience luxury, comfort, and unforgettable memories at our
              resort.
            </p>
          </div>
        </div>
      </div>

      {/* Resort History */}
      <div className="bg-gray-400 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <div>
            <img
              src={assets.pavillion}
              alt="Our Story"
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Text */}
          <div className="space-y-6">
            <p className="italic text-white-400">Behind the scene</p>
            <h2 className="text-5xl font-bold">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="mt-6 px-6 py-3 border border-white rounded hover:bg-white hover:text-black transition">
              View More
            </button>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="py-20 px-6 bg-white relative">
        <h2 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Meet Our Team
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-8 text-center transform hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              <div className="relative w-40 h-40 mx-auto mb-6">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative py-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-8">Let’s Connect</h2>
          <p className="text-lg mb-12 opacity-90 max-w-3xl mx-auto">
            Have questions or planning your next stay? Reach out to us — we’re
            here to make your experience seamless and unforgettable.
          </p>

          {/* Glassy Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p className="text-lg">reserve.rosario@gmail.com</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
              <p className="text-lg">+63 912 345 6789</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📍 Location</h3>
              <p className="text-lg">
                Brgy. Quilib, Rosario Batangas, Philippines
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-1 mt-8 w-full">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2 ">
                <span>
                  <img
                    src={assets.fb}
                    alt="fb-icon"
                    className="inline-block w-5 h-5 mr-2 mb-2"
                  />
                </span>
                Facebook
              </h3>
              <p className="text-lg">Rosario Resort and Hotel</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <button
              className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-100 transition transform hover:scale-110"
              onClick={() =>
                (window.location.href = "mailto:sales.rosarioresort@gmail.com")
              }
            >
              Send Us a Message{" "}
              <span>
                <img
                  src={assets.mailIcon}
                  alt="mail-icon"
                  className="inline-block w-5 h-5 ml-2"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
