import React from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
  return (
    <div className="relative flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-400/10 to-rose-400/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between w-full relative z-10 mb-16"
      >
        <div className="max-w-2xl">
          <Title
            align="left"
            title="✨ Exclusive Offers for the month of October!"
            subTitle="Indulge in our limited-time offers crafted to elevate your experience and create timeless memories."
          />
        </div>
      </motion.div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10 w-full">
        {exclusiveOffers.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => window.open(item.link, "_blank")}
            className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
          >
            {/* Card Container with Glassmorphism */}
            <div className="relative h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              >
                {/* Animated Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500"></div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                {/* Top Section - Badge */}
                <div className="flex justify-start">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
          
                  </div>
                </div>

                {/* Bottom Section - Content */}
                <div className="space-y-4">
                  {/* Title */}
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold font-playfair text-white leading-tight group-hover:text-amber-400 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="italic">Expires {item.expiryDate}</span>
                    </div>
                    
                    {/* CTA Arrow */}
                    <div className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                      <span className="text-sm font-medium">View Offer</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
