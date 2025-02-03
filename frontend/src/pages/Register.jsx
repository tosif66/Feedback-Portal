import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast , ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";


const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {backendUrl,setIsRegister,getUserData} = useContext(AppContext)


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Simplified Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from input
    setFormData((prev) => ({ ...prev, [name]: value })); // Update the corresponding field
  };

  // Handle Submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)

    const {name,email,password,confirmPassword} = formData

    if (formData.password !== formData.confirmPassword)
      {
        setLoading(false)
      toast.error('Passwords do not match'); // Show an alert or toast message
      return; // Stop form submission
    }
    try {
      axios.defaults.withCredentials = true;
      
      const {data} = await axios.post(backendUrl + '/api/auth/register',
        {
          name,
          email,
          password,
          confirmPassword
        })

      if (data.success){
        toast.success("Register Successfully")
        console.log("Form Submitted:", formData);
        setIsRegister(true)
        getUserData()
        setLoading(false)
        navigate('/login')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "An error occurred during registration");
    }
  };
  
  // here i return the form and above lines are for checking password is match or not
  return (
    <div className="flex items-center justify-center min-h-screen px-2 bg-gradient-to-br from-blue-200 to-purple-400 relative">
  <ToastContainer />
  <img
    src={assets.dclogo}
    alt="Dc Infotech logo"
    className="absolute left-3 sm:left-12 top-3 w-20 sm:w-24 cursor-pointer"
  />
  
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full sm:w-80 max-w-sm mx-auto">
    <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
      Register
    </h2>
    <p className="text-center text-sm text-gray-600 mb-3">
      Create Your Account
    </p>

    <form onSubmit={handleSubmit} autoComplete="off">
      {/* Full Name Input */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-300">
          <img src={assets.person_icon} alt="person icon" className="w-4 h-4" />
          <input
            className="bg-white outline-none w-full text-gray-800 text-sm"
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-300">
          <img src={assets.mail_icon} alt="email icon" className="w-4 h-4" />
          <input
            className="bg-white outline-none w-full text-gray-800 text-sm"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-300">
          <img src={assets.lock_icon} alt="lock icon" className="w-4 h-4" />
          <input
            className="bg-transparent outline-none w-full text-gray-800 text-sm"
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-300">
          <img src={assets.lock_icon} alt="lock icon" className="w-4 h-4" />
          <input
            className="bg-transparent outline-none w-full text-gray-800 text-sm"
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Forgot Password Link */}
      <p
        onClick={() => navigate('/reset-password')}
        className="mb-2 text-indigo-500 text-sm text-right cursor-pointer hover:underline"
      >
        Forgot Password?
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
      >
        Sign Up
      </button>
    </form>

    {/* Login Link */}
    <p className="text-center text-sm text-gray-600 mt-2">
      Already have an account?{' '}
      <Link to="/login" className="text-indigo-500 hover:underline">
        Login
      </Link>
    </p>
  </div>
</div>

  );
};

export default Register;