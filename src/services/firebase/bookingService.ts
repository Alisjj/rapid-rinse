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
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Booking } from '../../types';
import { formatDocumentData } from './utils';

// Extended booking interface with additional data
export interface BookingWithDetails extends Booking {
  businessName?: string;
  serviceName?: string;
  customerName?: string;
  businessAddress?: string;
  servicePrice?: number;
  serviceDuration?: number;
}

// Booking creation data
export interface CreateBookingData {
  customerId: string;
  businessId: string;
  serviceId: string;
  scheduledDate: Date;
  notes?: string;
}

// Booking update data
export interface UpdateBookingData {
  status?: Booking['status'];
  scheduledDate?: Date;
  notes?: string;
}

// Booking filters
export interface BookingFilters {
  customerId?: string;
  businessId?: string;
  status?: Booking['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Real-time booking listener callback
export type BookingListener = (bookings: BookingWithDetails[]) => void;

// Booking service class
export class BookingService {
  private static readonly COLLECTION_NAME = 'bookings';
  private static readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for bookings
  private static cache = new Map<
    string,
    { data: BookingWithDetails; timestamp: number }
  >();
  private static listeners = new Map<string, Unsubscribe>();

  // Create a new booking
  static async createBooking(bookingData: CreateBookingData): Promise<string> {
    try {
      // Validate booking date is in the future
      if (bookingData.scheduledDate <= new Date()) {
        throw new Error('Booking date must be in the future');
      }

      // Check for conflicting bookings (same service, same time)
      const conflicts = await this.checkBookingConflicts(
        bookingData.businessId,
        bookingData.serviceId,
        bookingData.scheduledDate
      );

      if (conflicts.length > 0) {
        throw new Error('This time slot is already booked');
      }

      // Get service details for pricing
      const serviceDetails = await this.getServiceDetails(
        bookingData.businessId,
        bookingData.serviceId
      );

      const booking = {
        ...bookingData,
        status: 'pending' as const,
        totalAmount: serviceDetails.price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const bookingRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        booking
      );

      // Send notification to business owner (implement as needed)
      await this.notifyBusinessOwner(bookingData.businessId, bookingRef.id);

      return bookingRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to create booking');
    }
  }

  // Get booking by ID
  static async getBookingById(
    bookingId: string
  ): Promise<BookingWithDetails | null> {
    try {
      // Check cache first
      const cached = this.cache.get(bookingId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const bookingRef = doc(db, this.COLLECTION_NAME, bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        return null;
      }

      const bookingData = formatDocumentData<Booking>({
        id: bookingDoc.id,
        ...bookingDoc.data(),
      });

      // Enrich with business and service details
      const enrichedBooking = await this.enrichBookingWithDetails(bookingData);

      // Cache the result
      this.cache.set(bookingId, {
        data: enrichedBooking,
        timestamp: Date.now(),
      });

      return enrichedBooking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking details');
    }
  }

  // Get bookings with filters
  static async getBookings(
    filters?: BookingFilters
  ): Promise<BookingWithDetails[]> {
    try {
      const bookingsRef = collection(db, this.COLLECTION_NAME);
      const constraints = [];

      // Apply filters
      if (filters?.customerId) {
        constraints.push(where('customerId', '==', filters.customerId));
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

      // Order by scheduled date (most recent first)
      constraints.push(orderBy('scheduledDate', 'desc'));

      const q = query(bookingsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push(
          formatDocumentData<Booking>({
            id: doc.id,
            ...doc.data(),
          })
        );
      });

      // Enrich all bookings with details
      const enrichedBookings = await Promise.all(
        bookings.map((booking) => this.enrichBookingWithDetails(booking))
      );

      return enrichedBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  // Get user's bookings
  static async getUserBookings(userId: string): Promise<BookingWithDetails[]> {
    return this.getBookings({ customerId: userId });
  }

  // Get business bookings
  static async getBusinessBookings(
    businessId: string
  ): Promise<BookingWithDetails[]> {
    return this.getBookings({ businessId });
  }

  // Update booking
  static async updateBooking(
    bookingId: string,
    updates: UpdateBookingData
  ): Promise<void> {
    try {
      const bookingRef = doc(db, this.COLLECTION_NAME, bookingId);

      // Validate status transitions
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

      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.cache.delete(bookingId);

      // Send notifications based on status change
      if (updates.status) {
        await this.sendStatusChangeNotification(bookingId, updates.status);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to update booking');
    }
  }

  // Cancel booking
  static async cancelBooking(
    bookingId: string,
    reason?: string
  ): Promise<void> {
    try {
      await this.updateBooking(bookingId, {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }

  // Confirm booking (for business owners)
  static async confirmBooking(bookingId: string): Promise<void> {
    try {
      await this.updateBooking(bookingId, { status: 'confirmed' });
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw new Error('Failed to confirm booking');
    }
  }

  // Complete booking
  static async completeBooking(bookingId: string): Promise<void> {
    try {
      await this.updateBooking(bookingId, { status: 'completed' });
    } catch (error) {
      console.error('Error completing booking:', error);
      throw new Error('Failed to complete booking');
    }
  }

  // Listen to real-time booking updates
  static subscribeToBookings(
    filters: BookingFilters,
    callback: BookingListener
  ): Unsubscribe {
    try {
      const bookingsRef = collection(db, this.COLLECTION_NAME);
      const constraints = [];

      // Apply filters (same as getBookings)
      if (filters.customerId) {
        constraints.push(where('customerId', '==', filters.customerId));
      }

      if (filters.businessId) {
        constraints.push(where('businessId', '==', filters.businessId));
      }

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('scheduledDate', 'desc'));

      const q = query(bookingsRef, ...constraints);

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const bookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          bookings.push(
            formatDocumentData<Booking>({
              id: doc.id,
              ...doc.data(),
            })
          );
        });

        // Enrich with details
        const enrichedBookings = await Promise.all(
          bookings.map((booking) => this.enrichBookingWithDetails(booking))
        );

        callback(enrichedBookings);
      });

      // Store listener for cleanup
      const listenerId = `${filters.customerId || filters.businessId || 'all'}_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up booking listener:', error);
      throw new Error('Failed to set up real-time booking updates');
    }
  }

  // Check for booking conflicts
  private static async checkBookingConflicts(
    businessId: string,
    serviceId: string,
    scheduledDate: Date
  ): Promise<Booking[]> {
    try {
      // Check for bookings within 1 hour window
      const startTime = new Date(scheduledDate.getTime() - 30 * 60 * 1000); // 30 min before
      const endTime = new Date(scheduledDate.getTime() + 30 * 60 * 1000); // 30 min after

      const conflicts = await this.getBookings({
        businessId,
        dateRange: { start: startTime, end: endTime },
      });

      return conflicts.filter(
        (booking) =>
          booking.serviceId === serviceId &&
          ['pending', 'confirmed'].includes(booking.status)
      );
    } catch (error) {
      console.error('Error checking booking conflicts:', error);
      return [];
    }
  }

  // Get service details for pricing
  private static async getServiceDetails(
    businessId: string,
    serviceId: string
  ) {
    // This would typically fetch from the business service
    // For now, return a placeholder
    return { price: 0, duration: 60 };
  }

  // Enrich booking with business and service details
  private static async enrichBookingWithDetails(
    booking: Booking
  ): Promise<BookingWithDetails> {
    try {
      // In a real implementation, you would fetch business and service details
      // For now, return the booking as-is with placeholder data
      return {
        ...booking,
        businessName: 'Business Name', // Would fetch from business service
        serviceName: 'Service Name', // Would fetch from service data
        customerName: 'Customer Name', // Would fetch from user service
        businessAddress: 'Business Address',
        servicePrice: booking.totalAmount,
        serviceDuration: 60, // minutes
      };
    } catch (error) {
      console.error('Error enriching booking details:', error);
      return booking as BookingWithDetails;
    }
  }

  // Validate status transitions
  private static isValidStatusTransition(
    currentStatus: Booking['status'],
    newStatus: Booking['status']
  ): boolean {
    const validTransitions: Record<Booking['status'], Booking['status'][]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [], // No transitions from completed
      cancelled: [], // No transitions from cancelled
    };

    return validTransitions[currentStatus].includes(newStatus);
  }

  // Send notifications (placeholder implementation)
  private static async notifyBusinessOwner(
    businessId: string,
    bookingId: string
  ): Promise<void> {
    // Implement push notification or email notification
    console.log(
      `Notifying business ${businessId} about new booking ${bookingId}`
    );
  }

  private static async sendStatusChangeNotification(
    bookingId: string,
    status: Booking['status']
  ): Promise<void> {
    // Implement status change notifications
    console.log(`Booking ${bookingId} status changed to ${status}`);
  }

  // Cleanup listeners
  static cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
    this.cache.clear();
  }
}
