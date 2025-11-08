import { Coordinates, LocationWithAddress } from './locationService';
import { BusinessWithLocation } from '../firebase/businessService';

// Map region interface
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Map marker interface
export interface MapMarker {
  id: string;
  coordinate: Coordinates;
  title: string;
  description?: string;
  type: 'business' | 'user' | 'service';
  data?: any;
}

// Business marker interface
export interface BusinessMarker extends MapMarker {
  type: 'business';
  data: {
    business: BusinessWithLocation;
    rating?: number;
    isOpen?: boolean;
    distance?: number;
  };
}

// Map style presets
export type MapStyle = 'standard' | 'satellite' | 'hybrid' | 'terrain';

// Map service class
export class MapService {
  // Default map configuration
  private static readonly DEFAULT_ZOOM_LEVEL = 0.01; // Latitude/longitude delta
  private static readonly BUSINESS_SEARCH_RADIUS = 10; // kilometers
  private static readonly MAX_MARKERS = 50;

  // Create map region from coordinates
  static createMapRegion(
    coordinates: Coordinates,
    zoomLevel: number = this.DEFAULT_ZOOM_LEVEL
  ): MapRegion {
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    };
  }

  // Create map region that fits all coordinates
  static createRegionFromCoordinates(
    coordinates: Coordinates[],
    padding: number = 0.01
  ): MapRegion {
    if (coordinates.length === 0) {
      throw new Error('At least one coordinate is required');
    }

    if (coordinates.length === 1) {
      return this.createMapRegion(coordinates[0]);
    }

    const latitudes = coordinates.map((coord) => coord.latitude);
    const longitudes = coordinates.map((coord) => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = maxLat - minLat + padding;
    const lngDelta = maxLng - minLng + padding;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }

  // Convert businesses to map markers
  static createBusinessMarkers(
    businesses: BusinessWithLocation[],
    userLocation?: Coordinates
  ): BusinessMarker[] {
    return businesses
      .slice(0, this.MAX_MARKERS)
      .map((business) => {
        const distance =
          userLocation && business.location
            ? this.calculateDistance(userLocation, business.location)
            : undefined;

        return {
          id: business.id,
          coordinate: business.location || { latitude: 0, longitude: 0 },
          title: business.name,
          description: business.description,
          type: 'business' as const,
          data: {
            business,
            rating: business.rating,
            isOpen: business.isOpen,
            distance,
          },
        };
      })
      .filter(
        (marker) =>
          marker.coordinate.latitude !== 0 && marker.coordinate.longitude !== 0
      );
  }

  // Create user location marker
  static createUserMarker(location: LocationWithAddress): MapMarker {
    return {
      id: 'user-location',
      coordinate: location,
      title: 'Your Location',
      description: location.address || 'Current location',
      type: 'user',
      data: { location },
    };
  }

  // Get optimal zoom level based on distance
  static getOptimalZoomLevel(distanceKm: number): number {
    if (distanceKm <= 1) return 0.005;
    if (distanceKm <= 5) return 0.02;
    if (distanceKm <= 10) return 0.05;
    if (distanceKm <= 25) return 0.1;
    if (distanceKm <= 50) return 0.2;
    return 0.5;
  }

  // Calculate map region for business search
  static createBusinessSearchRegion(
    userLocation: Coordinates,
    businesses: BusinessWithLocation[]
  ): MapRegion {
    const allCoordinates = [userLocation];

    // Add business coordinates
    businesses.forEach((business) => {
      if (business.location) {
        allCoordinates.push(business.location);
      }
    });

    return this.createRegionFromCoordinates(allCoordinates, 0.02);
  }

  // Filter businesses within map bounds
  static filterBusinessesInBounds(
    businesses: BusinessWithLocation[],
    region: MapRegion
  ): BusinessWithLocation[] {
    const northEast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };

    const southWest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    return businesses.filter((business) => {
      if (!business.location) return false;

      return (
        business.location.latitude >= southWest.latitude &&
        business.location.latitude <= northEast.latitude &&
        business.location.longitude >= southWest.longitude &&
        business.location.longitude <= northEast.longitude
      );
    });
  }

  // Get directions URL for external navigation apps
  static getDirectionsUrl(
    destination: Coordinates,
    origin?: Coordinates,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): string {
    const destString = `${destination.latitude},${destination.longitude}`;
    const originString = origin ? `${origin.latitude},${origin.longitude}` : '';

    // iOS - Apple Maps
    if (Platform.OS === 'ios') {
      const baseUrl = 'http://maps.apple.com/';
      const params = new URLSearchParams({
        daddr: destString,
        ...(originString && { saddr: originString }),
        dirflg: mode === 'walking' ? 'w' : mode === 'transit' ? 'r' : 'd',
      });
      return `${baseUrl}?${params.toString()}`;
    }

    // Android - Google Maps
    const baseUrl = 'https://www.google.com/maps/dir/';
    const travelMode =
      mode === 'walking'
        ? 'walking'
        : mode === 'transit'
          ? 'transit'
          : 'driving';

    if (originString) {
      return `${baseUrl}${originString}/${destString}/@${destString},15z/data=!3m1!4b1!4m2!4m1!3e${
        mode === 'walking' ? '2' : mode === 'transit' ? '3' : '0'
      }`;
    }

    return `${baseUrl}/${destString}/@${destString},15z`;
  }

  // Calculate estimated travel time (placeholder implementation)
  static estimateTravelTime(
    origin: Coordinates,
    destination: Coordinates,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): number {
    const distance = this.calculateDistance(origin, destination);

    // Rough estimates in minutes
    switch (mode) {
      case 'walking':
        return Math.round(distance * 12); // ~5 km/h walking speed
      case 'transit':
        return Math.round(distance * 4); // ~15 km/h average transit speed
      case 'driving':
      default:
        return Math.round(distance * 2); // ~30 km/h average city driving
    }
  }

  // Format distance for display
  static formatDistance(
    distanceKm: number,
    unit: 'km' | 'miles' = 'km'
  ): string {
    if (unit === 'miles') {
      const miles = distanceKm * 0.621371;
      return miles < 1
        ? `${Math.round(miles * 5280)} ft`
        : `${miles.toFixed(1)} mi`;
    }

    return distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`;
  }

  // Format travel time for display
  static formatTravelTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  }

  // Check if coordinate is valid
  static isValidCoordinate(coordinate: Coordinates): boolean {
    return (
      coordinate.latitude >= -90 &&
      coordinate.latitude <= 90 &&
      coordinate.longitude >= -180 &&
      coordinate.longitude <= 180 &&
      coordinate.latitude !== 0 &&
      coordinate.longitude !== 0
    );
  }

  // Calculate distance between coordinates (reuse from LocationService)
  private static calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
  ): number {
    const R = 6371; // Earth's radius in kilometers
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

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Platform detection (since we can't import Platform in this context)
const Platform = {
  OS:
    typeof navigator !== 'undefined' && navigator.platform
      ? navigator.platform.toLowerCase().includes('iphone') ||
        navigator.platform.toLowerCase().includes('ipad')
        ? 'ios'
        : 'android'
      : 'ios', // Default fallback
};
