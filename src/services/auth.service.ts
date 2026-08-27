import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { AdminUser } from "../types/auth";

const mapAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This admin account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'Failed to sign in. Please try again.';
  }
};

export const authService = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      return {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || 'Admin',
      };
    } catch (error: any) {
      const message = error.code ? mapAuthError(error.code) : (error.message || 'Login failed.');
      throw new Error(message);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: (): AdminUser | null => {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Admin',
    };
  }
};
