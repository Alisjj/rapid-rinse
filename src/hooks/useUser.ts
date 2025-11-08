import { useState, useCallback, useEffect } from 'react';
import {
  AuthService,
  UserProfile,
  AuthServiceError,
} from '../services/firebase/authService';
import { useAuth as useAuthContext } from '../services/firebase/authContext';

interface UseUserReturn {
  // State
  userProfile: UserProfile | null;
  loading: boolean;
  updating: boolean;
  error: string | null;

  // Actions
  updateProfile: (
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;
  addFavoriteBusiness: (
    businessId: string,
    businessName: string
  ) => Promise<void>;
  removeFavoriteBusiness: (businessId: string) => Promise<void>;
  updatePreferences: (
    preferences: Partial<UserProfile['preferences']>
  ) => Promise<void>;

  // Utilities
  clearError: () => void;
  isFavoriteBusiness: (businessId: string) => boolean;
}

/**
 * User profile management hook
 * Provides comprehensive user profile operations and state management
 */
export const useUser = (): UseUserReturn => {
  const { user, userProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (
      updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      if (!user) {
        setError('No authenticated user');
        return;
      }

      try {
        setUpdating(true);
        setError(null);

        await AuthService.updateUserProfile(user.uid, updates);

        // The profile will be automatically refreshed by the auth context
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [user]
  );

  // Refresh user profile
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setError('No authenticated user');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // This will trigger a refresh in the auth context
      const profile = await AuthService.getUserProfile(user.uid);
      if (!profile) {
        throw new Error('Profile not found');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add favorite business
  const addFavoriteBusiness = useCallback(
    async (businessId: string, businessName: string) => {
      if (!userProfile) {
        setError('No user profile available');
        return;
      }

      try {
        setUpdating(true);
        setError(null);

        const currentFavorites = userProfile.favoriteBusinesses || [];

        // Check if already favorited
        if (currentFavorites.some((fav) => fav.businessId === businessId)) {
          return; // Already favorited
        }

        const newFavorite = {
          businessId,
          businessName,
          addedAt: new Date(),
        };

        const updatedFavorites = [...currentFavorites, newFavorite];

        await updateProfile({
          favoriteBusinesses: updatedFavorites,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to add favorite business';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [userProfile, updateProfile]
  );

  // Remove favorite business
  const removeFavoriteBusiness = useCallback(
    async (businessId: string) => {
      if (!userProfile) {
        setError('No user profile available');
        return;
      }

      try {
        setUpdating(true);
        setError(null);

        const currentFavorites = userProfile.favoriteBusinesses || [];
        const updatedFavorites = currentFavorites.filter(
          (fav) => fav.businessId !== businessId
        );

        await updateProfile({
          favoriteBusinesses: updatedFavorites,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to remove favorite business';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [userProfile, updateProfile]
  );

  // Update user preferences
  const updatePreferences = useCallback(
    async (preferences: Partial<UserProfile['preferences']>) => {
      if (!userProfile) {
        setError('No user profile available');
        return;
      }

      try {
        setUpdating(true);
        setError(null);

        const updatedPreferences = {
          ...userProfile.preferences,
          ...preferences,
        };

        await updateProfile({
          preferences: updatedPreferences,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update preferences';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [userProfile, updateProfile]
  );

  // Check if business is favorited
  const isFavoriteBusiness = useCallback(
    (businessId: string): boolean => {
      if (!userProfile?.favoriteBusinesses) {
        return false;
      }
      return userProfile.favoriteBusinesses.some(
        (fav) => fav.businessId === businessId
      );
    },
    [userProfile]
  );

  return {
    // State
    userProfile,
    loading,
    updating,
    error,

    // Actions
    updateProfile,
    refreshProfile,
    addFavoriteBusiness,
    removeFavoriteBusiness,
    updatePreferences,

    // Utilities
    clearError,
    isFavoriteBusiness,
  };
};
