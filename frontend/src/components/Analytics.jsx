import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { toast } from "react-toastify";
 // Import the FeedbackData component
import FeedbackTable from "./FeedbackTable";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Analytics = () => {
  const [userData, setUserData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [rawFeedbacks, setRawFeedbacks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  useEffect(() => {
    const fetchData = async () => {
      
      if (!isLoggedIn) {
        toast.error("Please log in to view analytics.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        // Fetch Users Data
        const userResponse = await axios.get(`${backendUrl}/api/admin/manage-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Response:", userResponse.data);

        if (userResponse.data?.success) {
          setUserData(userResponse.data.users || []); 
        } else {
          toast.error("Failed to fetch users.");
        }

        // Fetch Feedback Data
        const feedbackResponse = await axios.get(
          `${backendUrl}/api/admin/view-feedback`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Feedback Response:", feedbackResponse.data); 

        if (feedbackResponse.data?.success) {
          const feedbacks = feedbackResponse.data.feedbacks || [];
          setRawFeedbacks(feedbacks); // Store raw feedback data for the table

          // Process feedbacks to count by category
          const categoryCounts = feedbacks.reduce((acc, feedback) => {
            const category = feedback.category || "Unknown";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});

          // Convert to array format for the chart
          const feedbackCountByCategory = Object.keys(categoryCounts).map((category) => ({
            _id: category,
            count: categoryCounts[category],
          }));

          setFeedbackData(feedbackCountByCategory);
        } else {
          toast.error("Failed to fetch feedback data.");
        }
      } catch (error) {
        console.error(error.message);
        toast.error("Error fetching analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl, isLoggedIn]);

  // User Data Chart
  const roles = [...new Set(userData.map((user) => user.role))]; 
  const userChartData = {
    labels: roles, 
    datasets: [
      {
        label: "Users by Role",
        data: roles.map((role) => userData.filter((user) => user.role === role).length),
        backgroundColor: ["#FF6384", "#36A2EB", "#4CAF50", "#FFC107"], 
      },
    ],
  };

  // Feedback Data Chart
  const feedbackChartData = {
    labels: feedbackData.map((item) => item._id || "Unknown"), 
    datasets: [
      {
        label: "Feedback Count",
        data: feedbackData.map((item) => item.count),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"],
      },
    ],
  };

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Users Analytics</h3>
          {userData.length > 0 ? (
            <Pie data={userChartData} />
          ) : (
            <p>No user data available.</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Feedback Analytics</h3>
          {feedbackData.length > 0 ? (
            <Bar data={feedbackChartData} />
          ) : (
            <p>No feedback data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;