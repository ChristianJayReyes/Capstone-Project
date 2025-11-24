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
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("localStorageUpdate", {
      detail: { type: 'token-update', token: userToken, user: userData }
    }));
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

    // Also listen for custom storage events (for same-tab updates)
    const handleCustomStorage = (e) => {
      if (e.detail && e.detail.type === 'token-update') {
        setToken(e.detail.token);
        if (e.detail.user) {
          setUser(e.detail.user);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("localStorageUpdate", handleCustomStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("localStorageUpdate", handleCustomStorage);
    };
  }, []);

  // Fetch user details
  const fetchUser = async () => {
    // Get token from state or localStorage as fallback
    const authToken = token || localStorage.getItem("token");
    
    if (!authToken) {
      // Don't navigate if we're on admin pages - admin might not need /api/user endpoint
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/owner')) {
        navigate("/login");
      }
      return;
    }

    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      }
    } catch (error) {
      // Don't show error toast for admin users - they might not have access to /api/user endpoint
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/owner')) {
        console.error("Error fetching user:", error);
        // Only navigate to login if not on admin pages
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } else {
        // For admin pages, just log the error silently
        console.log("Admin user - /api/user endpoint may not be accessible:", error.response?.status);
      }
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
