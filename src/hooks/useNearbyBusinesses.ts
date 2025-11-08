import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BusinessService,
  BusinessWithLocation,
} from '../services/firebase/businessService';
import {
  LocationService,
  Coordinates,
} from '../services/location/locationService';

interface UseNearbyBusinessesReturn {
  // State
  nearbyBusinesses: BusinessWithLocation[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  userLocation: Coordinates | null;

  // Configuration
  radius: number;
  maxResults: number;

  // Actions
  loadNearbyBusinesses: (
    location?: Coordinates,
    radiusKm?: number
  ) => Promise<void>;
  refreshNearbyBusinesses: () => Promise<void>;
  updateRadius: (radiusKm: number) => void;
  updateMaxResults: (max: number) => void;
  getCurrentLocationAndLoad: () => Promise<void>;

  // Utilities
  clearError: () => void;
  getBusinessDistance: (businessId: string) => number | null;
  sortByDistance: () => void;
  sortByRating: () => void;
}

/**
 * Nearby businesses hook with location-based queries
 * Provides location-aware business discovery with distance calculations
 */
export const useNearbyBusinesses = (): UseNearbyBusinessesReturn => {
  const [nearbyBusinesses, setNearbyBusinesses] = useState<
    BusinessWithLocation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState<number>(10); // Default 10km radius
  const [maxResults, setMaxResults] = useState<number>(20);

  // Refs for caching and refresh mechanisms
  const lastLocationRef = useRef<Coordinates | null>(null);
  const cacheRef = useRef<
    Map<string, { businesses: BusinessWithLocation[]; timestamp: number }>
  >(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get current location and load nearby businesses
  const getCurrentLocationAndLoad = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await LocationService.getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get current location');
      }

      setUserLocation(location);
      await loadNearbyBusinesses(location, radius);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to get location and load businesses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [radius]);

  // Load nearby businesses
  const loadNearbyBusinesses = useCallback(
    async (location?: Coordinates, radiusKm?: number) => {
      const targetLocation = location || userLocation;
      const targetRadius = radiusKm || radius;

      if (!targetLocation) {
        setError('Location is required to find nearby businesses');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = `${targetLocation.latitude},${targetLocation.longitude},${targetRadius}`;
        const cached = cacheRef.current.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setNearbyBusinesses(cached.businesses);
          setUserLocation(targetLocation);
          lastLocationRef.current = targetLocation;
          setLoading(false);
          return;
        }

        const businesses = await BusinessService.getNearbyBusinesses(
          targetLocation.latitude,
          targetLocation.longitude,
          targetRadius,
          maxResults
        );

        setNearbyBusinesses(businesses);
        setUserLocation(targetLocation);
        lastLocationRef.current = targetLocation;

        // Update cache
        cacheRef.current.set(cacheKey, {
          businesses,
          timestamp: Date.now(),
        });

        // Clean old cache entries
        const now = Date.now();
        for (const [key, value] of cacheRef.current.entries()) {
          if (now - value.timestamp > CACHE_DURATION) {
            cacheRef.current.delete(key);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load nearby businesses';
        setError(errorMessage);
        setNearbyBusinesses([]);
      } finally {
        setLoading(false);
      }
    },
    [userLocation, radius, maxResults]
  );

  // Refresh nearby businesses
  const refreshNearbyBusinesses = useCallback(async () => {
    if (!userLocation) {
      await getCurrentLocationAndLoad();
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      // Clear cache for current location
      const cacheKey = `${userLocation.latitude},${userLocation.longitude},${radius}`;
      cacheRef.current.delete(cacheKey);

      // Force refresh from server
      const businesses = await BusinessService.getNearbyBusinesses(
        userLocation.latitude,
        userLocation.longitude,
        radius,
        maxResults
      );

      setNearbyBusinesses(businesses);

      // Update cache
      cacheRef.current.set(cacheKey, {
        businesses,
        timestamp: Date.now(),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to refresh nearby businesses';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [userLocation, radius, maxResults, getCurrentLocationAndLoad]);

  // Update search radius
  const updateRadius = useCallback(
    (radiusKm: number) => {
      setRadius(radiusKm);

      // Reload with new radius if we have a location
      if (userLocation) {
        loadNearbyBusinesses(userLocation, radiusKm);
      }
    },
    [userLocation, loadNearbyBusinesses]
  );

  // Update max results
  const updateMaxResults = useCallback(
    (max: number) => {
      setMaxResults(max);

      // Reload with new max results if we have a location
      if (userLocation) {
        loadNearbyBusinesses(userLocation, radius);
      }
    },
    [userLocation, radius, loadNearbyBusinesses]
  );

  // Get distance to a specific business
  const getBusinessDistance = useCallback(
    (businessId: string): number | null => {
      const business = nearbyBusinesses.find((b) => b.id === businessId);
      return business?.distance || null;
    },
    [nearbyBusinesses]
  );

  // Sort businesses by distance
  const sortByDistance = useCallback(() => {
    setNearbyBusinesses((prev) =>
      [...prev].sort((a, b) => (a.distance || 0) - (b.distance || 0))
    );
  }, []);

  // Sort businesses by rating
  const sortByRating = useCallback(() => {
    setNearbyBusinesses((prev) =>
      [...prev].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    );
  }, []);

  // Auto-load nearby businesses on mount if location permission is available
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const permissionStatus =
          await LocationService.getLocationPermissionStatus();
        if (permissionStatus === 'granted') {
          const cachedLocation = LocationService.getCachedLocation();
          if (cachedLocation) {
            setUserLocation(cachedLocation);
            await loadNearbyBusinesses(cachedLocation);
          } else {
            await getCurrentLocationAndLoad();
          }
        }
      } catch (err) {
        // Silently fail on initialization - user can manually trigger location
        console.log('Could not initialize location on mount:', err);
      }
    };

    initializeLocation();
  }, []);

  return {
    // State
    nearbyBusinesses,
    loading,
    refreshing,
    error,
    userLocation,

    // Configuration
    radius,
    maxResults,

    // Actions
    loadNearbyBusinesses,
    refreshNearbyBusinesses,
    updateRadius,
    updateMaxResults,
    getCurrentLocationAndLoad,

    // Utilities
    clearError,
    getBusinessDistance,
    sortByDistance,
    sortByRating,
  };
};
