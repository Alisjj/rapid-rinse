import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

// Location coordinates interface
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Location with address interface
export interface LocationWithAddress extends Coordinates {
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

// Location permission status
export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

// Location service class
export class LocationService {
  private static currentLocation: LocationWithAddress | null = null;
  private static watchId: Location.LocationSubscription | null = null;
  private static permissionStatus: LocationPermissionStatus = 'undetermined';

  // Request location permissions
  static async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
        this.permissionStatus = 'denied';
        return 'denied';
      }

      // Request foreground permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        this.permissionStatus = 'granted';
        return 'granted';
      } else {
        this.permissionStatus = 'denied';
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to show nearby businesses and provide better service.',
          [{ text: 'OK' }]
        );
        return 'denied';
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      this.permissionStatus = 'denied';
      return 'denied';
    }
  }

  // Get current location permission status
  static async getLocationPermissionStatus(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.permissionStatus = status === 'granted' ? 'granted' : 'denied';
      return this.permissionStatus;
    } catch (error) {
      console.error('Error getting location permission status:', error);
      return 'denied';
    }
  }

  // Get current location
  static async getCurrentLocation(
    highAccuracy: boolean = true
  ): Promise<LocationWithAddress | null> {
    try {
      const permissionStatus = await this.getLocationPermissionStatus();

      if (permissionStatus !== 'granted') {
        const newStatus = await this.requestLocationPermission();
        if (newStatus !== 'granted') {
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: highAccuracy
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const coordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Get address information
      const locationWithAddress = await this.reverseGeocode(coordinates);
      this.currentLocation = locationWithAddress;

      return locationWithAddress;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw new Error('Failed to get current location');
    }
  }

  // Watch location changes
  static async watchLocation(
    callback: (location: LocationWithAddress) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<boolean> {
    try {
      const permissionStatus = await this.getLocationPermissionStatus();

      if (permissionStatus !== 'granted') {
        const newStatus = await this.requestLocationPermission();
        if (newStatus !== 'granted') {
          return false;
        }
      }

      // Stop existing watch if any
      if (this.watchId) {
        this.stopWatchingLocation();
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.Balanced,
          timeInterval: options?.timeInterval || 10000, // 10 seconds
          distanceInterval: options?.distanceInterval || 50, // 50 meters
        },
        async (location) => {
          const coordinates: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          const locationWithAddress = await this.reverseGeocode(coordinates);
          this.currentLocation = locationWithAddress;
          callback(locationWithAddress);
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      return false;
    }
  }

  // Stop watching location
  static stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  // Reverse geocoding - convert coordinates to address
  static async reverseGeocode(
    coordinates: Coordinates
  ): Promise<LocationWithAddress> {
    try {
      const [address] = await Location.reverseGeocodeAsync(coordinates);

      return {
        ...coordinates,
        address: address ? this.formatAddress(address) : undefined,
        city: address?.city || undefined,
        region: address?.region || undefined,
        country: address?.country || undefined,
        postalCode: address?.postalCode || undefined,
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Return coordinates without address if geocoding fails
      return coordinates;
    }
  }

  // Forward geocoding - convert address to coordinates
  static async geocodeAddress(address: string): Promise<Coordinates[]> {
    try {
      const locations = await Location.geocodeAsync(address);
      return locations.map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error('Failed to geocode address');
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates,
    unit: 'km' | 'miles' = 'km'
  ): number {
    const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate bearing between two coordinates
  static calculateBearing(coord1: Coordinates, coord2: Coordinates): number {
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    const lat1 = this.toRadians(coord1.latitude);
    const lat2 = this.toRadians(coord2.latitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = this.toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360; // Normalize to 0-360 degrees
  }

  // Get cached current location
  static getCachedLocation(): LocationWithAddress | null {
    return this.currentLocation;
  }

  // Check if location is within a radius
  static isWithinRadius(
    center: Coordinates,
    point: Coordinates,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(center, point, 'km');
    return distance <= radiusKm;
  }

  // Format address from reverse geocoding result
  private static formatAddress(
    address: Location.LocationGeocodedAddress
  ): string {
    const parts = [];

    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);

    return parts.join(', ');
  }

  // Convert degrees to radians
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Convert radians to degrees
  private static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  // Cleanup resources
  static cleanup(): void {
    this.stopWatchingLocation();
    this.currentLocation = null;
  }
}
