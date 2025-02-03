import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { userData, isLoggedIn,backendUrl } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            return toast.error("User ID not found. Please log in again.");
        }

        axios.defaults.withCredentials = true; 

        // Call the backend API
        const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
            userId,
        });

        if (data.success) {
            toast.success(data.message); 
            navigate("/email-verify"); 
        } else {
            toast.error(data.message); 
            console.log(data.message)
          }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error while sending verification OTP.");
        console.log("error in sending otp", error);
      }
};

  return (
    <div className="flex flex-col items-center mt-30 px-5 text-center text-gray-800">
      {/* Profile Image */}
      <img
        src={assets.header_img}
        alt="Profile"
        className="w-36 h-36 rounded-full mb-6"
      />

      {/* Greeting */}
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData?.name || "Developer"}!
        <img
          className="w-8 aspect-square"
          src={assets.hand_wave}
          alt="Hand wave"
        />
      </h1>

      {/* Company Name */}
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to DC Info Tech Pvt. Ltd.
      </h2>

      {/* Subtitle */}
      <p className="mb-4 max-w-md">Do you want to give feedback?</p>

      {/* Feedback or Verification Button */}
      {isLoggedIn && userData ? (
          userData.isUserVerified ? (
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/feedback")}
                className="border border-gray-500 rounded-full px-8 py-2.5 text-white bg-black hover:bg-transparent transition-all"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => navigate("/user-feedback")}
                className="border border-gray-500 rounded-full px-8 py-2.5 text-white bg-black hover:bg-transparent transition-all"
              >
                View Feedbacks
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-600 font-semibold gap-2 mb-2">
                Your account is not verified. Verify to submit feedback.
              </p>
              <button
                onClick={sendVerificationOtp}
                className="bg-black px-4 py-2 rounded text-white transition-all"
              >
                Verify Email
              </button>
            </div>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-gray-500 rounded-full px-8 py-2.5 text-white bg-black hover:bg-transparent transition-all"
          >
            Login
          </button>
        )}

      
    </div>
  );
};

export default Header;
