import jwt from 'jsonwebtoken';

const superAdminAuth = async (req, res, next) => {
    try {
        // Check if token exists
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please login again." });
        }

        // Verify token
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", tokenDecoded); 

        // Ensure token contains ID & Role
        if (!tokenDecoded?.id || !tokenDecoded?.role) {
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        }

        // Check if user is a SuperAdmin
        if (tokenDecoded.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: "Access Denied: SuperAdmins Only" });
        }

        //  Attach superAdminId to req object
        req.user = {
            id: tokenDecoded.id,
            role: tokenDecoded.role,
        };

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error("Error in superAdminAuth:", error);

        // Handle JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};

export default superAdminAuth;
