import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import f1 from "../assets/foods/f1.jpg";
import f2 from "../assets/foods/f2.jpeg";
import f3 from "../assets/foods/f3.jpg";
import f4 from "../assets/foods/f4.jpeg";
import f5 from "../assets/foods/f5.jpeg";
import f6 from "../assets/foods/f6.jpeg";
import f7 from "../assets/foods/f7.jpeg";
import f8 from "../assets/foods/f8.jpeg";
import f9 from "../assets/foods/f9.jpeg";
import f10 from "../assets/foods/f10.jpeg";
import f11 from "../assets/foods/f11.jpeg";
import f12 from "../assets/foods/f12.jpeg";
import f13 from "../assets/foods/f13.jpeg";
import f14 from "../assets/foods/f14.jpeg";
import f15 from "../assets/foods/f15.jpeg";
import dining_background from "../assets/dining_background.jpg";
import { motion } from "framer-motion";

const Dining = () => {
  const categories = [
    "All",
    "Starters",
    "Breakfast",
    "Main Course",
    "Desserts",
    "Beverages",
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default Unsplash placeholders
  const featured = [
    f1,
    f2,
    f3,
    f4,
    f5,
    f6,
    f7,
    f8,
    f9,
    f10,
    f11,
    f12,
    f13,
    f14,
    f15,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const menu = [
    {
      name: "Fried Tilapia",
      category: "Main Course",
      price: "₱450",
      img: f4,
      desc: "Fresh Tilapia with herbs.",
    },
    {
      name: "Cantonese Fried Chicken",
      category: "Main Course",
      price: "₱350",
      img: f1,
      desc: "Classic Cantonese fried chicken.",
    },
    {
      name: "Garlic Butter Shrimp",
      category: "Main Course",
      price: "₱220",
      img: f11,
      desc: "Garlic butter shrimp served with lemon.",
    },
    {
      name: "Classic Fried Chicken",
      category: "Main Course",
      price: "₱200",
      img: f2,
      desc: "Rich & creamy cheesecake.",
    },
    {
      name: "Red Wine",
      category: "Beverages",
      price: "₱300",
      img: f3,
      desc: "Imported fine red wine.",
    },
    {
      name: "Chopsuey",
      category: "Main Course",
      price: "₱220",
      img: f5,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Clubhouse Sandwich",
      category: "Main Course",
      price: "₱220",
      img: f9,
      desc: "Garlic butter shrimp served with lemon.",
    },
    {
      name: "Batangas Lomi",
      category: "Main Course",
      price: "₱220",
      img: f6,
      desc: "Noodles in rich and savory broth.",
    },
    {
      name: "Deep Fried Tuna Panga",
      category: "Main Course",
      price: "₱220",
      img: f7,
      desc: "Deep-fried tuna jaw with spices.",
    },
    {
      name: "Crispy Pata",
      category: "Main Course",
      price: "₱220",
      img: f8,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Lumpiang Shanghai",
      category: "Main Course",
      price: "₱220",
      img: f10,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Dynamite Rolls",
      category: "Main Course",
      price: "₱220",
      img: f12,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Fries",
      category: "Main Course",
      price: "₱220",
      img: f13,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Mixed Boodle",
      category: "Main Course",
      price: "₱220",
      img: f14,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Stuffed Squid",
      category: "Main Course",
      price: "₱220",
      img: f15,
      desc: "Stuffed squid with herbs and spices.",
    },
  ];

  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  return (
    <motion.div
      className="dining-page font-sans text-gray-900 scroll-smooth"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <div
        className="relative h-[650px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${dining_background})` }}
      >
        {/* <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-lg animate-fade-in">
            Luxury Dining
          </h1>
          <p className="mt-4 text-xl max-w-2xl opacity-90">
            Experience world-class cuisine crafted by our award-winning chefs.
          </p>
        </div> */}
      </div>

      {/* Featured Carousel */}
      <div className="relative mt-12 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">
          ✨ Featured Dishes
        </h2>
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src={featured[currentSlide]}
            alt="featured"
            className="w-full h-[450px] object-contain bg-black transition-all duration-700"
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


    </motion.div>
  );
};

export default Dining;
