import admin from "../config/firebaseAdmin.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const idToken = authHeader.split(" ")[1];
  
  // Try Firebase token first (only if Firebase Admin is initialized)
  if (admin) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      return next();
    } catch (error) {
      console.log('Firebase token verification failed:', error.message);
      // Continue to JWT verification
    }
  }
  
  // Try manual login token (JWT)
  try {
    const decoded = jwt.verify(idToken, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Decoded JWT:', decoded);
    const user = await userModel.findById(decoded.userId);
    console.log('User found:', user);
    if (!user) {
      return res.status(401).json({ message: "Invalid manual login token: user not found" });
    }
    req.user = { userId: user._id, email: user.email };
    return next();
  } catch (err) {
    console.log('JWT verification error:', err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default firebaseAuth; 