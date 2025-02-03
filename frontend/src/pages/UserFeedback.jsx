import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; 
import jsPDF from "jspdf"; 
import "jspdf-autotable";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const backendUrl = import.meta.env.VITE_BACKEND_URL; 

  // Fetch user feedbacks from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token"); 
      try {
        const response = await axios.get(`${backendUrl}/api/user/user-feedback`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });

        if (response.data?.success) {
          setFeedbacks(response.data.feedbacks || []);
        } else {
          toast.error("Failed to fetch feedbacks.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [backendUrl]);

  // Exporting feedbacks as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(feedbacks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedbacks");
    XLSX.writeFile(workbook, "my-feedbacks.xlsx");
  };

  // Exporting feedbacks as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("My Feedback History", 10, 10);
    doc.autoTable({
      head: [["Category", "Priority", "Feedback", "Date"]],
      body: feedbacks.map((fb) => [
        fb.category,
        fb.priority,
        fb.feedbackText,
        new Date(fb.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("my-feedbacks.pdf");
  };

  
  if (loading) {
    return <p>Loading your feedbacks...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Feedback History</h2>
        <div className="space-x-2">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Export PDF
          </button>
        </div>
      </div>

      {feedbacks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Feedback</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{feedback.category}</td>
                  <td className="p-2 border">{feedback.priority}</td>
                  <td className="p-2 border">{feedback.feedbackText}</td>
                  <td className="p-2 border">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No feedback submissions found.</p>
      )}
    </div>
  );
};

export default UserFeedback;