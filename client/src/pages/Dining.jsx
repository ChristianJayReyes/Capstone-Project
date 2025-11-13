import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import Coke from "../assets/foods/Coke.png";
import Royal from "../assets/foods/Royal.png";
import sprite from "../assets/foods/sprite.jpg";
import water from "../assets/foods/water.jpg";
import dining_background from "../assets/dining_background.jpg";
import calamares from "../assets/foods/calamares.jpg";
import onion_rings from "../assets/foods/onion_rings.jpg";
import pinakbet from "../assets/foods/pinakbet.webp";
import dinakdakan from "../assets/foods/dinakdakan.jpg";
import tacos from "../assets/foods/tacos.jpg";
import bihon from "../assets/foods/bihon.jpg";
import pansit_bihon from "../assets/foods/pansit_bihon.jpg";
import karekare from "../assets/foods/karekare.webp";
import caesar from "../assets/foods/caesar.jpg";
import liempo from "../assets/foods/liempo.jpg";

const Dining = () => {
  const categories = [
    "All",
    "Vegetables",
    "Seafoods",
    "Batangas Best",
    "Appetizers",
    "Beverages",
    "Burger & Sandwiches",
    "Chicken",
    "Pork",
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
      name: "Crispy Fried Tilapia",
      category: "Seafoods",
      price: "₱340",
      img: f4,
      desc: "Fresh Tilapia with herbs.",
    },
    {
      name: "Cantonese Fried Chicken",
      category: "Chicken",
      price: "₱810",
      img: f1,
      desc: "Classic fried chicken is a beloved comfort food, known for its crispy, golden-brown skin and juicy, flavorful meat.",
    },
    {
      name: "Garlic Butter Shrimp",
      category: "Seafoods",
      price: "₱470",
      img: f11,
      desc: "Buttered shrimp is a simple yet delicious seafood dish that features shrimp cooked in a rich and flavorful butter sauce.",
    },
    {
      name: "Classic Fried Chicken",
      category: "Chicken",
      price: "₱405",
      img: f2,
      desc: "Rich & creamy cheesecake.",
    },
    {
      name: "Crab Rolls",
      category: "Appetizers",
      price: "₱300",
      img: f3,
      desc: "Imported fine red wine.",
    },
    {
      name: "Chopsuey",
      category: "Vegetables",
      price: "₱405",
      img: f5,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Clubhouse Sandwich",
      category: "Burger & Sandwiches",
      price: "₱340",
      img: f9,
      desc: "Garlic butter shrimp served with lemon.",
    },
    {
      name: "Batangas Lomi",
      category: "Batangas Best",
      price: "₱165",
      img: f6,
      desc: "Lomi Batangas is a hearty and flavorful Filipino noodle soup that's a staple in Batangas province.",
    },
    {
      name: "Deep Fried Tuna Panga",
      category: "Seafoods",
      price: "₱405",
      img: f7,
      desc: "Deep Fried Tuna Panga is a popular Filipino dish that features tuna belly (panga) coated in a crispy batter and then deep-fried until golden brown.",
    },
    {
      name: "Crispy Pata",
      category: "Pork",
      price: "₱1080",
      img: f8,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Lumpiang Shanghai",
      category: "Pork",
      price: "₱340",
      img: f10,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Dynamite Rolls",
      category: "Main Course",
      price: "₱270",
      img: f12,
      desc: '"Dynamite" is a popular name for a variety of dishes, often appetizers or snacks, that are known for their spicy kick.',
    },
    {
      name: "Fries",
      category: "Appetizers",
      price: "₱220",
      img: f13,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Mixed Boodle",
      category: "Seafoods",
      price: "₱1610",
      img: f14,
      desc: "Stir-fried vegetables with meat.",
    },
    {
      name: "Stuffed Squid",
      category: "Seafoods",
      price: "₱540",
      img: f15,
      desc: "Stuffed squid with herbs and spices.",
    },
    {
      name: "Calamares",
      category: "Appetizers",
      price: "₱220",
      img: calamares,
      desc: "Calamares, also known as squid rings, are a popular seafood appetizer or side dish.",
    },
    {
      name: "Onion Rings",
      category: "Appetizers",
      price: "₱220",
      img: onion_rings,
      desc: "Onion rings are a classic appetizer or side dish, known for their crispy exterior and sweet, savory onion flavor.",
    },
    {
      name: "Tacos",
      category: "Appetizers",
      price: "₱220",
      img: tacos,
      desc: "Tacos are a beloved Mexican street food and a staple in many cuisines around the world.",
    },
    {
      name: "Dinakdakan",
      category: "Appetizers",
      price: "₱220",
      img: dinakdakan,
      desc: "Dinakdakan is a vibrant and flavorful Filipino appetizer or pulutan.",
    },
    {
      name: "Pansit Bihon",
      category: "Batangas Best",
      price: "₱160",
      img: bihon,
      desc: "Pansit Bihon is a classic Filipino noodle dish made with rice noodles stir-fried with vegetables and meat.",
    },
    {
      name: "Canton Bihon",
      category: "Batangas Best",
      price: "₱205",
      img: pansit_bihon,
      desc: "Mixed canton-bihon noodles.",
    },
    {
      name: "Pinakbet",
      category: "Vegetables",
      price: "₱405",
      img: pinakbet,
      desc: "An indigenous Filipino dish from the northern regions. This is a crowd pleaser & made from mixed vegetables sauteed shrimp sweet sauce.",
    },
    {
      name: "Kare-Kare",
      category: "Vegetables",
      price: "₱670",
      img: karekare,
      desc: "Vegetable Kare-kare is a Filipino stew that's both hearty and flavorful.",
    },
    {
      name: "Caesar Salad",
      category: "Vegetables",
      price: "₱335",
      img: caesar,
      desc: "A mix of lettuce topped with croutons, cherry tomatoes, caesar salad dressing and parmesan cheese.",
    },
    {
      name: "Crispy Pork Liempo",
      category: "Pork",
      price: "₱610",
      img: liempo,
      desc: "Grilled Liempo is a popular Filipino dish featuring pork belly that's been grilled to perfection. Liempo refers to a specific cut of pork belly that's typically marinated in a blend of soy sauce, garlic, pepper, and sometimes a bit of sugar.",
    },

    {
      name: "Coke",
      category: "Beverages",
      price: "₱90",
      img: Coke,
      desc: "Canned Coke",
    },
    {
      name: "Sprite",
      category: "Beverages",
      price: "₱90",
      img: sprite,
      desc: "Canned Sprite",
    },
    {
      name: "Royal",
      category: "Beverages",
      price: "₱90",
      img: Royal,
      desc: "Canned Royal",
    },
    {
      name: "Bottled Water",
      category: "Beverages",
      price: "₱60",
      img: water,
      desc: "Bottled Water",
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
