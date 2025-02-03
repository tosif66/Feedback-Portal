import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import Card from "./Card";
import { DollarSign, ArrowDown, Clipboard } from "lucide-react";

const Cards = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { userData, isLoggedIn } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!isLoggedIn) {
        toast.error("Please log in to view feedback.");
        return;
      }

      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backendUrl}/api/admin/view-feedback?viewType=cards`, {
          headers: { Authorization: `Bearer ${token}`, },
        });

        if (response.data.success) {
          const feedbacksWithColors = response.data.feedbackCountByCategory.map((item, index) => ({
            title: item._id || "Unknown",
            color: {
              backGround: `linear-gradient(180deg, ${
                ["#bb67ff", "#FF919D", "#F8D49A"][index % 3]
              } 0%, ${["#c484f3", "#FC929D", "#FFD58C"][index % 3]} 100%)`,
              boxShadow: `0px 10px 20px 0px ${
                ["#e0c6f5", "#FDC0C7", "#F9D59B"][index % 3]
              }`,
            },
            barValue: Math.min((item.count / 100) * 100, 100),
            value: item.count,
            png: index === 0 ? DollarSign : index === 1 ? ArrowDown : Clipboard,
            series: [
              {
                name: item._id || "Feedback",
                data: item.data || [0],
              },
            ],
          }));

          setFeedbacks(feedbacksWithColors);
        } else {
          toast.error("Failed to fetch feedbacks.");
        }
      } catch (error) {
        console.error(error.message);
        toast.error("Error fetching feedbacks.");
      }
    };

    fetchFeedback();
  }, [backendUrl, isLoggedIn]);

  return (
    <div className="flex gap-5 p-8"> {/* Increase the gap between cards */}
      {feedbacks.map((feedback, index) => (
        <Card key={index} param={feedback} />
      ))}
    </div>
  );
};

export default Cards;
