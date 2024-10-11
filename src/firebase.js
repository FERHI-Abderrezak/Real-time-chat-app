import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuZPNLVPLla-4cbOWMfBPLo8sg74_3xAA",
  authDomain: "real-time-chat-app-d1af8.firebaseapp.com",
  projectId: "real-time-chat-app-d1af8",
  storageBucket: "real-time-chat-app-d1af8.appspot.com",
  messagingSenderId: "920190306011",
  appId: "1:920190306011:web:132c6d2cdbb4d3e6342efe",
  measurementId: "G-WXVQY649CR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider }; // Export provider
