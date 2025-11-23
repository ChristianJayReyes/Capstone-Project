import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  // Unified login method
  const loginUser = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsOwner(false);
    setSearchedCities([]);
  };

  // Handle Google OAuth callback - fetch user data from token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      // Store token first
      setToken(urlToken);
      localStorage.setItem("token", urlToken);

      // Fetch user data from backend using token
      const fetchUserFromToken = async () => {
        try {
          const { data } = await axios.get("/api/user/profile", {
            headers: { Authorization: `Bearer ${urlToken}` },
          });

          if (data.success && data.user) {
            loginUser(data.user, urlToken);
          } else {
            console.error("Failed to fetch user data");
            toast.error("Failed to load user data");
          }
        } catch (error) {
          console.error("Error fetching user from token:", error);
          toast.error("Failed to load user data");
        } finally {
          // Clean URL
          window.history.replaceState({}, document.title, "/");
        }
      };

      fetchUserFromToken();
    }
  }, []);

  // Load from localStorage
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

  // Fetch user details
  const fetchUser = async () => {
    if (!token) navigate("/login");

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
    if (token) fetchUser();
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

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
