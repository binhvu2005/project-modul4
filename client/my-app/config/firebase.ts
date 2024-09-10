// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "VITE_KEY_FIREBASE",
  authDomain: "modul4-1747b.firebaseapp.com",
  projectId: "modul4-1747b",
  storageBucket: "modul4-1747b.appspot.com",
  messagingSenderId: "784858061545",
  appId: "1:784858061545:web:27cf15a60a8f28fc72ae78",
  measurementId: "G-850N3PFX0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };