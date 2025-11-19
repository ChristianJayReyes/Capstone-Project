import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
import { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email.includes("@")) {
      setMessage("Please enter a valid email");
      return;
    }
    const response = await fetch("https://rosario-resort-and-hotel.vercel.app/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
      <Title
        title="Stay Inspired!"
        subTitle="Subscribe to our newsletter and be the first to discover new events and new offers"
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full"
          placeholder="Enter your email"
        />
        <button className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all" onClick={handleSubscribe}>
          Subscribe
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="w-3.5 invert group-hover:translate-x-1 transition-all"
          />
        </button>
        {message && <p className="text-sm text-gray-400 mt-3">{message}</p>}
      </div>
      <p className="text-gray-500 mt-6 text-xs text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive
        updates.
      </p>
    </div>
  );
};

export default NewsLetter;
