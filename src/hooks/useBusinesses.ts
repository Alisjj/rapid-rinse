import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BusinessService,
  BusinessWithLocation,
  BusinessSearchFilters,
} from '../services/firebase/businessService';
import { DocumentSnapshot } from 'firebase/firestore';

interface UseBusinessesReturn {
  // State
  businesses: BusinessWithLocation[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  searchBusinesses: (
    searchTerm: string,
    filters?: BusinessSearchFilters
  ) => Promise<void>;
  loadBusinesses: (filters?: BusinessSearchFilters) => Promise<void>;
  loadMoreBusinesses: () => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  getBusinessById: (businessId: string) => Promise<BusinessWithLocation | null>;

  // Utilities
  clearError: () => void;
  clearBusinesses: () => void;
}

/**
 * Business management hook with search and filtering capabilities
 * Provides comprehensive business data operations with caching and pagination
 */
export const useBusinesses = (): UseBusinessesReturn => {
  const [businesses, setBusinesses] = useState<BusinessWithLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Refs for pagination and caching
  const lastDocRef = useRef<DocumentSnapshot | undefined>();
  const currentFiltersRef = useRef<BusinessSearchFilters | undefined>();
  const currentSearchTermRef = useRef<string>('');
  const cacheRef = useRef<Map<string, BusinessWithLocation>>(new Map());

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear businesses function
  const clearBusinesses = useCallback(() => {
    setBusinesses([]);
    setHasMore(true);
    lastDocRef.current = undefined;
    currentFiltersRef.current = undefined;
    currentSearchTermRef.current = '';
  }, []);

  // Load businesses with filters
  const loadBusinesses = useCallback(
    async (filters?: BusinessSearchFilters) => {
      try {
        setLoading(true);
        setError(null);

        // Reset pagination
        lastDocRef.current = undefined;
        currentFiltersRef.current = filters;
        currentSearchTermRef.current = '';

        const result = await BusinessService.getBusinesses(filters, {
          limit: 20,
        });

        setBusinesses(result.businesses);
        setHasMore(result.businesses.length === 20);
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach((business) => {
          cacheRef.current.set(business.id, business);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load businesses';
        setError(errorMessage);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Search businesses
  const searchBusinesses = useCallback(
    async (searchTerm: string, filters?: BusinessSearchFilters) => {
      try {
        setLoading(true);
        setError(null);

        // Reset pagination
        lastDocRef.current = undefined;
        currentFiltersRef.current = filters;
        currentSearchTermRef.current = searchTerm;

        if (!searchTerm.trim()) {
          // If empty search, load all businesses
          await loadBusinesses(filters);
          return;
        }

        const result = await BusinessService.searchBusinesses(
          searchTerm,
          filters,
          { limit: 20 }
        );

        setBusinesses(result.businesses);
        setHasMore(false); // Search doesn't support pagination yet
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach((business) => {
          cacheRef.current.set(business.id, business);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to search businesses';
        setError(errorMessage);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    },
    [loadBusinesses]
  );

  // Load more businesses (pagination)
  const loadMoreBusinesses = useCallback(async () => {
    if (!hasMore || loading || !lastDocRef.current) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;

      if (currentSearchTermRef.current) {
        // Continue search pagination (not implemented in service yet)
        return;
      } else {
        // Continue regular pagination
        result = await BusinessService.getBusinesses(
          currentFiltersRef.current,
          { limit: 20, lastDoc: lastDocRef.current }
        );
      }

      if (result.businesses.length > 0) {
        setBusinesses((prev) => [...prev, ...result.businesses]);
        lastDocRef.current = result.lastDoc;
        setHasMore(result.businesses.length === 20);

        // Update cache
        result.businesses.forEach((business) => {
          cacheRef.current.set(business.id, business);
        });
      } else {
        setHasMore(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load more businesses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading]);

  // Refresh businesses
  const refreshBusinesses = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Reset pagination
      const originalLastDoc = lastDocRef.current;
      lastDocRef.current = undefined;

      let result;

      if (currentSearchTermRef.current) {
        result = await BusinessService.searchBusinesses(
          currentSearchTermRef.current,
          currentFiltersRef.current,
          { limit: 20 }
        );
      } else {
        result = await BusinessService.getBusinesses(
          currentFiltersRef.current,
          { limit: 20 }
        );
      }

      setBusinesses(result.businesses);
      setHasMore(result.businesses.length === 20);
      lastDocRef.current = result.lastDoc;

      // Update cache
      result.businesses.forEach((business) => {
        cacheRef.current.set(business.id, business);
      });

      // Clear old cache entries
      BusinessService.clearCache();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh businesses';
      setError(errorMessage);
      // Restore pagination state on error
      lastDocRef.current = originalLastDoc;
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Get business by ID with caching
  const getBusinessById = useCallback(
    async (businessId: string): Promise<BusinessWithLocation | null> => {
      try {
        setError(null);

        // Check local cache first
        const cached = cacheRef.current.get(businessId);
        if (cached) {
          return cached;
        }

        // Fetch from service
        const business = await BusinessService.getBusinessById(businessId);

        if (business) {
          // Update cache
          cacheRef.current.set(business.id, business);

          // Update businesses list if business is already there
          setBusinesses((prev) => {
            const index = prev.findIndex((b) => b.id === businessId);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = business;
              return updated;
            }
            return prev;
          });
        }

        return business;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch business details';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  // Auto-load businesses on mount
  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  return {
    // State
    businesses,
    loading,
    refreshing,
    error,
    hasMore,

    // Actions
    searchBusinesses,
    loadBusinesses,
    loadMoreBusinesses,
    refreshBusinesses,
    getBusinessById,

    // Utilities
    clearError,
    clearBusinesses,
  };
};
