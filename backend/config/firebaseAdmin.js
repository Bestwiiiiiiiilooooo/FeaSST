import admin from "firebase-admin";

let serviceAccount;

// Check if we're in production (Render) and use environment variables
if (process.env.FIREBASE_PROJECT_ID) {
  console.log("Using Firebase Admin with environment variables");
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
} else {
  console.log("Environment variables not found, attempting to read firebaseAdmin.json");
  // Use local JSON file for development
  try {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const configPath = path.join(__dirname, "firebaseAdmin.json");
    serviceAccount = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log("Successfully loaded firebaseAdmin.json");
  } catch (error) {
    console.error("Error loading Firebase Admin credentials:", error.message);
    console.error("Please ensure firebaseAdmin.json exists or set environment variables");
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;