import { useState, useCallback } from 'react';
import {
  AuthService,
  UserProfile,
  AuthServiceError,
} from '../services/firebase/authService';
import { useAuth as useAuthContext } from '../services/firebase/authContext';

interface UseAuthReturn {
  // State
  user: any;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthServiceError | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;

  // Utilities
  clearError: () => void;
  isAuthenticated: boolean;
}

/**
 * Enhanced authentication hook with comprehensive auth operations
 * Provides login, logout, registration, and password management
 */
export const useAuth = (): UseAuthReturn => {
  const authContext = useAuthContext();
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

  // Login function with enhanced error handling
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await authContext.signIn(email, password);
      } catch (error) {
        // Error is already handled in context
        throw error;
      }
    },
    [authContext]
  );

  // Registration function
  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      phoneNumber?: string
    ) => {
      try {
        await authContext.signUp(email, password, fullName, phoneNumber);
      } catch (error) {
        // Error is already handled in context
        throw error;
      }
    },
    [authContext]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authContext.signOut();
    } catch (error) {
      // Error is already handled in context
      throw error;
    }
  }, [authContext]);

  // Reset password function
  const resetPassword = useCallback(
    async (email: string) => {
      try {
        await authContext.resetPassword(email);
      } catch (error) {
        // Error is already handled in context
        throw error;
      }
    },
    [authContext]
  );

  // Update password function with additional loading state
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setPasswordUpdateLoading(true);
      await AuthService.updateUserPassword(newPassword);
    } catch (error) {
      throw error;
    } finally {
      setPasswordUpdateLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    authContext.clearError();
  }, [authContext]);

  return {
    // State from context
    user: authContext.user,
    userProfile: authContext.userProfile,
    loading: authContext.loading || passwordUpdateLoading,
    error: authContext.error,

    // Actions
    login,
    register,
    logout,
    resetPassword,
    updatePassword,

    // Utilities
    clearError,
    isAuthenticated: !!authContext.user,
  };
};
