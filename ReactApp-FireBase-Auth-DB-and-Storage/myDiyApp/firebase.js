// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from 'firebase/firestore';
// Uncomment the below line if you want to try the app with Firebase app storage
// You must have upgraded your Firebae account to use this
// import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpgV8NeIJ93u0VI5nbYiO_w3aMfmvii40",
  authDomain: "diyhackapp-1c457.firebaseapp.com",
  projectId: "diyhackapp-1c457",
  storageBucket: "diyhackapp-1c457.firebasestorage.app",
  messagingSenderId: "204618187261",
  appId: "1:204618187261:web:15f4bdb2a331985e5ad994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Uncomment the below line if you are trying the app with Firebase app storage
// export const storage = getStorage(app);
