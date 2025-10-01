// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWbSqb00oIYy5HOQAEXJcsMnDKPybEJ3A",
  authDomain: "foundify-app.firebaseapp.com",
  projectId: "foundify-app",
  storageBucket: "foundify-app.firebasestorage.app",
  messagingSenderId: "704170578953",
  appId: "1:704170578953:web:6eb4c10a703c631ecc14d8",
  measurementId: "G-PKC43KC53K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
