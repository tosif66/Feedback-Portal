import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import WaveBackground from './WaveBackground';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText || !category || !priority) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = { feedbackText, category, priority };

      await axios.post(backendUrl + "/api/user/submit-feedback", data, config);

      toast.success("Feedback submitted successfully!");
      setFeedbackText("");
      setCategory("");
      setPriority("");
      navigate("/user-feedback");

    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Logo */}
      <img
        src={assets.dclogo}
        alt="Dc Infotech logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer z-20"
        onClick={() => navigate("/")}
      />

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute right-5 sm:right-20 top-5 px-4 py-2 mt-8
        text-white bg-black font-semibold 
        rounded-md hover:bg-pink-700 transition duration-300 z-20"
      >
        Home
      </button>

      {/* Enhanced Wave Background */}
      <WaveBackground />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 w-full max-w-lg p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Submit Feedback
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            rows="4"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;