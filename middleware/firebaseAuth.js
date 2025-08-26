// 🚨 INLINE FIREBASE CONFIG - No imports, no file reading issues!
import admin from "firebase-admin";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

console.log("🚨 INLINE FIREBASE - Middleware starting...");
console.log("🚨 INLINE FIREBASE - Environment check:", {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "SET" : "NOT SET",
  NODE_ENV: process.env.NODE_ENV,
  RENDER: process.env.RENDER ? "YES" : "NO"
});

// Initialize Firebase Admin directly in this file
if (!admin.apps.length) {
  console.log("🚨 INLINE FIREBASE - Initializing Firebase Admin...");
  
  let serviceAccount;
  
  // Check if we're in production (Render) and use environment variables
  if (process.env.FIREBASE_PROJECT_ID) {
    console.log("🚨 INLINE FIREBASE - Using environment variables");
    // Use environment variables for production deployment
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: "googleapis.com"
    };
    console.log("🚨 INLINE FIREBASE - Service account created from environment variables");
  } else {
    console.log("🚨 INLINE FIREBASE - Environment variables not found, attempting to read firebaseAdmin.json");
    // Use local JSON file for development
    try {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const configPath = path.join(__dirname, "config", "firebaseAdmin.json");
      console.log("🚨 INLINE FIREBASE - Attempting to read file:", configPath);
      serviceAccount = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log("🚨 INLINE FIREBASE - Successfully loaded firebaseAdmin.json");
    } catch (error) {
      console.error("🚨 INLINE FIREBASE - Error loading Firebase Admin credentials:", error.message);
      console.error("🚨 INLINE FIREBASE - Please ensure firebaseAdmin.json exists or set environment variables");
      process.exit(1);
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🚨 INLINE FIREBASE - Firebase Admin initialized successfully");
} else {
  console.log("🚨 INLINE FIREBASE - Firebase Admin already initialized");
}

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