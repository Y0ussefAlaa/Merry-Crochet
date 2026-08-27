/**
 * TODO: FIREBASE INITIALIZATION (Stage 2)
 * 
 * To connect Firebase:
 * 1. Install firebase: `npm install firebase`
 * 2. Fill out your Firebase Config keys below from Firebase Console
 * 3. Uncomment firebase imports & initialization functions
 * 
 * Example:
 * import { initializeApp } from "firebase/app";
 * import { getAuth } from "firebase/auth";
 * import { getFirestore } from "firebase/firestore";
 * import { getStorage } from "firebase/storage";
 * 
 * const firebaseConfig = {
 *   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 *   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 *   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 *   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
 *   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
 *   appId: import.meta.env.VITE_FIREBASE_APP_ID
 * };
 * 
 * export const app = initializeApp(firebaseConfig);
 * export const auth = getAuth(app);
 * export const db = getFirestore(app);
 * export const storage = getStorage(app);
 */

export const firebaseConfigInfo = {
  isConfigured: false,
  message: "Stage 1 running with mock data. Ready for Firebase Stage 2 integration."
};
