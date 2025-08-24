import admin from "../config/firebaseAdmin.js";
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
  console.log('Authorization header:', authHeader);
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
  }
};

export default firebaseAuth; 