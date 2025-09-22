import React from "react";
import { assets, eventImages } from "../assets/assets";
import Testimonial from "../components/Testimonial";
import ImageGallery from "../components/ImageGallery";
import FAQSection from "../components/Faqs";




const EventPage = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section
        className='hero bg-no-repeat bg-cover bg-center h-screen relative flex items-center justify-center'
      >
        <img src={assets.diff_events} alt="Event Background" className="absolute inset-0 w-full h-full object-cover blur-xs" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl text-white">
            Plan Your Dream Event
          </h1>
          <p className="text-xl md:text-2xl mb-8 tracking-wide text-gray-200">
            Weddings • Graduations • Birthdays • Anniversaries • Reunions
          </p>
          <button onClick={()=>document.getElementById('packages').scrollIntoView({behavior: 'smooth'})} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 px-8 py-3 rounded-full text-white font-semibold shadow-xl hover:scale-105" >
            Explore Packages
          </button>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="event-categories container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-14 text-gray-800 font-playfair">
          Our Event Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "Weddings",
            "Graduations",
            "Birthdays",
            "Anniversaries",
            "Reunions",
            "Christenings",
          ].map((category) => (
            <div
              key={category}
              className="group relative rounded-3xl overflow-hidden shadow-xl border bg-white transition hover:shadow-2xl hover:scale-[1.03]"
            >
              <img
                src={eventImages[category.toLowerCase()]}
                alt={category}
                className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold">{category}</h3>
                <p className="text-sm opacity-90 mt-1">
                  Celebrate your special day with our luxurious{" "}
                  {category.toLowerCase()} packages.
                </p>
                <button className="mt-4 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition text-sm">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {/* GALLERY / CAROUSEL */}
      <div className="my-20  flex flex-col items-center bg-gray-200 py-10">
        <h2 className="text-4xl font-bold text-center mb-14 text-gray-800 font-playfair">
          Event Gallery
        </h2>
        <ImageGallery />
      </div>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {/* EVENT PACKAGES / INCLUSIONS */}
      <section className="packages container mx-auto py-20 px-4 bg-gradient-to-b from-white to-gray-50 rounded-xl" id="packages">
        <h2 className="text-4xl font-bold text-center mb-14 text-gray-800">
          Our Event Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              title: "Premium Wedding Package",
              features: [
                "Elegant Venue Setup",
                "Gourmet Catering",
                "Stunning Decoration",
                "Photography & Videography",
              ],
            },
            {
              title: "Birthday Celebration Package",
              features: [
                "Themed Decorations",
                "Fun Activities",
                "Tasty Food",
                "Customized Setup",
              ],
            },
          ].map((pkg, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border shadow-lg bg-white hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-semibold mb-4">{pkg.title}</h3>
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                {pkg.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition font-semibold cursor-pointer">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

      {/* TESTIMONIALS */}
      <div className="bg-gray-200 py-20">
        <Testimonial />
      </div>

      <div className="w-48 h-1 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full my-16"></div>

    </div>
  );
};

export default EventPage;
