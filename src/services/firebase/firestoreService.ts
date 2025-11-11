/**
 * Firestore Service Layer
 *
 * Comprehensive service for all Firestore operations including:
 * - Business operations with geolocation filtering
 * - Booking operations with availability checking
 * - User profile and vehicle management
 * - Review operations with pagination
 */

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
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  Unsubscribe,
  GeoPoint as FirestoreGeoPoint,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db, storage } from './config';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  BusinessInput,
  Booking,
  BookingInput,
  Vehicle,
  VehicleInput,
  Review,
  ReviewInput,
  User,
  UserInput,
  COLLECTIONS,
  GeoPoint,
  BookingStatus,
  PaymentStatus,
} from './collections';
import { Business } from '../../types';
import {
  createBusinessDocument,
  createBookingDocument,
  createVehicleDocument,
  createReviewDocument,
  validateBusinessInput,
  validateBookingInput,
  validateVehicleInput,
  validateReviewInput,
} from './collectionHelpers';
import { formatDocumentData } from './utils';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface BusinessFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  isActive?: boolean;
  minRating?: number;
}

export interface PaginationOptions {
  limit: number;
  lastDoc?: DocumentSnapshot;
}

export interface BookingFilters {
  userId?: string;
  businessId?: string;
  status?: BookingStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ReviewFilters {
  businessId: string;
  minRating?: number;
  limit?: number;
  lastDoc?: DocumentSnapshot;
}

// Real-time listener callbacks
export type BusinessListener = (businesses: Business[]) => void;
export type BookingListener = (bookings: Booking[]) => void;

// ============================================================================
// Firestore Service Class
// ============================================================================

export class FirestoreService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static listeners = new Map<string, Unsubscribe>();

  // ==========================================================================
  // BUSINESS OPERATIONS (Task 4.1)
  // ==========================================================================

