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
      console.log('your data is' ,data)
      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.userData);
        console.log("User data fetched:", data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData));
      } else {
        console.warn("Failed to fetch user data:", data.message);
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("userData");
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("userData");
      toast.error("Failed to fetch user data. Please try again.");
    }
  };

  const getAuthState = () => {
    const userId = localStorage.getItem("userId");
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!userId || !storedUserData || !token) {
      console.warn("User not logged in or missing required data.");
      setIsLoggedIn(false);
      setUserData(null);
      return;
    }

    setIsLoggedIn(true);
    setUserData(JSON.parse(storedUserData));
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    } else {
      getAuthState();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
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
