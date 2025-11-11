import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BookingService,
  BookingWithDetails,
  BookingFilters,
} from '../services/firebase/bookingService';
import { Booking } from '../types';
import { Unsubscribe } from 'firebase/firestore';

interface UseBookingsReturn {
  // State
  bookings: BookingWithDetails[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // Actions
  loadBookings: (filters?: BookingFilters) => Promise<void>;
  refreshBookings: () => Promise<void>;
  getBookingById: (bookingId: string) => Promise<BookingWithDetails | null>;
  updateBookingStatus: (
    bookingId: string,
    status: Booking['status']
  ) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  confirmBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;

  // Real-time updates
  subscribeToUpdates: (filters: BookingFilters) => void;
  unsubscribeFromUpdates: () => void;

  // Utilities
  clearError: () => void;
  getBookingsByStatus: (status: Booking['status']) => BookingWithDetails[];
  getUpcomingBookings: () => BookingWithDetails[];
  getPastBookings: () => BookingWithDetails[];
}

/**
 * Booking management hook for user booking history and management
 * Provides comprehensive booking operations with real-time updates
 */
export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for real-time subscriptions and current filters
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const currentFiltersRef = useRef<BookingFilters | undefined>(undefined);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load bookings with filters
  const loadBookings = useCallback(async (filters?: BookingFilters) => {
    try {
      console.log('Loading bookings with filters:', filters);
      setLoading(true);
      setError(null);
      currentFiltersRef.current = filters;

      const bookingsData = await BookingService.getBookings(filters);
      console.log('Loaded bookings:', bookingsData.length, 'bookings');
      setBookings(bookingsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load bookings';
      console.error('Error loading bookings:', errorMessage, err);
      setError(errorMessage);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh bookings
  const refreshBookings = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const bookingsData = await BookingService.getBookings(
        currentFiltersRef.current
      );
      setBookings(bookingsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh bookings';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Get booking by ID
  const getBookingById = useCallback(
    async (bookingId: string): Promise<BookingWithDetails | null> => {
      try {
        setError(null);

        // Check if booking is already in local state
        const existingBooking = bookings.find(b => b.id === bookingId);
        if (existingBooking) {
          return existingBooking;
        }

        // Fetch from service
        const booking = await BookingService.getBookingById(bookingId);

        if (booking) {
          // Update local state if booking is found
          setBookings(prev => {
            const index = prev.findIndex(b => b.id === bookingId);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = booking;
              return updated;
            } else {
              return [...prev, booking];
            }
          });
        }

        return booking;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch booking details';
        setError(errorMessage);
        return null;
      }
    },
    [bookings]
  );

  // Update booking status
  const updateBookingStatus = useCallback(
    async (bookingId: string, status: Booking['status']) => {
      try {
        setError(null);

        await BookingService.updateBooking(bookingId, { status });

        // Update local state optimistically
        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? { ...booking, status, updatedAt: new Date() }
              : booking
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to update booking status';
        setError(errorMessage);

        // Refresh bookings to get correct state
        await refreshBookings();
        throw err;
      }
    },
    [refreshBookings]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      try {
        setError(null);

        await BookingService.cancelBooking(bookingId, reason);

        // Update local state optimistically
        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: 'cancelled' as const,
                  notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user',
                  updatedAt: new Date(),
                }
              : booking
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to cancel booking';
        setError(errorMessage);

        // Refresh bookings to get correct state
        await refreshBookings();
        throw err;
      }
    },
    [refreshBookings]
  );

  // Confirm booking
  const confirmBooking = useCallback(
    async (bookingId: string) => {
      try {
        setError(null);

        await BookingService.confirmBooking(bookingId);

        // Update local state optimistically
        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: 'confirmed' as const,
                  updatedAt: new Date(),
                }
              : booking
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to confirm booking';
        setError(errorMessage);

        // Refresh bookings to get correct state
        await refreshBookings();
        throw err;
      }
    },
    [refreshBookings]
  );

  // Complete booking
  const completeBooking = useCallback(
    async (bookingId: string) => {
      try {
        setError(null);

        await BookingService.completeBooking(bookingId);

        // Update local state optimistically
        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: 'completed' as const,
                  updatedAt: new Date(),
                }
              : booking
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to complete booking';
        setError(errorMessage);

        // Refresh bookings to get correct state
        await refreshBookings();
        throw err;
      }
    },
    [refreshBookings]
  );

  // Subscribe to real-time updates
  const subscribeToUpdates = useCallback((filters: BookingFilters) => {
    try {
      // Unsubscribe from previous listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      currentFiltersRef.current = filters;

      const unsubscribe = BookingService.subscribeToBookings(
        filters,
        updatedBookings => {
          setBookings(updatedBookings);
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to subscribe to booking updates';
      setError(errorMessage);
    }
  }, []);

  // Unsubscribe from real-time updates
  const unsubscribeFromUpdates = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // Get bookings by status
  const getBookingsByStatus = useCallback(
    (status: Booking['status']): BookingWithDetails[] => {
      return bookings.filter(booking => booking.status === status);
    },
    [bookings]
  );

  // Get upcoming bookings
  const getUpcomingBookings = useCallback((): BookingWithDetails[] => {
    const now = new Date();
    return bookings
      .filter(
        booking =>
          booking.scheduledDate > now &&
          ['pending', 'confirmed'].includes(booking.status)
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }, [bookings]);

  // Get past bookings
  const getPastBookings = useCallback((): BookingWithDetails[] => {
    const now = new Date();
    return bookings
      .filter(
        booking =>
          booking.scheduledDate <= now ||
          ['completed', 'cancelled'].includes(booking.status)
      )
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  }, [bookings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromUpdates();
    };
  }, [unsubscribeFromUpdates]);

  return {
    // State
    bookings,
    loading,
    refreshing,
    error,

    // Actions
    loadBookings,
    refreshBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    confirmBooking,
    completeBooking,

    // Real-time updates
    subscribeToUpdates,
    unsubscribeFromUpdates,

    // Utilities
    clearError,
    getBookingsByStatus,
    getUpcomingBookings,
    getPastBookings,
  };
};
