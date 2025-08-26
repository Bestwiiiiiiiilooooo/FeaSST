// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYHb72wHHKPCOLwVDq-3amP6FEsw9hw7g",
    authDomain: "feasst-food.web.app",
    projectId: "feasst-food",
    storageBucket: "feasst-food.appspot.com",
    messagingSenderId: "312502580401",
    appId: "1:312502580401:web:187af5c7ccf27eecb69e90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider for production
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, googleProvider };