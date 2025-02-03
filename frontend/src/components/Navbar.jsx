import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const {isLoggedIn, userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

  // Function to handle sending verification OTP
  const sendVerificationOtp = async () => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            return toast.error("User ID not found. Please log in again.");
        }

        axios.defaults.withCredentials = true; // Ensures cookies are included

        // Call the backend API
        const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
            userId,
        });

        if (data.success) {
            toast.success(data.message); // Notify the user
            // Navigate to the verification page only if OTP is sent successfully
            navigate("/email-verify"); 
        } else {
            toast.error(data.message); // Handle failure to send OTP
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error while sending verification OTP.");
    }
};

  // Function to handle user logout
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true; // Ensures cookies are included
      const logout = await axios.post(`${backendUrl}/api/auth/logout`);
      const data = logout.data;

      if (data?.success === false) {
        console.log(data?.message);
      }

      // Clear context or global state
      
      
      localStorage.clear(); // Clear localStorage
      setIsLoggedIn(false); // Update state


      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error during logout");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-4 sm:px-20 relative">
      <img src={assets.dclogo} alt="Dc Infotech Logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name ? userData.name[0].toUpperCase() : "?"}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-5">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isUserVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout} // Logout functionality
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-white bg-black hover:bg-transparent transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
