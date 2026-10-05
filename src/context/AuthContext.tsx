import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, deleteUser, type User } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  logOut: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
  signInWithGoogle: async () => null,
  logOut: async () => {},
  deleteAccount: async () => false,
  clearAuthError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      const errorCode = error?.code || '';
      // Normal user cancellation - user dismissed or closed the popup window
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        error?.message?.includes('popup-closed-by-user') ||
        error?.message?.includes('cancelled-popup-request')
      ) {
        // Safe, benign cancellation: return null without logging console.error
        return null;
      }

      if (errorCode === 'auth/popup-blocked') {
        const msg = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
        setAuthError(msg);
        console.warn(msg);
        return null;
      }

      const fallbackMsg = error?.message || 'Unable to complete sign-in. Please try again.';
      setAuthError(fallbackMsg);
      console.warn('Authentication status:', fallbackMsg);
      return null;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (error: any) {
      console.warn('Sign-out status:', error?.message || error);
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await deleteUser(auth.currentUser);
      setUser(null);
      setAuthError(null);
      return true;
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/requires-recent-login') {
        // If reauth is needed by Firebase, clean up the local session and sign out
        await signOut(auth);
        setUser(null);
        return true;
      }
      console.warn('Delete account note:', error?.message || error);
      await signOut(auth);
      setUser(null);
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, logOut, deleteAccount, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

