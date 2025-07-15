import admin from "firebase-admin";

// Initialize Firebase Admin only if service account is available
let firebaseApp;

try {
  // Try to read from file (for local development)
  const fs = await import("fs");
  const serviceAccount = JSON.parse(
    fs.readFileSync(new URL("./firebaseAdmin.json", import.meta.url))
  );
  
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized with file credentials");
} catch (error) {
  console.log("Firebase Admin file not found, running without Firebase Auth");
  // Don't initialize Firebase Admin if credentials are not available
  firebaseApp = null;
}

export default firebaseApp;