// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKBiGGm6pwc9FU7pRiQTQ3LmSTJ7UciL8",
  authDomain: "modul4-1747b.firebaseapp.com",
  projectId: "modul4-1747b",
  storageBucket: "modul4-1747b.appspot.com",
  messagingSenderId: "784858061545",
  appId: "1:784858061545:web:27cf15a60a8f28fc72ae78",
  measurementId: "G-850N3PFX0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };