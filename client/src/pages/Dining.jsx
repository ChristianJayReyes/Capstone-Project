import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";

const Dining = () => {
  const categories = [
    "All",
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default Unsplash placeholders
  const HeroImage = "https://source.unsplash.com/1600x900/?restaurant,dining";
  const featured = [
    "https://www.cookingclassy.com/wp-content/uploads/2018/05/grilled-salmon-3.jpg",
    "https://bellyfull.net/wp-content/uploads/2023/02/Spaghetti-Carbonara-blog-1.jpg",
    "https://handletheheat.com/wp-content/uploads/2016/08/ultimate-classic-cheesecake-recipe-SQUARE.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const menu = [
    {
      name: "Grilled Salmon",
      category: "Main Course",
      price: "₱450",
      img: "https://www.cookingclassy.com/wp-content/uploads/2018/05/grilled-salmon-3.jpg",
      desc: "Fresh salmon with herbs.",
    },
    {
      name: "Pasta Carbonara",
      category: "Main Course",
      price: "₱350",
      img: "https://bellyfull.net/wp-content/uploads/2023/02/Spaghetti-Carbonara-blog-1.jpg",
      desc: "Classic creamy pasta.",
    },
    {
      name: "Caesar Salad",
      category: "Starters",
      price: "₱220",
      img: "https://s23209.pcdn.co/wp-content/uploads/2023/01/220905_DD_Chx-Caesar-Salad_051.jpg",
      desc: "Crisp romaine with dressing.",
    },
    {
      name: "Cheesecake",
      category: "Desserts",
      price: "₱200",
      img: "https://handletheheat.com/wp-content/uploads/2016/08/ultimate-classic-cheesecake-recipe-SQUARE.jpg",
      desc: "Rich & creamy cheesecake.",
    },
    {
      name: "Red Wine",
      category: "Beverages",
      price: "₱300",
      img: "https://www.gardeningknowhow.com/wp-content/uploads/2022/07/red-wine-grapes.jpg",
      desc: "Imported fine red wine.",
    },
  ];

  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  return (
    <div className="dining-page font-sans text-gray-900">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-lg animate-fade-in">
            Luxury Dining
          </h1>
          <p className="mt-4 text-xl max-w-2xl opacity-90">
            Experience world-class cuisine crafted by our award-winning chefs.
          </p>
        </div>
      </div>

      {/* Featured Carousel */}
      <div className="relative mt-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          ✨ Featured Dishes
        </h2>
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src={featured[currentSlide]}
            alt="featured"
            className="w-full h-[400px] object-cover transition-all duration-700"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-3 mt-12 flex-wrap">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto py-14 px-6 grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
        {filteredMenu.map((item, idx) => (
          <div
            key={idx}
            className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg overflow-hidden 
                       transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.img}
              alt={item.name}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.desc}</p>
              <div className="flex justify-between items-center mt-5">
                <span className="text-lg font-semibold">{item.price}</span>
            
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">🍷 Reserve Your Table</h2>
        <p className="mb-6 text-lg opacity-90">
          Book now and indulge in an unforgettable dining journey.
        </p>
        <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer transition delay-150 duration-300 ease-in-out hover:translate-y-1 hover:scale-110 hover:bg-indigo-500">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Dining;
