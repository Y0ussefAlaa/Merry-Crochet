import { MOCK_ADMIN_PASSWORD, MOCK_ADMIN_USER } from '../data/mockAdmin';
import type { AdminUser } from '../types/auth';

const AUTH_STORAGE_KEY = 'merry_crochet_admin_session';

/**
 * Service for Admin Authentication.
 * 
 * TODO: FIREBASE AUTH INTEGRATION
 * In Stage 2, replace this mock service with Firebase Authentication methods:
 * - signInWithEmailAndPassword(auth, email, password)
 * - signOut(auth)
 * - onAuthStateChanged(auth, (user) => { ... })
 */
export const authService = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    // TODO: FIREBASE AUTH
    // Replace mock login with Firebase signInWithEmailAndPassword(auth, email, password)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.trim().toLowerCase() === MOCK_ADMIN_USER.email && password === MOCK_ADMIN_PASSWORD) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_ADMIN_USER));
          resolve(MOCK_ADMIN_USER);
        } else {
          reject(new Error("Invalid email or password. Use admin@merrycrochet.com / admin123"));
        }
      }, 400);
    });
  },

  logout: async (): Promise<void> => {
    // TODO: FIREBASE AUTH
    // Replace with signOut(auth)
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        resolve();
      }, 200);
    });
  },

  getCurrentUser: (): AdminUser | null => {
    // TODO: FIREBASE AUTH
    // Replace with auth.currentUser or onAuthStateChanged listener
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading auth state from localStorage', e);
    }
    return null;
  }
};
