import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import LoginForm from "../pages/LoginForm";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Accommodation", path: "/accommodation" },
    { name: "About", path: "/about" },
    { name: "Dining", path: "/dining" },
    { name: "Events", path: "/events" },
    { name: "Offers", path: "/offers" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const location = useLocation();
  const { navigate, isOwner, setShowHotelReg } = useAppContext();

  // Load user from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);
  useEffect(() => {
    const clockElement = document.getElementById("dropdown-clock");

    const updateClock = () => {
      const now = new Date();
      const date = now.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (clockElement) clockElement.textContent = `${date} • ${time}`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 bg-white/50 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isScrolled
            ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
            : "py-4 md:py-6"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={assets.hotelLogo}
            alt="logo"
            className={`h-15 w-50 ${isScrolled && "invert opacity-80"}`}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`group flex flex-col gap-0.5 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {link.name}
              <div
                className={`${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </Link>
          ))}

          {/* {currentUser && (
            <button
              className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
                isScrolled ? "text-black" : "text-white"
              } transition-all`}
              onClick={() =>
                isOwner ? navigate("/owner") : setShowHotelReg(true)
              }
            >
              {isOwner ? "Dashboard" : "List Your Hotel"}
            </button>
          )} */}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4 relative">
          {currentUser ? (
            <div className="relative">
              <img
                src={currentUser.photo || "https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg"} 
                alt="user avatar"
                className="h-15 w-15 rounded-full object-cover cursor-pointer border"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              />

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <div className="relative">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 animate-spin-slow"></div>
                      <img
                        src={
                          currentUser.photo || "https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg"
                        }
                        alt="user avatar"
                        className="relative h-14 w-14 rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">
                        {currentUser.full_name}
                      </p>
                      <p className="text-xs opacity-90">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex flex-col py-2">
                    <button
                      onClick={() => {
                        navigate("/update-profile");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2"
                    >
                      <span>👤</span> Update Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/my-bookings");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2"
                    >
                      <span>📖</span> My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>

                  {/* Real-time Clock */}
                  <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-600 flex justify-between items-center bg-gray-50/70">
                    <span className="font-medium">🕒 Local Time</span>
                    <span id="dropdown-clock" className="font-mono"></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src={assets.menuIcon}
            alt=""
            className="h-6"
          />
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowLogin(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[800px] max-w-[900px]"
          >
            <LoginForm />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
