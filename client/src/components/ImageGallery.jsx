import React, { useRef, useEffect, useState } from "react";
import bday1 from "../assets/birthday/bday1.png";
import bday2 from "../assets/birthday/bday2.jpg";
import bday3 from "../assets/birthday/bday3.jpg";
import bday4 from "../assets/birthday/bday4.jpg";
import { assets } from "../assets/assets";

const ImageSlider = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5; // Adjusted to match actual number of images

  const goToSlide = (index) => {
    const slider = sliderRef.current;
    if (slider) {
      const slideWidth = slider.clientWidth;
      slider.style.transform = `translateX(-${index * slideWidth}px)`;
    }
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  const slides = [bday1, bday2, bday3, bday4, assets.sem1];

  return (
    <div className="relative flex flex-col items-center py-10 bg-gradient-to-b from-white to-gray-100">
      {/* Main Slider */}
      <div className="w-full max-w-6xl overflow-hidden relative rounded-3xl shadow-2xl">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-in-out"
        >
          {slides.map((img, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              {/* Image */}
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-[550px] object-cover rounded-3xl"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-3xl" />

              {/* Optional Caption Area */}
              <div className="absolute bottom-10 left-0 right-0 text-center text-white">
                <h3 className="text-2xl font-semibold tracking-wide drop-shadow-md animate-fade-in">
                  {index === 0
                    ? "Celebrate in Style"
                    : index === 1
                    ? "Unforgettable Moments"
                    : index === 2
                    ? "Luxury & Joy Combined"
                    : index === 3
                    ? "A Place for Every Occasion"
                    : "Create Your Perfect Memory"}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Left/Right Controls */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? totalSlides - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black rounded-full p-3 backdrop-blur-md transition shadow-lg"
        >
          ‹
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % totalSlides)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black rounded-full p-3 backdrop-blur-md transition shadow-lg"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center mt-6 space-x-3">
        {[...Array(totalSlides)].map((_, index) => (
          <span
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 scale-125 shadow-md"
                : "bg-gray-400/50 hover:bg-gray-600/70"
            }`}
          ></span>
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}; 

export default ImageSlider;
