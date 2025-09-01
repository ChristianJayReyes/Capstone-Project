import React from "react";
import { useState } from "react";

const About = () => {
  const team = [
    {
      name: "Juan Dela Cruz",
      role: "Resort Owner",
      img: "https://source.unsplash.com/400x400/?businessman,portrait",
    },
    {
      name: "Maria Santos",
      role: "Front Desk Manager",
      img: "https://source.unsplash.com/400x400/?woman,portrait",
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
          backgroundImage: `url(https://source.unsplash.com/1600x900/?luxury,resort)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center text-center text-white px-6">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-2xl">
              Welcome to Paradise
            </h1>
            <p className="mt-4 text-xl opacity-90 max-w-2xl mx-auto">
              Experience luxury, comfort, and unforgettable memories at our resort.
            </p>
          </div>
        </div>
      </div>

      {/* Resort History */}
      <div className="relative py-20 px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            🏝 Our Story
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">
            Since 1995, our resort has been a sanctuary for travelers seeking both
            peace and adventure by the sea. From humble beginnings as a small
            family-run inn, we have transformed into one of the region’s most
            celebrated destinations — blending world-class amenities with the warmth
            of Filipino hospitality.
          </p>
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
          <h2 className="text-5xl font-bold mb-8">📞 Let’s Connect</h2>
          <p className="text-lg mb-12 opacity-90 max-w-3xl mx-auto">
            Have questions or planning your next stay? Reach out to us — we’re here
            to make your experience seamless and unforgettable.
          </p>

          {/* Glassy Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p className="text-lg">contact@resort.com</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
              <p className="text-lg">+63 912 345 6789</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📍 Location</h3>
              <p className="text-lg">Brgy. Quilib, Rosario Batangas, Philippines</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <button className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-100 transition transform hover:scale-110">
              Send Us a Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
