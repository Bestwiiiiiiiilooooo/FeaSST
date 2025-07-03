// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYHb72wHHKPCOLwVDq-3amP6FEsw9hw7g",
    authDomain: "proj-serve.firebaseapp.com",
    projectId: "proj-serve",
    storageBucket: "proj-serve.firebasestorage.app",
    messagingSenderId: "312502580401",
    appId: "1:312502580401:web:187af5c7ccf27eecb69e90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };