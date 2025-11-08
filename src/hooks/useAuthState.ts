import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { AuthService, UserProfile } from '../services/firebase/authService';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing authentication state
 * Provides real-time updates on authentication status and user profile
 */
export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        setError(null);

        if (user) {
          // Load user profile from Firestore
          const profile = await AuthService.getUserProfile(user.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
  };
};
