
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { set } from "date-fns";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₱";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  // 🔹 Unified login method (works for OTP + Google)
  const loginUser = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
  };

  // 🔹 Logout method
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsOwner(false);
    setSearchedCities([]);
  };

  // 🔹 Handle Google OAuth redirect (catch token + user from URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlUser = params.get("user");

    if (urlToken && urlUser) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(urlUser));
        localStorage.setItem("token", urlToken);
        localStorage.setItem("user", JSON.stringify(parsedUser));

        setToken(urlToken);
        setUser(parsedUser);

        // clean URL
        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("Error parsing Google user:", err);
      }
    }
  }, []);

  // 🔹 Load user + token from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);

    const handleStorage = () => {
      const updatedUser = localStorage.getItem("user");
      const updatedToken = localStorage.getItem("token");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
      setToken(updatedToken || null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 🔹 Fetch user details (roles, etc.)
  const fetchUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const value = {
    currency,
    navigate,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    loginUser,
    logoutUser,
    bookings,
    setBookings, 
  };

  return (<AppContext.Provider value={value}>{children}</AppContext.Provider>)
};

export const useAppContext = () => useContext(AppContext);
