import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [selectedItem, setSelectedItem] = useState(null);

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
      className="dining-page font-sans text-gray-900 scroll-smooth bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <div
        className="relative h-[700px] w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${dining_background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold mb-4">
              Culinary Excellence
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Luxury Dining Experience
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed">
              Experience Rosario Resort and Hotel's cuisine crafted by our chefs. 
              A symphony of flavors awaits you.
            </p>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Featured Carousel Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-widest text-orange-600 font-semibold mb-3">
              Chef's Special
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              ✨ Featured Dishes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Gradient border effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black">
              <motion.img
                key={currentSlide}
                src={featured[currentSlide]}
                alt="featured"
                className="w-full h-[500px] md:h-[600px] object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
              />
              
              {/* Carousel indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {featured.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featured.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="relative py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex justify-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((cat, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md"
                }`}
              >
                <span className="relative z-10">{cat}</span>
                {activeCategory === cat && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400"
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Background decoration */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              Our Menu
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our carefully curated selection of dishes, each crafted with passion and the finest ingredients.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredMenu.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                  {/* Image container with overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                      {item.desc}
                    </p>
                    
                    {/* Price and action */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        {item.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {filteredMenu.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">No items found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              {/* Modal Content */}
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Section */}
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={selectedItem.img}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 shadow-lg">
                      {selectedItem.category}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                      {selectedItem.name}
                    </h2>
                    <div className="text-3xl font-bold text-orange-400 drop-shadow-lg">
                      {selectedItem.price}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {selectedItem.desc}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            {selectedItem.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="text-xl font-bold text-gray-800">
                            {selectedItem.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedItem(null)}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300"
                    >
                      Close
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Order Now
                    </motion.button> */}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dining;
