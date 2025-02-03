import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      console.log("API Response:", data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      console.log('Error in submitting reset Email', error);
      toast.error("Error sending email. Please try again.");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    if (otpArray.join('').length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      console.log('Error in submitting new password', error);
      toast.error("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        src={assets.dclogo}
        alt="Dc Infotech logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Email Submission Form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          autoComplete='off'
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm text-gray-800"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-sm text-gray-600">Enter your registered Email address.</p>
          <div className="mb-4 flex items-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-300">
            <img src={assets.mail_icon} alt="mail icon" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-transparent outline-none w-full text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
          >
            Submit
          </button>
        </form>
      )}

      {/* OTP Input Form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm text-gray-800"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-sm text-gray-600">Enter the 6-digit code sent to your email ID.</p>
          <div className="flex justify-between mb-6" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-black text-white border border-gray-300  text-center text-xl rounded-md outline-none"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
          >
            Submit
          </button>
        </form>
      )}

      {/* Enter New Password Form */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm text-gray-800"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-sm text-gray-600">Enter your new password.</p>
          <div className="mb-4 flex items-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-300">
            <img src={assets.lock_icon} alt="lock icon" className="w-4 h-4" />
            <input
              type="password"
              placeholder="Enter New Password"
              className="bg-transparent outline-none w-full text-gray-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
