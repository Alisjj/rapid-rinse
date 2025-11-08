import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  serverTimestamp,
  GeoPoint,
} from 'firebase/firestore';
import { db } from './config';
import { Business, Service, OperatingHours } from '../../types';
import { formatDocumentData } from './utils';

// Extended business interface with location data
export interface BusinessWithLocation extends Business {
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance?: number; // Distance from user in kilometers
  rating?: number;
  reviewCount?: number;
  isOpen?: boolean;
}

// Business search filters
export interface BusinessSearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  rating?: number;
  isOpen?: boolean;
}

// Pagination options
export interface PaginationOptions {
  limit: number;
  lastDoc?: DocumentSnapshot;
}

// Business service class
export class BusinessService {
  private static readonly COLLECTION_NAME = 'businesses';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static cache = new Map<
    string,
    { data: BusinessWithLocation; timestamp: number }
  >();

  // Get all businesses with optional filters and pagination
  static async getBusinesses(
    filters?: BusinessSearchFilters,
    pagination?: PaginationOptions
  ): Promise<{
    businesses: BusinessWithLocation[];
    lastDoc?: DocumentSnapshot;
  }> {
    try {
      const businessesRef = collection(db, this.COLLECTION_NAME);
      const constraints: QueryConstraint[] = [];

      // Apply filters
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters?.rating) {
        constraints.push(where('rating', '>=', filters.rating));
      }

      if (filters?.isOpen !== undefined) {
        constraints.push(where('isOpen', '==', filters.isOpen));
      }

      // Add ordering and pagination
      constraints.push(orderBy('createdAt', 'desc'));

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit));
      }

      if (pagination?.lastDoc) {
        constraints.push(startAfter(pagination.lastDoc));
      }

      const q = query(businessesRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const businesses: BusinessWithLocation[] = [];
      let lastDoc: DocumentSnapshot | undefined;

      querySnapshot.forEach((doc) => {
        const data = formatDocumentData<BusinessWithLocation>({
          id: doc.id,
          ...doc.data(),
        });

        // Calculate distance if user location is provided
        if (filters?.location && data.location) {
          data.distance = this.calculateDistance(
            filters.location.latitude,
            filters.location.longitude,
            data.location.latitude,
            data.location.longitude
          );
        }

        businesses.push(data);
        lastDoc = doc;
      });

      // Filter by location radius if specified
      let filteredBusinesses = businesses;
      if (filters?.location?.radius) {
        filteredBusinesses = businesses.filter(
          (business) =>
            !business.distance || business.distance <= filters.location!.radius
        );
      }

      // Filter by price range if specified
      if (filters?.priceRange) {
        filteredBusinesses = filteredBusinesses.filter((business) => {
          const avgPrice = this.calculateAverageServicePrice(business.services);
          return (
            avgPrice >= filters.priceRange!.min &&
            avgPrice <= filters.priceRange!.max
          );
        });
      }

      return { businesses: filteredBusinesses, lastDoc };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch businesses');
    }
  }

  // Get business by ID with caching
  static async getBusinessById(
    businessId: string
  ): Promise<BusinessWithLocation | null> {
    try {
      // Check cache first
      const cached = this.cache.get(businessId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const businessRef = doc(db, this.COLLECTION_NAME, businessId);
      const businessDoc = await getDoc(businessRef);

      if (!businessDoc.exists()) {
        return null;
      }

      const business = formatDocumentData<BusinessWithLocation>({
        id: businessDoc.id,
        ...businessDoc.data(),
      });

      // Cache the result
      this.cache.set(businessId, { data: business, timestamp: Date.now() });

      return business;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw new Error('Failed to fetch business details');
    }
  }

  // Search businesses by name or service
  static async searchBusinesses(
    searchTerm: string,
    filters?: BusinessSearchFilters,
    pagination?: PaginationOptions
  ): Promise<{
    businesses: BusinessWithLocation[];
    lastDoc?: DocumentSnapshot;
  }> {
    try {
      // For now, we'll do a simple text search on name and description
      // In production, you might want to use Algolia or similar for better search
      const businessesRef = collection(db, this.COLLECTION_NAME);
      const constraints: QueryConstraint[] = [];

      // Apply filters
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      constraints.push(orderBy('name'));

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit));
      }

      const q = query(businessesRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const businesses: BusinessWithLocation[] = [];
      const searchLower = searchTerm.toLowerCase();

      querySnapshot.forEach((doc) => {
        const data = formatDocumentData<BusinessWithLocation>({
          id: doc.id,
          ...doc.data(),
        });

        // Simple text matching
        const matchesName = data.name.toLowerCase().includes(searchLower);
        const matchesDescription = data.description
          .toLowerCase()
          .includes(searchLower);
        const matchesServices = data.services.some(
          (service) =>
            service.name.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower)
        );

        if (matchesName || matchesDescription || matchesServices) {
          businesses.push(data);
        }
      });

      return { businesses, lastDoc: undefined };
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw new Error('Failed to search businesses');
    }
  }

  // Get nearby businesses
  static async getNearbyBusinesses(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    limitCount: number = 20
  ): Promise<BusinessWithLocation[]> {
    try {
      // Note: For production, consider using GeoFirestore for efficient geo queries
      const { businesses } = await this.getBusinesses(
        {
          location: { latitude, longitude, radius: radiusKm },
        },
        { limit: limitCount * 2 } // Get more to account for filtering
      );

      // Sort by distance
      return businesses
        .filter((business) => business.distance !== undefined)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching nearby businesses:', error);
      throw new Error('Failed to fetch nearby businesses');
    }
  }

  // Get business services
  static async getBusinessServices(businessId: string): Promise<Service[]> {
    try {
      const business = await this.getBusinessById(businessId);
      return business?.services || [];
    } catch (error) {
      console.error('Error fetching business services:', error);
      throw new Error('Failed to fetch business services');
    }
  }

  // Create new business (for business owners)
  static async createBusiness(
    businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const businessRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...businessData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return businessRef.id;
    } catch (error) {
      console.error('Error creating business:', error);
      throw new Error('Failed to create business');
    }
  }

  // Update business
  static async updateBusiness(
    businessId: string,
    updates: Partial<Omit<Business, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const businessRef = doc(db, this.COLLECTION_NAME, businessId);
      await updateDoc(businessRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.cache.delete(businessId);
    } catch (error) {
      console.error('Error updating business:', error);
      throw new Error('Failed to update business');
    }
  }

  // Delete business
  static async deleteBusiness(businessId: string): Promise<void> {
    try {
      const businessRef = doc(db, this.COLLECTION_NAME, businessId);
      await deleteDoc(businessRef);

      // Clear cache
      this.cache.delete(businessId);
    } catch (error) {
      console.error('Error deleting business:', error);
      throw new Error('Failed to delete business');
    }
  }

  // Check if business is currently open
  static isBusinessOpen(operatingHours: OperatingHours): boolean {
    const now = new Date();
    const dayOfWeek = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const todayHours = operatingHours[dayOfWeek];
    if (!todayHours || !todayHours.isOpen) {
      return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }

  // Calculate distance between two coordinates (Haversine formula)
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Calculate average service price for a business
  private static calculateAverageServicePrice(services: Service[]): number {
    if (services.length === 0) return 0;
    const total = services.reduce((sum, service) => sum + service.price, 0);
    return total / services.length;
  }

  // Clear cache (useful for testing or manual cache invalidation)
  static clearCache(): void {
    this.cache.clear();
  }
}
