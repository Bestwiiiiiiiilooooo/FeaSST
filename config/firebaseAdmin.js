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
  // Try to initialize with environment variables
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        }),
      });
      console.log("Firebase Admin initialized with environment variables");
    } catch (envError) {
      console.log("Firebase Admin environment variables invalid:", envError.message);
      firebaseApp = null;
    }
  } else {
    console.log("Firebase Admin credentials not found, running without Firebase Auth");
    firebaseApp = null;
  }
}

export default firebaseApp;