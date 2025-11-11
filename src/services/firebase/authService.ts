import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User,
  AuthError,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, firestoreAvailable } from './config';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  favoriteBusinesses?: Array<{
    businessId: string;
    businessName: string;
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication error types
export interface AuthServiceError {
  code: string;
  message: string;
  originalError?: AuthError;
}

// Enhanced error handling
const handleAuthError = (error: AuthError): AuthServiceError => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests':
      'Too many failed attempts. Please try again later.',
    'auth/network-request-failed':
      'Network error. Please check your connection.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/requires-recent-login':
      'Please log in again to complete this action.',
  };

  return {
    code: error.code,
    message:
      errorMessages[error.code] ||
      'An unexpected error occurred. Please try again.',
    originalError: error,
  };
};

// Authentication service class
export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user profile from Firestore
      const userProfile = await this.getUserProfile(user.uid);

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      return userProfile;
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  // Create new user account
  static async signUp(
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ): Promise<UserProfile> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user display name
      await updateProfile(user, { displayName: fullName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        email: user.email!,
        fullName,
        phoneNumber,
        preferences: {
          notifications: true,
          theme: 'system',
          language: 'en',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.createUserProfile(userProfile);

      return userProfile;
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  // Update user password
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      await updatePassword(user, newPassword);
    } catch (error) {
      throw handleAuthError(error as AuthError);
    }
  }

  // Create user profile in Firestore
  static async createUserProfile(userProfile: UserProfile): Promise<void> {
    if (!firestoreAvailable) {
      console.warn('Firestore not available, skipping profile creation');
      return;
    }

    try {
      const userRef = doc(db, 'users', userProfile.id);
      await setDoc(userRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error('Failed to create user profile');
    }
  }

  // Get user profile from Firestore
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!firestoreAvailable) {
      console.warn('Firestore not available, returning null profile');
      return null;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    if (!firestoreAvailable) {
      console.warn('Firestore not available, skipping profile update');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth profile if display name changed
      if (updates.fullName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.fullName,
        });
      }
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}
