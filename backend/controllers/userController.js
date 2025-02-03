import mongoose from "mongoose";
import feedBackModel from "../models/feedBackModel.js";
import userModel from "../models/userModel.js";

export const getUserData = async(req,res) => {
    try {
        const userId = req.query.userId;
        console.log('Received userId:', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await userModel.findById(userId);
        console.log('Received user:', user);

        if (!user){
            return res.json({success:false , message:"User not found"});
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isUserVerified: user.isUserVerified, // Ensure this field is included
                role: user.role, // Include the user's role in the response
            },
        });

    } catch (error) {
        console.error('Error in getUserData:', error.message);
        return res.json({success:false , message:error.message});
    }
};

export const submitFeedback = async (req, res) => {
    const validation = validateFeedback(req.body);

    if (!validation.isValid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const userId = req.user.id; // Assuming userAuth middleware adds user info to req.user
        const { feedbackText, category, priority } = req.body;

        const newFeedback = new feedBackModel({
            userId,
            feedbackText,
            category,
            priority,
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

export const validateFeedback = ({ feedbackText, category, priority }) => {
    const validCategories = ['Bug', 'Feature Request', 'General', 'Other'];
    const validPriorities = ['Low', 'Medium', 'High'];

    if (!feedbackText || !category || !priority) {
        return { isValid: false, message: 'Feedback text, category, and priority are required' };
    }

    if (!validCategories.includes(category)) {
        return { isValid: false, message: `Invalid category. Valid options are: ${validCategories.join(', ')}` };
    }

    if (!validPriorities.includes(priority)) {
        return { isValid: false, message: `Invalid priority. Valid options are: ${validPriorities.join(', ')}` };
    }

    return { isValid: true };
};

// Add to userController.js
export const getUserFeedbacks = async (req, res) => {
    try {
      const userId = req.user.id; // From auth middleware
      const feedbacks = await feedBackModel.find({ userId })
        .sort({ createdAt: -1 });
  
      res.status(200).json({ 
        success: true, 
        feedbacks: feedbacks.map(fb => ({
          category: fb.category,
          priority: fb.priority,
          feedbackText: fb.feedbackText,
          createdAt: fb.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Error fetching feedbacks",
        error: error.message 
      });
    }
  };