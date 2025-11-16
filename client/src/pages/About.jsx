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

  const team = [
    {
      name: "Christian Jay Reyes",
      role: "General Manager",
      img: "https://www.facebook.com/photo/?fbid=10222611158187294&set=a.1264862481315",
    },
    {
      name: "Janna Plata",
      role: "Front Desk Staff",
      img: "https://source.unsplash.com/400x400/?woman,portrait",
    },
    {
      name: "Jed Estor",
      role: "Head Chef",
      img: "https://source.unsplash.com/400x400/?chef,portrait",
    },
  ];

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
              onClick={() => document.getElementById("team-section").scrollIntoView({ behavior: "smooth"})}
            >
              View More →
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Meet the Team */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-indigo-50 via-white to-indigo-100" id="team-section">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800 tracking-tight">
          Meet Our Team
        </h2>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className="group relative bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-8 text-center transform hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full flex items-center justify-center">
                  <p className="text-white text-sm font-semibold tracking-wide">
                    {member.role}
                  </p>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition duration-300">
                {member.name}
              </h3>
              <p className="mt-2 text-gray-600">{member.role}</p>
              <div className="mt-4 h-[3px] w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
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
