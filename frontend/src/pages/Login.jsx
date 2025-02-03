import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validate form inputs
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        // Store user details in localStorage (make sure userData is a stringified object)
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", data.userData); // Stringify the userData object

        // Update app state
        setIsLoggedIn(true);
        setUserData(data.userData); // Set user data in AppContext

        // Log the stored data for debugging
        console.log("Login Successful! Stored data:", {
          token: data.token,
          userId: data.userId,
          role: data.role,
          userData: data.userData,
        });

        // Role-based navigation
        const roleRedirectMap = {
          user: "/",
          admin: "/admin-panel",
          superadmin: "/super-admin-panel",
        };
        navigate(roleRedirectMap[data.role] || "/");
        toast.success("Login successful!");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(
        error.response?.data?.message || "Login failed! Please try again."
      );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center 
      min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400 relative"
    >
      {/* Logo */}
      <img
        src={assets.dclogo}
        alt="DC Infotech logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Login Form Container */}
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Login
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-300">
              <img src={assets.mail_icon} alt="email icon" className="w-5 h-5" />
              <input
                className="bg-white outline-none w-full text-gray-800"
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-300">
              <img src={assets.lock_icon} alt="lock icon" className="w-5 h-5" />
              <input
                className="bg-transparent outline-none w-full text-gray-800"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 text-sm text-right cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg 
              bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold 
              hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
