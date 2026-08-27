import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHIX_C8l18xFnNtHwCLZvUdEKZaRMOYM0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "weptest-2ce09.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "weptest-2ce09",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "weptest-2ce09.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1070648796057",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1070648796057:web:fcbd90db9a2598e9a7e908",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
