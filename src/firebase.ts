import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Yahan wo keys aayengi jo Firebase Console se milengi
const firebaseConfig = {
  apiKey: "AIzaSyAs-rI3t5qgRU8bbeJnYP5DO_tQ40KgNdg",
  authDomain: "hindsole-pharma.firebaseapp.com",
  projectId: "hindsole-pharma",
  storageBucket: "hindsole-pharma.firebasestorage.app",
  messagingSenderId: "804977906814",
  appId: "1:804977906814:web:46cf0d78159c67eeafb42f",
  measurementId: "G-LLLK89CS8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);