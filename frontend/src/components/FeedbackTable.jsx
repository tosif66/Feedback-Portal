import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token"); 
      try {
        const response = await axios.get(`${backendUrl}/api/admin/view-feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
          setFeedbacks(response.data.feedbacks || []);
        } else {
          toast.error("Failed to fetch feedbacks.");
        }
      } catch (error) {
        console.error(error.message);
        toast.error("Error fetching feedback data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [backendUrl]);

  if (loading) {
    return <p>Loading feedback records...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Feedback Records</h3>
      {feedbacks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">User Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Priority</th>
                <th className="border border-gray-300 px-4 py-2">Feedback</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id} className="text-center">
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.userId?.name || "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.userId?.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.category || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.priority || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.feedbackText || "No feedback"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {feedback.createdAt
                      ? new Date(feedback.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No feedback records found.</p>
      )}
    </div>
  );
};

export default FeedbackTable;
