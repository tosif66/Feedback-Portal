import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please log in.",
    });
  }

  try {
    // Verify the token
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (!tokenDecoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    // Fetch the user from the database
    const user = await UserModel.findById(tokenDecoded.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    // Attach user information to the request object
    req.user = { 
      id: user._id, 
      role: tokenDecoded.role || "user" // Default role to "user" if not specified
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export default userAuth;