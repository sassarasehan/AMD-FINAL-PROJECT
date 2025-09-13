// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUb1lBgoQC0O_5_IL-EZ0CSqx5UVqz_nk",
  authDomain: "sass-money-manager.firebaseapp.com",
  projectId: "sass-money-manager",
  storageBucket: "sass-money-manager.firebasestorage.app",
  messagingSenderId: "88711112824",
  appId: "1:88711112824:web:2f562848c33c65f8b5e58d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

