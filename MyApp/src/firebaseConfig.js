// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVMmpJmdw16lY09zdjS4FH2D8gteRLvtA",
  authDomain: "audiary-25c92.firebaseapp.com",
  projectId: "audiary-25c92",
  storageBucket: "audiary-25c92.firebasestorage.app",
  messagingSenderId: "162575123606",
  appId: "1:162575123606:web:8433df6b6adfc9af502eb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(app);