import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    console.log("Authorization Header:", authHeader); 
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(authHeader)
      return res.status(401).json({ success: false, message: "token is not working" });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", tokenDecoded); 
  
      if (tokenDecoded.role !== 'admin' && tokenDecoded.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
      }
  
      req.user = tokenDecoded;
      next();
    } catch (error) {
      console.error("Middleware Error:", error.message); 
      res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
  };


export default adminAuth;
