import React from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center px-4 md:px-6 lg:px-16 xl:px-24 bg-gradient-to-b from-[#fafafa] via-[#f8f8f8] to-[#f1f1f1] py-12 md:py-24 overflow-hidden">

      {/* Subtle glowing orbs for depth */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-amber-300/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-pink-400/20 blur-3xl rounded-full"></div>

      {/* Section Title */}
      <div className="w-full max-w-7xl">
        <Title
          title="Featured Rooms"
          subTitle="Discover our handpicked rooms that offer unparalleled luxury and unforgettable experiences."
        />
      </div>

      {/* Horizontal Scroll Row - Responsive */}
      <div className="flex items-center gap-4 md:gap-6 lg:gap-8 mt-8 md:mt-12 lg:mt-20 overflow-x-auto scrollbar-hide w-full max-w-7xl snap-x snap-mandatory pb-4 md:pb-0">
        {roomsDummyData.slice(0, 3).map((room, index) => (
          <div
            key={room._id}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] transform hover:scale-[1.03] md:hover:scale-[1.05] transition-all duration-500 hover:drop-shadow-2xl snap-center"
          >
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <HotelCard room={room} index={index} />
            </div>
          </div>
        ))}
      </div>

      {/* View All Rooms Button */}
      <button
        onClick={() => {
          navigate("/accommodation"); 
          window.scrollTo(0, 0);
        }}
        className="relative mt-8 md:mt-12 lg:mt-20 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-semibold rounded-full text-white bg-gradient-to-r from-blue-500 to-yellow-500 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        View All Rooms
      </button>
    </div>
  );
};

export default FeaturedDestination;
