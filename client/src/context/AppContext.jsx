/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // Function to check if the user is logged in
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user/data");
      // handle based on HTTP status
      if (response.status === 200 && response.data && response.data.success) {
        setUser(response.data.user);
        setIsOwner(response.data.user.role === "owner");
      } else if (response.status === 401 || response.status === 403) {
        // unauthorized or forbidden - clear token and redirect
        logout();
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      // axios errors may have response with server message
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch user";
      toast.error(message);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout();
        navigate("/");
      }
    }
  };

  // function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const response = await axios.get("/api/user/cars");
      if (response.status === 200 && response.data && response.data.success) {
        setCars(response.data.cars);
      } else {
        const message = response?.data?.message || "Failed to fetch cars";
        toast.error(message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch cars";
      toast.error(message);
    }
  };

  // function to logout the user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  // useEffect to retrieve the token from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetchCars();
  }, []);

  // useEffect to fetch the data when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
