import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
  return (
    <div className="relative flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-32 bg-gradient-to-b from-[#f9fafb] to-[#f1f1f1] overflow-hidden">

      {/* Decorative blurred background orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full relative z-10">
        <Title
          align="left"
          title="✨ Exclusive Offers for the month of October!"
          subTitle="Indulge in our limited-time offers crafted to elevate your experience and create timeless memories."
        />
        {/* <button
          className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12 bg-black text-white px-5 py-3 rounded-full hover:bg-gradient-to-r hover:from-amber-500 hover:to-pink-500 transition-all duration-300 shadow-md"
          onClick={() => (window.location.href = "/offers")}
        >
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrowIcon"
            className="group-hover:translate-x-2 transition-all w-4"
          />
        </button> */}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 relative z-10 w-full">
        {exclusiveOffers.map((item) => (
          <div
            onClick={() => window.open(item.link, "_blank")}
            key={item._id}
            className="group relative overflow-hidden rounded-2xl shadow-lg bg-no-repeat bg-cover bg-center h-[320px] flex flex-col justify-end text-white cursor-pointer transition-all duration-500 hover:scale-[1.03]"
            style={{
              backgroundImage: `url(${item.image})`,
            }}
            
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500"></div>

            {/* Discount Tag */}
            <div className="absolute top-5 left-5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold text-xs rounded-full shadow-lg">
              {item.priceOff}% OFF
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <h3 className="text-2xl font-bold font-playfair mb-2 group-hover:text-amber-400 transition-all duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-gray-200 max-w-sm">
                {item.description}
              </p>
              <p className="text-xs text-gray-300 mt-3 italic">
                Expires {item.expiryDate}
              </p>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
