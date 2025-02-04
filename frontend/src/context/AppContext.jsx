import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [isRegister, setIsRegister] = useState(false);

  const getUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.warn("User ID or token is missing.");
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData));
      } else {
        console.warn("Failed to fetch user data:", data.message);
        logout(); // Use centralized logout to clear state
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      if (error.response && error.response.status === 401) {
        logout(); // Logout only on unauthorized error
      } else {
        toast.error("Failed to fetch user data. Please try again.");
      }
    }
  };

  const getAuthState = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.warn("User not logged in or missing required credentials.");
      setIsLoggedIn(false);
      setUserData(null);
      return;
    }

    // Check if userData exists in localStorage and set it
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    setIsLoggedIn(true); // User is logged in if token and userId exist
  };

  useEffect(() => {
    getAuthState(); // Always check auth state on initial load
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUserData(); // Fetch latest user data when logged in
    }
  }, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.clear();
    toast.success("Logged out successfully.");
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isRegister,
        setIsRegister,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};