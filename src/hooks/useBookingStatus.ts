import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BookingService,
  BookingWithDetails,
} from '../services/firebase/bookingService';
import { Booking } from '../types';
import { Unsubscribe } from 'firebase/firestore';

interface BookingStatusUpdate {
  bookingId: string;
  previousStatus: Booking['status'];
  newStatus: Booking['status'];
  timestamp: Date;
}

interface UseBookingStatusReturn {
  // State
  booking: BookingWithDetails | null;
  loading: boolean;
  error: string | null;

  // Status tracking
  statusHistory: BookingStatusUpdate[];
  isRealTimeEnabled: boolean;

  // Actions
  loadBooking: (bookingId: string) => Promise<void>;
  refreshBooking: () => Promise<void>;
  updateStatus: (newStatus: Booking['status']) => Promise<void>;

  // Real-time updates
  enableRealTimeUpdates: (bookingId: string) => void;
  disableRealTimeUpdates: () => void;

  // Status checks
  canTransitionTo: (status: Booking['status']) => boolean;
  getValidTransitions: () => Booking['status'][];
  isStatusFinal: () => boolean;

  // Utilities
  clearError: () => void;
  getStatusDisplayName: (status: Booking['status']) => string;
  getStatusColor: (status: Booking['status']) => string;
}

/**
 * Booking status hook for real-time booking updates
 * Provides real-time status monitoring and status management
 */
export const useBookingStatus = (
  initialBookingId?: string
): UseBookingStatusReturn => {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<BookingStatusUpdate[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  // Refs for real-time subscription and current booking ID
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const currentBookingIdRef = useRef<string | null>(initialBookingId || null);

  // Status transition rules
  const statusTransitions: Record<Booking['status'], Booking['status'][]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  // Status display names
  const statusDisplayNames: Record<Booking['status'], string> = {
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  // Status colors
  const statusColors: Record<Booking['status'], string> = {
    pending: '#FFA500', // Orange
    confirmed: '#4CAF50', // Green
    completed: '#2196F3', // Blue
    cancelled: '#F44336', // Red
  };

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load booking by ID
  const loadBooking = useCallback(
    async (bookingId: string) => {
      try {
        setLoading(true);
        setError(null);
        currentBookingIdRef.current = bookingId;

        const bookingData = await BookingService.getBookingById(bookingId);

        if (bookingData) {
          // Track status change if booking was already loaded
          if (booking && booking.status !== bookingData.status) {
            const statusUpdate: BookingStatusUpdate = {
              bookingId,
              previousStatus: booking.status,
              newStatus: bookingData.status,
              timestamp: new Date(),
            };
            setStatusHistory((prev) => [...prev, statusUpdate]);
          }

          setBooking(bookingData);
        } else {
          setError('Booking not found');
          setBooking(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load booking';
        setError(errorMessage);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    },
    [booking]
  );

  // Refresh current booking
  const refreshBooking = useCallback(async () => {
    if (!currentBookingIdRef.current) {
      setError('No booking ID available');
      return;
    }

    await loadBooking(currentBookingIdRef.current);
  }, [loadBooking]);

  // Update booking status
  const updateStatus = useCallback(
    async (newStatus: Booking['status']) => {
      if (!booking) {
        setError('No booking loaded');
        return;
      }

      if (!canTransitionTo(newStatus)) {
        setError(`Cannot transition from ${booking.status} to ${newStatus}`);
        return;
      }

      try {
        setError(null);

        await BookingService.updateBooking(booking.id, { status: newStatus });

        // Track status change
        const statusUpdate: BookingStatusUpdate = {
          bookingId: booking.id,
          previousStatus: booking.status,
          newStatus,
          timestamp: new Date(),
        };
        setStatusHistory((prev) => [...prev, statusUpdate]);

        // Update local booking state
        setBooking((prev) =>
          prev ? { ...prev, status: newStatus, updatedAt: new Date() } : null
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to update booking status';
        setError(errorMessage);
        throw err;
      }
    },
    [booking]
  );

  // Enable real-time updates for a booking
  const enableRealTimeUpdates = useCallback(
    (bookingId: string) => {
      try {
        // Disable existing subscription
        disableRealTimeUpdates();

        currentBookingIdRef.current = bookingId;

        // Subscribe to booking updates
        const unsubscribe = BookingService.subscribeToBookings(
          { customerId: 'dummy' }, // This would need to be adjusted based on BookingService API
          (updatedBookings) => {
            const updatedBooking = updatedBookings.find(
              (b) => b.id === bookingId
            );
            if (updatedBooking) {
              // Track status change if status changed
              if (booking && booking.status !== updatedBooking.status) {
                const statusUpdate: BookingStatusUpdate = {
                  bookingId,
                  previousStatus: booking.status,
                  newStatus: updatedBooking.status,
                  timestamp: new Date(),
                };
                setStatusHistory((prev) => [...prev, statusUpdate]);
              }

              setBooking(updatedBooking);
            }
          }
        );

        unsubscribeRef.current = unsubscribe;
        setIsRealTimeEnabled(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to enable real-time updates';
        setError(errorMessage);
      }
    },
    [booking]
  );

  // Disable real-time updates
  const disableRealTimeUpdates = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsRealTimeEnabled(false);
  }, []);

  // Check if can transition to a specific status
  const canTransitionTo = useCallback(
    (status: Booking['status']): boolean => {
      if (!booking) return false;
      return statusTransitions[booking.status].includes(status);
    },
    [booking]
  );

  // Get valid status transitions
  const getValidTransitions = useCallback((): Booking['status'][] => {
    if (!booking) return [];
    return statusTransitions[booking.status];
  }, [booking]);

  // Check if current status is final
  const isStatusFinal = useCallback((): boolean => {
    if (!booking) return false;
    return ['completed', 'cancelled'].includes(booking.status);
  }, [booking]);

  // Get status display name
  const getStatusDisplayName = useCallback(
    (status: Booking['status']): string => {
      return statusDisplayNames[status];
    },
    []
  );

  // Get status color
  const getStatusColor = useCallback((status: Booking['status']): string => {
    return statusColors[status];
  }, []);

  // Load initial booking if provided
  useEffect(() => {
    if (initialBookingId) {
      loadBooking(initialBookingId);
    }
  }, [initialBookingId, loadBooking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableRealTimeUpdates();
    };
  }, [disableRealTimeUpdates]);

  return {
    // State
    booking,
    loading,
    error,

    // Status tracking
    statusHistory,
    isRealTimeEnabled,

    // Actions
    loadBooking,
    refreshBooking,
    updateStatus,

    // Real-time updates
    enableRealTimeUpdates,
    disableRealTimeUpdates,

    // Status checks
    canTransitionTo,
    getValidTransitions,
    isStatusFinal,

    // Utilities
    clearError,
    getStatusDisplayName,
    getStatusColor,
  };
};
