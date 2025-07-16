import React, { useRef, useEffect, useState } from "react";

const ImageSlider = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

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
    }, 3000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          ref={sliderRef}
        >
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png"
            className="w-full flex-shrink-0"
            alt="Slide 1"
          />
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png"
            className="w-full flex-shrink-0"
            alt="Slide 2"
          />
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png"
            className="w-full flex-shrink-0"
            alt="Slide 3"
          />
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png"
            className="w-full flex-shrink-0"
            alt="Slide 4"
          />
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png"
            className="w-full flex-shrink-0"
            alt="Slide 5"
          />
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png"
            className="w-full flex-shrink-0"
            alt="Slide 6"
          />
        </div>
      </div>
      <div className="flex items-center mt-5 space-x-2">
        {[...Array(totalSlides)].map((_, index) => (
          <span
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentSlide === index ? "bg-black" : "bg-black/20"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
