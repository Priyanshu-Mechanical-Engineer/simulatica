// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfn6wlmihRWRYiPpsMzMmNr9PZDAeRGuw",
  authDomain: "simulatica.firebaseapp.com",
  projectId: "simulatica",
  storageBucket: "simulatica.appspot.com",
  messagingSenderId: "1062065439877",
  appId: "1:1062065439877:web:af0c139a71ecc8bac815ec",
  measurementId: "G-E359GY3ERE"
};

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
