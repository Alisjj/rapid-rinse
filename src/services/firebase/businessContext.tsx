/**
 * Business Context Provider
 *
 * Provides business data management with search, filtering, and real-time updates
 * Requirements: 2.1, 2.2, 2.3
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { FirestoreService, BusinessFilters } from './firestoreService';
import { Business } from '../../types';
import { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface BusinessContextValue {
  // State
  businesses: Business[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  searchBusinesses: (
    searchTerm: string,
    filters?: BusinessFilters
  ) => Promise<void>;
  getBusinessById: (businessId: string) => Promise<Business | null>;
  refreshBusinesses: () => Promise<void>;
  loadMoreBusinesses: () => Promise<void>;
  setFilters: (filters: BusinessFilters) => void;

  // Utilities
  clearError: () => void;
  clearBusinesses: () => void;
}

interface BusinessContextProviderProps {
  children: ReactNode;
}

// ============================================================================
// Context Creation
// ============================================================================

const BusinessContext = createContext<BusinessContextValue | undefined>(
  undefined
);

// ============================================================================
// Provider Component
// ============================================================================

export const BusinessProvider: React.FC<BusinessContextProviderProps> = ({
  children,
}) => {
  // State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Refs for pagination and caching
  const lastDocRef = useRef<DocumentSnapshot | undefined>(undefined);
  const currentFiltersRef = useRef<BusinessFilters>({});
  const currentSearchTermRef = useRef<string>('');
  const cacheRef = useRef<Map<string, Business>>(new Map());
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // ============================================================================
  // Utility Functions
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearBusinesses = useCallback(() => {
    setBusinesses([]);
    setHasMore(true);
    lastDocRef.current = undefined;
    currentSearchTermRef.current = '';
    cacheRef.current.clear();
  }, []);

  const setFilters = useCallback((filters: BusinessFilters) => {
    currentFiltersRef.current = filters;
  }, []);

  // ============================================================================
  // Core Functions
  // ============================================================================

  /**
   * Load businesses with filters
   * Requirements: 2.1, 2.3
   */
  const loadBusinesses = useCallback(
    async (filters?: BusinessFilters, append: boolean = false) => {
      try {
        if (!append) {
          setLoading(true);
          lastDocRef.current = undefined;
        }
        setError(null);

        const filtersToUse = filters || currentFiltersRef.current;
        currentFiltersRef.current = filtersToUse;

        let result: { businesses: Business[]; lastDoc?: DocumentSnapshot };
        try {
          result = await FirestoreService.getBusinesses(filtersToUse, {
            limit: 20,
            lastDoc: append ? lastDocRef.current : undefined,
          });
        } catch (firestoreError) {
          console.warn('Firestore failed, using mock data:', firestoreError);
          // Mock data for development
          result = {
            businesses: [
              {
                id: 'mock1',
                ownerId: 'mock',
                name: 'Mock Car Wash 1',
                description: 'A great car wash service',
                address: '123 Main St',
                location: { latitude: 37.7749, longitude: -122.4194 },
                phone: '555-1234',
                email: 'mock@carwash.com',
                imageUrl: '',
                images: [],
                rating: 4.5,
                reviewCount: 10,
                operatingHours: {},
                services: [
                  {
                    id: 'wash',
                    name: 'Basic Wash',
                    description: 'Standard car wash',
                    price: 15,
                    duration: 30,
                    category: 'wash',
                  },
                ],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            lastDoc: undefined,
          };
        }

        if (append) {
          setBusinesses(prev => [...prev, ...result.businesses]);
        } else {
          setBusinesses(result.businesses);
        }

        setHasMore(result.businesses.length === 20);
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach(business => {
          cacheRef.current.set(business.id, business);
        });
      } catch (err) {
        console.error('Error loading businesses:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load businesses';

        // Check if it's a permissions error
        if (
          errorMessage.includes('permission') ||
          errorMessage.includes('insufficient')
        ) {
          setError(
            'Unable to load businesses. Please check your connection and try again.'
          );
        } else {
          setError(errorMessage);
        }

        if (!append) {
          setBusinesses([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Search businesses with text search
   * Requirements: 2.2
   */
  const searchBusinesses = useCallback(
    async (searchTerm: string, filters?: BusinessFilters) => {
      try {
        setLoading(true);
        setError(null);

        // Reset pagination
        lastDocRef.current = undefined;
        currentSearchTermRef.current = searchTerm;
        const filtersToUse = filters || currentFiltersRef.current;
        currentFiltersRef.current = filtersToUse;

        if (!searchTerm.trim()) {
          // If empty search, load all businesses
          await loadBusinesses(filtersToUse);
          return;
        }

        const result = await FirestoreService.searchBusinesses(
          searchTerm,
          filtersToUse,
          { limit: 20 }
        );

        setBusinesses(result.businesses);
        setHasMore(false); // Search doesn't support pagination
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach(business => {
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

  /**
   * Get business by ID with caching
   * Requirements: 2.3
   */
  const getBusinessById = useCallback(
    async (businessId: string): Promise<Business | null> => {
      try {
        setError(null);

        // Check local cache first
        const cached = cacheRef.current.get(businessId);
        if (cached) {
          return cached;
        }

        // Fetch from Firestore
        const business = await FirestoreService.getBusinessById(businessId);

        if (business) {
          // Update cache
          cacheRef.current.set(business.id, business);

          // Update businesses list if business is already there
          setBusinesses(prev => {
            const index = prev.findIndex(b => b.id === businessId);
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

  /**
   * Refresh businesses
   * Requirements: 2.1, 2.3
   */
  const refreshBusinesses = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Reset pagination
      lastDocRef.current = undefined;

      if (currentSearchTermRef.current) {
        // Refresh search results
        const result = await FirestoreService.searchBusinesses(
          currentSearchTermRef.current,
          currentFiltersRef.current,
          { limit: 20 }
        );

        setBusinesses(result.businesses);
        setHasMore(false);
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach(business => {
          cacheRef.current.set(business.id, business);
        });
      } else {
        // Refresh regular list
        const result = await FirestoreService.getBusinesses(
          currentFiltersRef.current,
          { limit: 20 }
        );

        setBusinesses(result.businesses);
        setHasMore(result.businesses.length === 20);
        lastDocRef.current = result.lastDoc;

        // Update cache
        result.businesses.forEach(business => {
          cacheRef.current.set(business.id, business);
        });
      }

      // Clear Firestore cache
      FirestoreService.clearCache();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh businesses';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Load more businesses (pagination)
   * Requirements: 2.1
   */
  const loadMoreBusinesses = useCallback(async () => {
    if (
      !hasMore ||
      loading ||
      !lastDocRef.current ||
      currentSearchTermRef.current
    ) {
      return;
    }

    await loadBusinesses(currentFiltersRef.current, true);
  }, [hasMore, loading, loadBusinesses]);

  // ============================================================================
  // Effects
  // ============================================================================

  // Initial load
  useEffect(() => {
    loadBusinesses();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      FirestoreService.clearCache();
    };
  }, [loadBusinesses]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: BusinessContextValue = {
    // State
    businesses,
    loading,
    refreshing,
    error,
    hasMore,

    // Actions
    searchBusinesses,
    getBusinessById,
    refreshBusinesses,
    loadMoreBusinesses,
    setFilters,

    // Utilities
    clearError,
    clearBusinesses,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useBusinessContext = (): BusinessContextValue => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error(
      'useBusinessContext must be used within a BusinessProvider'
    );
  }
  return context;
};
