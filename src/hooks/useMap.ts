import { useState, useEffect, useCallback } from 'react';
import {
  MapService,
  MapRegion,
  BusinessMarker,
} from '../services/location/mapService';
import {
  LocationService,
  Coordinates,
} from '../services/location/locationService';
import { BusinessWithLocation } from '../services/firebase/businessService';

// Map hook options
interface UseMapOptions {
  initialRegion?: MapRegion;
  autoFitMarkers?: boolean;
  trackUserLocation?: boolean;
}

// Map hook return type
interface UseMapReturn {
  region: MapRegion | null;
  markers: BusinessMarker[];
  userLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  setRegion: (region: MapRegion) => void;
  setBusinesses: (businesses: BusinessWithLocation[]) => void;
  fitToMarkers: () => void;
  centerOnUser: () => void;
  centerOnBusiness: (businessId: string) => void;
  getDirections: (
    destination: Coordinates,
    mode?: 'driving' | 'walking' | 'transit'
  ) => string;
  clearError: () => void;
}

/**
 * Custom hook for managing map state and functionality
 */
export const useMap = (options: UseMapOptions = {}): UseMapReturn => {
  const {
    initialRegion,
    autoFitMarkers = true,
    trackUserLocation = true,
  } = options;

  const [region, setRegionState] = useState<MapRegion | null>(
    initialRegion || null
  );
  const [markers, setMarkers] = useState<BusinessMarker[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [businesses, setBusinessesState] = useState<BusinessWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => setError(null), []);

  // Set region
  const setRegion = useCallback((newRegion: MapRegion) => {
    setRegionState(newRegion);
  }, []);

  // Set businesses and create markers
  const setBusinesses = useCallback(
    (newBusinesses: BusinessWithLocation[]) => {
      setBusinessesState(newBusinesses);
      const businessMarkers = MapService.createBusinessMarkers(
        newBusinesses,
        userLocation || undefined
      );
      setMarkers(businessMarkers);

      // Auto-fit to markers if enabled
      if (autoFitMarkers && businessMarkers.length > 0) {
        const coordinates = businessMarkers.map((marker) => marker.coordinate);
        if (userLocation) {
          coordinates.push(userLocation);
        }
        const newRegion = MapService.createRegionFromCoordinates(coordinates);
        setRegionState(newRegion);
      }
    },
    [userLocation, autoFitMarkers]
  );

  // Fit map to show all markers
  const fitToMarkers = useCallback(() => {
    try {
      const coordinates = markers.map((marker) => marker.coordinate);
      if (userLocation) {
        coordinates.push(userLocation);
      }

      if (coordinates.length > 0) {
        const newRegion = MapService.createRegionFromCoordinates(coordinates);
        setRegionState(newRegion);
      }
    } catch (err) {
      setError('Failed to fit map to markers');
    }
  }, [markers, userLocation]);

  // Center map on user location
  const centerOnUser = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();

      let location = userLocation;
      if (!location) {
        const currentLocation = await LocationService.getCurrentLocation();
        if (currentLocation) {
          location = currentLocation;
          setUserLocation(location);
        }
      }

      if (location) {
        const newRegion = MapService.createMapRegion(location, 0.01);
        setRegionState(newRegion);
      } else {
        setError('Unable to get current location');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to center on user location'
      );
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, clearError]);

  // Center map on specific business
  const centerOnBusiness = useCallback(
    (businessId: string) => {
      try {
        const business = businesses.find((b) => b.id === businessId);
        if (business && business.location) {
          const newRegion = MapService.createMapRegion(
            business.location,
            0.005
          );
          setRegionState(newRegion);
        } else {
          setError('Business location not found');
        }
      } catch (err) {
        setError('Failed to center on business');
      }
    },
    [businesses]
  );

  // Get directions URL
  const getDirections = useCallback(
    (
      destination: Coordinates,
      mode: 'driving' | 'walking' | 'transit' = 'driving'
    ): string => {
      return MapService.getDirectionsUrl(
        destination,
        userLocation || undefined,
        mode
      );
    },
    [userLocation]
  );

  // Initialize user location
  useEffect(() => {
    if (trackUserLocation) {
      const initializeLocation = async () => {
        try {
          setIsLoading(true);
          const location = await LocationService.getCurrentLocation();
          if (location) {
            setUserLocation(location);

            // Set initial region if not provided
            if (!initialRegion && !region) {
              const newRegion = MapService.createMapRegion(location);
              setRegionState(newRegion);
            }
          }
        } catch (err) {
          console.error('Error getting initial location:', err);
          // Don't set error for initial location failure
        } finally {
          setIsLoading(false);
        }
      };

      initializeLocation();
    }
  }, [trackUserLocation, initialRegion, region]);

  // Update markers when user location changes
  useEffect(() => {
    if (businesses.length > 0) {
      const businessMarkers = MapService.createBusinessMarkers(
        businesses,
        userLocation || undefined
      );
      setMarkers(businessMarkers);
    }
  }, [businesses, userLocation]);

  return {
    region,
    markers,
    userLocation,
    isLoading,
    error,
    setRegion,
    setBusinesses,
    fitToMarkers,
    centerOnUser,
    centerOnBusiness,
    getDirections,
    clearError,
  };
};
