import admin from "../firebase-config.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("../config/firebaseAdmin.json", import.meta.url))
);

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  const idToken = authHeader.split(" ")[1];
  
  // Try Firebase token first
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    return next();
  } catch (error) {
    // Not a valid Firebase token, try manual login token (JWT)
    try {
      // Ensure JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET environment variable is not set');
        return res.status(500).json({ message: "Server configuration error" });
      }
      
      const decoded = jwt.verify(idToken, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      req.user = { userId: user._id, email: user.email };
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

export default firebaseAuth; 