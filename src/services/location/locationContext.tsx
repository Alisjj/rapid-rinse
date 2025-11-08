import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  LocationService,
  LocationWithAddress,
  LocationPermissionStatus,
} from './locationService';

// Location context interface
interface LocationContextType {
  currentLocation: LocationWithAddress | null;
  permissionStatus: LocationPermissionStatus;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<LocationPermissionStatus>;
  getCurrentLocation: (
    highAccuracy?: boolean
  ) => Promise<LocationWithAddress | null>;
  startWatching: () => Promise<boolean>;
  stopWatching: () => void;
  clearError: () => void;
}

// Create context
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Location provider props
interface LocationProviderProps {
  children: ReactNode;
  autoStart?: boolean; // Automatically start location tracking
  watchLocation?: boolean; // Enable location watching
}

// Location provider component
export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
  autoStart = false,
  watchLocation = false,
}) => {
  const [currentLocation, setCurrentLocation] =
    useState<LocationWithAddress | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  // Clear error function
  const clearError = () => setError(null);

  // Request location permission
  const requestPermission = async (): Promise<LocationPermissionStatus> => {
    try {
      setIsLoading(true);
      setError(null);

      const status = await LocationService.requestLocationPermission();
      setPermissionStatus(status);

      return status;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to request location permission';
      setError(errorMessage);
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = async (
    highAccuracy: boolean = true
  ): Promise<LocationWithAddress | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const location = await LocationService.getCurrentLocation(highAccuracy);
      setCurrentLocation(location);

      return location;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get current location';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Start watching location
  const startWatching = async (): Promise<boolean> => {
    try {
      if (isWatching) {
        return true;
      }

      setIsLoading(true);
      setError(null);

      const success = await LocationService.watchLocation(
        (location) => {
          setCurrentLocation(location);
        },
        {
          timeInterval: 10000, // 10 seconds
          distanceInterval: 50, // 50 meters
        }
      );

      setIsWatching(success);
      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to start location watching';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Stop watching location
  const stopWatching = () => {
    LocationService.stopWatchingLocation();
    setIsWatching(false);
  };

  // Initialize location services
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Check current permission status
        const status = await LocationService.getLocationPermissionStatus();
        setPermissionStatus(status);

        // Auto-start if enabled and permission granted
        if (autoStart && status === 'granted') {
          await getCurrentLocation();

          if (watchLocation) {
            await startWatching();
          }
        }
      } catch (err) {
        console.error('Error initializing location:', err);
      }
    };

    initializeLocation();

    // Cleanup on unmount
    return () => {
      LocationService.cleanup();
    };
  }, [autoStart, watchLocation]);

  // Handle app state changes (pause/resume location tracking)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && isWatching) {
        // Optionally pause location tracking in background
        // stopWatching();
      } else if (
        nextAppState === 'active' &&
        watchLocation &&
        permissionStatus === 'granted'
      ) {
        // Resume location tracking when app becomes active
        if (!isWatching) {
          startWatching();
        }
      }
    };

    // Note: In a real app, you'd use AppState from react-native
    // AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [isWatching, watchLocation, permissionStatus]);

  const value: LocationContextType = {
    currentLocation,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    startWatching,
    stopWatching,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// Custom hook for getting nearby businesses
export const useNearbyBusinesses = (radiusKm: number = 10) => {
  const { currentLocation } = useLocation();
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyBusinesses = async () => {
      if (!currentLocation) return;

      try {
        setLoading(true);
        setError(null);

        // This would integrate with BusinessService
        // const businesses = await BusinessService.getNearbyBusinesses(
        //   currentLocation.latitude,
        //   currentLocation.longitude,
        //   radiusKm
        // );
        // setNearbyBusinesses(businesses);

        // Placeholder for now
        setNearbyBusinesses([]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch nearby businesses';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyBusinesses();
  }, [currentLocation, radiusKm]);

  return {
    nearbyBusinesses,
    loading,
    error,
    refetch: () => {
      // Trigger refetch
    },
  };
};
