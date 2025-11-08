import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config';
import { AuthService, UserProfile, AuthServiceError } from './authService';

// Authentication context interface
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthServiceError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthServiceError | null>(null);

  // Clear error function
  const clearError = () => setError(null);

  // Load user profile when user changes
  const loadUserProfile = async (user: User | null) => {
    if (user) {
      try {
        const profile = await AuthService.getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.warn(
          'Failed to load user profile (Firestore may not be enabled):',
          err
        );
        // Set a basic profile from auth user data
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const profile = await AuthService.signIn(email, password);
      setUserProfile(profile);
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const profile = await AuthService.signUp(
        email,
        password,
        fullName,
        phoneNumber
      );
      setUserProfile(profile);
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await AuthService.resetPassword(email);
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    }
  };

  // Update profile function
  const updateProfile = async (
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      setError(null);
      await AuthService.updateUserProfile(user.uid, updates);

      // Reload user profile
      await loadUserProfile(user);
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
