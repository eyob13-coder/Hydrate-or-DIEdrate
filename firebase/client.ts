import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAH2frsFHtneCfQD6Q0q8fcYhJcuh7uGE8",
  authDomain: "hydrated-or-dihydrated.firebaseapp.com",
  projectId: "hydrated-or-dihydrated",
  storageBucket: "hydrated-or-dihydrated.firebasestorage.app",
  messagingSenderId: "321629874152",
  appId: "1:321629874152:web:ecd4b396369fb3a26ca65d",
  measurementId: "G-BLMLCVMTN0"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