  /**
   * Get businesses with geolocation filtering
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  static async getBusinesses(
    filters?: BusinessFilters,
    pagination?: PaginationOptions
  ): Promise<{ businesses: Business[]; lastDoc?: DocumentSnapshot }> {
    try {
      const businessesRef = collection(db, COLLECTIONS.BUSINESSES);
      const constraints: QueryConstraint[] = [];

      // Apply filters
      // Note: isActive filter removed to avoid requiring composite index
      // All businesses are currently active
      // if (filters?.isActive !== undefined) {
      //   constraints.push(where('isActive', '==', filters.isActive));
      // }

      if (filters?.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }

      // Add ordering
      constraints.push(orderBy('createdAt', 'desc'));

      // Add pagination
      if (pagination?.limit) {
        constraints.push(limit(pagination.limit));
      }

      if (pagination?.lastDoc) {
        constraints.push(startAfter(pagination.lastDoc));
      }

      const q = query(businessesRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const businesses: Business[] = [];
      let lastDoc: DocumentSnapshot | undefined;

      querySnapshot.forEach(doc => {
        const business = formatDocumentData<Business>({
          id: doc.id,
          ...doc.data(),
        });
        businesses.push(business);
        lastDoc = doc;
      });

      // Apply geolocation filtering if specified
      let filteredBusinesses = businesses;
      if (filters?.location) {
        filteredBusinesses = businesses.filter(business => {
          const distance = this.calculateDistance(
            filters.location!.latitude,
            filters.location!.longitude,
            business.location.latitude,
            business.location.longitude
          );
          return distance <= filters.location!.radius;
        });

        // Sort by distance
        filteredBusinesses.sort((a, b) => {
          const distA = this.calculateDistance(
            filters.location!.latitude,
            filters.location!.longitude,
            a.location.latitude,
            a.location.longitude
          );
          const distB = this.calculateDistance(
            filters.location!.latitude,
            filters.location!.longitude,
            b.location.latitude,
            b.location.longitude
          );
          return distA - distB;
        });
      }

      return { businesses: filteredBusinesses, lastDoc };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch businesses');
    }
  }

  /**
   * Get business by ID for business details
   * Requirements: 2.3
   */
  static async getBusinessById(businessId: string): Promise<Business | null> {
    try {
      // Check cache first
      const cached = this.cache.get(`business_${businessId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const businessRef = doc(db, COLLECTIONS.BUSINESSES, businessId);
      const businessDoc = await getDoc(businessRef);

      if (!businessDoc.exists()) {
        return null;
      }

      const business = formatDocumentData<Business>({
        id: businessDoc.id,
        ...businessDoc.data(),
      });

      // Cache the result
      this.cache.set(`business_${businessId}`, {
        data: business,
        timestamp: Date.now(),
      });

      return business;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw new Error('Failed to fetch business details');
    }
  }

  /**
   * Search businesses with text search
   * Requirements: 2.2
   */
  static async searchBusinesses(
    searchTerm: string,
    filters?: BusinessFilters,
    pagination?: PaginationOptions
  ): Promise<{ businesses: Business[]; lastDoc?: DocumentSnapshot }> {
    try {
      // Get all businesses (with filters)
      const { businesses, lastDoc } = await this.getBusinesses(
        filters,
        pagination
      );

      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const filteredBusinesses = businesses.filter(business => {
        const matchesName = business.name.toLowerCase().includes(searchLower);
        const matchesDescription = business.description
          .toLowerCase()
          .includes(searchLower);
        const matchesAddress = business.address
          .toLowerCase()
          .includes(searchLower);
        const matchesServices = business.services
          ? business.services.some(
              service =>
                service.name.toLowerCase().includes(searchLower) ||
                service.description.toLowerCase().includes(searchLower)
            )
          : false;

        return (
          matchesName || matchesDescription || matchesAddress || matchesServices
        );
      });

      return { businesses: filteredBusinesses, lastDoc };
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw new Error('Failed to search businesses');
    }
  }

  /**
   * Add real-time listener for business data updates
   * Requirements: 2.4
   */
  static subscribeToBusinesses(
    filters: BusinessFilters,
    callback: BusinessListener
  ): Unsubscribe {
    try {
      const businessesRef = collection(db, COLLECTIONS.BUSINESSES);
      const constraints: QueryConstraint[] = [];

      if (filters.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      if (filters.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(businessesRef, ...constraints);

      const unsubscribe = onSnapshot(q, querySnapshot => {
        const businesses: Business[] = [];
        querySnapshot.forEach(doc => {
          businesses.push(
            formatDocumentData<Business>({
              id: doc.id,
              ...doc.data(),
            })
          );
        });

        callback(businesses);
      });

      const listenerId = `businesses_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up business listener:', error);
      throw new Error('Failed to set up real-time business updates');
    }
  }

  // ==========================================================================
  // BOOKING OPERATIONS (Task 4.2)
  // ==========================================================================

  /**
   * Create booking with availability checking
   * Requirements: 3.1, 3.2
   */
  static async createBooking(input: BookingInput): Promise<string> {
    try {
      // Validate input
      const errors = validateBookingInput(input);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }

      // Check availability
      const isAvailable = await this.checkBookingAvailability(
        input.businessId,
        input.serviceId,
        input.scheduledDate instanceof Timestamp
          ? input.scheduledDate.toDate()
          : input.scheduledDate
      );

      if (!isAvailable) {
        throw new Error('This time slot is not available');
      }

      // Create booking document
      const bookingData = createBookingDocument('', input);

      const bookingRef = await addDoc(
        collection(db, COLLECTIONS.BOOKINGS),
        bookingData
      );

      return bookingRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to create booking');
    }
  }

  /**
   * Get bookings for user booking history
   * Requirements: 3.1
   */
  static async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
      const constraints: QueryConstraint[] = [];

      // Apply filters
      if (filters?.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }

      if (filters?.businessId) {
        constraints.push(where('businessId', '==', filters.businessId));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.dateRange) {
        constraints.push(
          where(
            'scheduledDate',
            '>=',
            Timestamp.fromDate(filters.dateRange.start)
          )
        );
        constraints.push(
          where(
            'scheduledDate',
            '<=',
            Timestamp.fromDate(filters.dateRange.end)
          )
        );
      }

      // Order by scheduled date
      constraints.push(orderBy('scheduledDate', 'desc'));

