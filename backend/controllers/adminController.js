import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import feedBackModel from '../models/feedBackModel.js';

// Admin Dashboard Handler
export const adminDashboard = (req, res) => {
  const { role } = req.user;

  if (role === 'superadmin') {
    return res.status(401).json({ 
      success: false, 
      message: "Sorry but only admin", 
      data: { /* Add relevant superadmin-specific data here */ } 
    });
  }

  if (role === 'admin') {
    return res.status(200).json({ 
      success: true, 
      message: "Welcome Admin!", 
      data: { /* Add relevant admin-specific data here */ } 
    });
  }

  res.status(403).json({ 
    success: false, 
    message: "Access Denied" 
  });
};

// Superadmin Dashboard Handler
export const superAdminDashboard = (req, res) => {
  return res.status(200).json({ 
    success: true, 
    message: "Welcome to the Super Admin Dashboard!" 
  });
};

// Fetch and Manage All Users

export const manageUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'user' }).select('-password'); 
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in manageUsers:", error.message); // Debug
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Fetch and Manage All Admins
export const manageAdmins = async (req, res) => {
  try {
    const admins = await userModel.find({ role: 'admin' });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a New Admin
export const createAdmins = async (req, res) => {
  const { name, email, password, secretCode } = req.body;

  try {
    // Validate Super Admin Role
    if (req.user?.role !== 'superadmin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Super Admins Only" 
      });
    }

    // Validate Secret Code
    if (secretCode !== process.env.SECRET_CODE) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid Secret Code" 
      });
    }

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: "Admin Already Exists" 
      });
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new userModel({ name, email, password: hashedPassword, role: 'admin' });
    await newAdmin.save();

    res.status(201).json({ 
      success: true, 
      message: "Admin Created Successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an Admin
export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await userModel.findOne({ _id: adminId, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    await userModel.deleteOne({ _id: adminId });
    res.status(200).json({ 
      success: true, 
      message: "Admin deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an Admin
export const updateAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { name, email, password } = req.body;

  try {
    const admin = await userModel.findOne({ _id: adminId, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.status(200).json({ 
      success: true, 
      message: "Admin updated successfully", 
      admin 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View All Feedbacks
export const viewFeedback = async (req, res) => {
  try {
    const { viewType } = req.query; 

    if (viewType === 'cards') {
      
      const feedbackCountByCategory = await feedBackModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      return res.status(200).json({ success: true, feedbackCountByCategory });
    }

    
    const feedbacks = await feedBackModel.find().populate('userId', 'name email');
    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