      const q = query(bookingsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const bookings: Booking[] = [];
      querySnapshot.forEach(doc => {
        bookings.push(
          formatDocumentData<Booking>({
            id: doc.id,
            ...doc.data(),
          })
        );
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  /**
   * Update booking for status changes
   * Requirements: 3.3
   */
  static async updateBooking(
    bookingId: string,
    updates: Partial<Booking>
  ): Promise<void> {
    try {
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);

      // Validate status transition if status is being updated
      if (updates.status) {
        const currentBooking = await this.getBookingById(bookingId);
        if (
          currentBooking &&
          !this.isValidStatusTransition(currentBooking.status, updates.status)
        ) {
          throw new Error(
            `Invalid status transition from ${currentBooking.status} to ${updates.status}`
          );
        }
      }

      // Add timestamps for status changes
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      if (updates.status === 'cancelled') {
        updateData.cancelledAt = serverTimestamp();
      } else if (updates.status === 'completed') {
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(bookingRef, updateData);

      // Clear cache
      this.cache.delete(`booking_${bookingId}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to update booking');
    }
  }

  /**
   * Cancel booking with refund logic
   * Requirements: 3.4
   */
  static async cancelBooking(
    bookingId: string,
    reason?: string
  ): Promise<void> {
    try {
      const booking = await this.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Check if booking can be cancelled
      if (!['pending', 'confirmed'].includes(booking.status)) {
        throw new Error('Booking cannot be cancelled in its current state');
      }

      // Update booking status
      await this.updateBooking(bookingId, {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : booking.notes,
      });

      // Process refund if payment was made
      if (booking.paymentStatus === 'paid') {
        await this.processRefund(bookingId);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to cancel booking');
    }
  }

  /**
   * Add real-time listener for booking status updates
   * Requirements: 3.5
   */
  static subscribeToBookings(
    filters: BookingFilters,
    callback: BookingListener
  ): Unsubscribe {
    try {
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
      const constraints: QueryConstraint[] = [];

      if (filters.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }

      if (filters.businessId) {
        constraints.push(where('businessId', '==', filters.businessId));
      }

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('scheduledDate', 'desc'));

      const q = query(bookingsRef, ...constraints);

      const unsubscribe = onSnapshot(q, querySnapshot => {
        const bookings: Booking[] = [];
        querySnapshot.forEach(doc => {
          bookings.push(
            formatDocumentData<Booking>({
              id: doc.id,
              ...doc.data(),
            })
          );
        });

        callback(bookings);
      });

      const listenerId = `bookings_${filters.userId || filters.businessId}_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up booking listener:', error);
      throw new Error('Failed to set up real-time booking updates');
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const cached = this.cache.get(`booking_${bookingId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        return null;
      }

      const booking = formatDocumentData<Booking>({
        id: bookingDoc.id,
        ...bookingDoc.data(),
      });

      this.cache.set(`booking_${bookingId}`, {
        data: booking,
        timestamp: Date.now(),
      });

      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking details');
    }
  }

  // ==========================================================================
  // USER PROFILE AND VEHICLE OPERATIONS (Task 4.3)
  // ==========================================================================

  /**
   * Get user profile
   * Requirements: 5.1
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const cached = this.cache.get(`user_${userId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const user = formatDocumentData<User>({
        id: userDoc.id,
        ...userDoc.data(),
      });

      this.cache.set(`user_${userId}`, {
        data: user,
        timestamp: Date.now(),
      });

      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Update user profile
   * Requirements: 5.1
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      this.cache.delete(`user_${userId}`);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Add vehicle
   * Requirements: 5.2
   */
  static async addVehicle(input: VehicleInput): Promise<string> {
    try {
      const errors = validateVehicleInput(input);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }

      const vehicleData = createVehicleDocument('', input);

      const vehicleRef = await addDoc(
        collection(db, COLLECTIONS.VEHICLES),
        vehicleData
      );

      this.cache.delete(`vehicles_${input.userId}`);

      return vehicleRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error instanceof Error ? error : new Error('Failed to add vehicle');
    }
  }

  /**
   * Get vehicles for a user
   * Requirements: 5.2
   */
  static async getVehicles(userId: string): Promise<Vehicle[]> {
    try {
      const cached = this.cache.get(`vehicles_${userId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const vehiclesRef = collection(db, COLLECTIONS.VEHICLES);
      const q = query(
        vehiclesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vehicles: Vehicle[] = [];

      querySnapshot.forEach(doc => {
        vehicles.push(
          formatDocumentData<Vehicle>({
            id: doc.id,
            ...doc.data(),
          })
        );
      });

      this.cache.set(`vehicles_${userId}`, {
        data: vehicles,
        timestamp: Date.now(),
      });

      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  /**
   * Delete vehicle
   * Requirements: 5.3, 5.5
   */
  static async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
      const vehicleDoc = await getDoc(vehicleRef);

      if (vehicleDoc.exists()) {
        const vehicleData = vehicleDoc.data() as Vehicle;
        await deleteDoc(vehicleRef);
        this.cache.delete(`vehicles_${vehicleData.userId}`);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw new Error('Failed to delete vehicle');
    }
  }

  /**
   * Upload profile picture to Firebase Storage
   * Requirements: 5.4
   */
  static async uploadProfilePicture(
    userId: string,
    imageUri: string
  ): Promise<string> {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(
        storage,
        `profile_pictures/${userId}/${Date.now()}.jpg`
      );

      // Upload image
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile with new photo URL
      await this.updateUserProfile(userId, { photoURL: downloadURL });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Failed to upload profile picture');
    }
  }

  // ==========================================================================
  // REVIEW OPERATIONS (Task 4.4)
  // ==========================================================================

  /**
   * Add review with validation
   * Requirements: 8.1, 8.2
   */
  static async addReview(input: ReviewInput): Promise<string> {
    try {
      const errors = validateReviewInput(input);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }

      // Check if user has already reviewed this booking
      const existingReview = await this.getReviewByBooking(input.bookingId);
      if (existingReview) {
        throw new Error('You have already reviewed this booking');
      }

      const reviewData = createReviewDocument('', input);

      const reviewRef = await addDoc(
        collection(db, COLLECTIONS.REVIEWS),
        reviewData
      );

      // Update business rating and review count
      await this.updateBusinessRating(input.businessId);

      return reviewRef.id;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error instanceof Error ? error : new Error('Failed to add review');
    }
  }

  /**
   * Get reviews with pagination
   * Requirements: 8.3, 8.4
   */
  static async getReviews(
    filters: ReviewFilters
  ): Promise<{ reviews: Review[]; lastDoc?: DocumentSnapshot }> {
    try {
      const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
      const constraints: QueryConstraint[] = [
        where('businessId', '==', filters.businessId),
      ];

      if (filters.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }

      // Order by most recent first
      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      if (filters.lastDoc) {
        constraints.push(startAfter(filters.lastDoc));
      }

      const q = query(reviewsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const reviews: Review[] = [];
      let lastDoc: DocumentSnapshot | undefined;

      querySnapshot.forEach(doc => {
        reviews.push(
          formatDocumentData<Review>({
            id: doc.id,
            ...doc.data(),
          })
        );
        lastDoc = doc;
      });

      return { reviews, lastDoc };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to fetch reviews');
    }
  }

  /**
   * Calculate and update business average rating
   * Requirements: 8.2
   */
  static async updateBusinessRating(businessId: string): Promise<void> {
    try {
      const { reviews } = await this.getReviews({ businessId });

      if (reviews.length === 0) {
        return;
      }

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;

      const businessRef = doc(db, COLLECTIONS.BUSINESSES, businessId);
      await updateDoc(businessRef, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
        updatedAt: serverTimestamp(),
      });

      this.cache.delete(`business_${businessId}`);
    } catch (error) {
      console.error('Error updating business rating:', error);
      throw new Error('Failed to update business rating');
    }
  }

  /**
   * Flag review for moderation
   * Requirements: 8.5
   */
  static async flagReview(reviewId: string): Promise<void> {
    try {
      const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
      await updateDoc(reviewRef, {
        flagged: true,
      });
    } catch (error) {
      console.error('Error flagging review:', error);
      throw new Error('Failed to flag review');
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
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

  /**
   * Check booking availability
   */
  private static async checkBookingAvailability(
    businessId: string,
    serviceId: string,
    scheduledDate: Date
  ): Promise<boolean> {
    try {
      // Check for conflicting bookings within 1 hour window
      const startTime = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
      const endTime = new Date(scheduledDate.getTime() + 30 * 60 * 1000);

      const conflicts = await this.getBookings({
        businessId,
        dateRange: { start: startTime, end: endTime },
      });

      // Check if any confirmed or pending bookings exist for the same service
      const hasConflict = conflicts.some(
        booking =>
          booking.serviceId === serviceId &&
          ['pending', 'confirmed'].includes(booking.status)
      );

      return !hasConflict;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      return false;
    }
  }

  /**
   * Validate booking status transition
   */
  private static isValidStatusTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus
  ): boolean {
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    return validTransitions[currentStatus].includes(newStatus);
  }

  /**
   * Process refund for cancelled booking
   */
  private static async processRefund(bookingId: string): Promise<void> {
    try {
      // Update payment status to refunded
      await this.updateBooking(bookingId, {
        paymentStatus: 'refunded',
      });

      // Note: Actual refund processing would be handled by payment gateway
      // This is a placeholder for the refund logic
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Get review by booking ID
   */
  private static async getReviewByBooking(
    bookingId: string
  ): Promise<Review | null> {
    try {
      const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
      const q = query(reviewsRef, where('bookingId', '==', bookingId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return formatDocumentData<Review>({
        id: doc.id,
        ...doc.data(),
      });
    } catch (error) {
      console.error('Error fetching review by booking:', error);
      return null;
    }
  }

  /**
   * Clear all caches
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cleanup all listeners
   */
  static cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
    this.cache.clear();
  }
}
