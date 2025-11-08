import { useState, useCallback } from 'react';
import {
  BookingService,
  CreateBookingData,
} from '../services/firebase/bookingService';
import { BusinessService } from '../services/firebase/businessService';

interface BookingCreationStep {
  step: 'business' | 'service' | 'datetime' | 'details' | 'confirmation';
  data: Partial<CreateBookingData>;
  isValid: boolean;
}

interface UseBookingCreationReturn {
  // State
  currentStep: BookingCreationStep['step'];
  bookingData: Partial<CreateBookingData>;
  loading: boolean;
  creating: boolean;
  error: string | null;

  // Validation
  isStepValid: (step: BookingCreationStep['step']) => boolean;
  canProceedToNext: boolean;
  canGoBack: boolean;

  // Navigation
  goToStep: (step: BookingCreationStep['step']) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Data management
  updateBookingData: (data: Partial<CreateBookingData>) => void;
  setBusinessId: (businessId: string) => void;
  setServiceId: (serviceId: string) => void;
  setScheduledDate: (date: Date) => void;
  setNotes: (notes: string) => void;

  // Actions
  createBooking: () => Promise<string>;
  resetBookingFlow: () => void;

  // Utilities
  clearError: () => void;
  getEstimatedPrice: () => Promise<number | null>;
  checkAvailability: (date: Date) => Promise<boolean>;
}

/**
 * Booking creation hook for new booking flow
 * Provides step-by-step booking creation with validation and state management
 */
export const useBookingCreation = (
  customerId: string
): UseBookingCreationReturn => {
  const [currentStep, setCurrentStep] =
    useState<BookingCreationStep['step']>('business');
  const [bookingData, setBookingData] = useState<Partial<CreateBookingData>>({
    customerId,
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step order for navigation
  const stepOrder: BookingCreationStep['step'][] = [
    'business',
    'service',
    'datetime',
    'details',
    'confirmation',
  ];

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Validate individual steps
  const isStepValid = useCallback(
    (step: BookingCreationStep['step']): boolean => {
      switch (step) {
        case 'business':
          return !!bookingData.businessId;
        case 'service':
          return !!bookingData.serviceId;
        case 'datetime':
          return (
            !!bookingData.scheduledDate &&
            bookingData.scheduledDate > new Date()
          );
        case 'details':
          return true; // Notes are optional
        case 'confirmation':
          return !!(
            bookingData.customerId &&
            bookingData.businessId &&
            bookingData.serviceId &&
            bookingData.scheduledDate
          );
        default:
          return false;
      }
    },
    [bookingData]
  );

  // Check if can proceed to next step
  const canProceedToNext = isStepValid(currentStep);

  // Check if can go back
  const canGoBack = stepOrder.indexOf(currentStep) > 0;

  // Navigate to specific step
  const goToStep = useCallback((step: BookingCreationStep['step']) => {
    setCurrentStep(step);
    setError(null);
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1 && canProceedToNext) {
      setCurrentStep(stepOrder[currentIndex + 1]);
      setError(null);
    }
  }, [currentStep, canProceedToNext]);

  // Go to previous step
  const previousStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      setError(null);
    }
  }, [currentStep]);

  // Update booking data
  const updateBookingData = useCallback((data: Partial<CreateBookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
    setError(null);
  }, []);

  // Set business ID
  const setBusinessId = useCallback(
    (businessId: string) => {
      updateBookingData({ businessId });
      // Reset service when business changes
      if (bookingData.serviceId) {
        updateBookingData({ serviceId: undefined });
      }
    },
    [updateBookingData, bookingData.serviceId]
  );

  // Set service ID
  const setServiceId = useCallback(
    (serviceId: string) => {
      updateBookingData({ serviceId });
    },
    [updateBookingData]
  );

  // Set scheduled date
  const setScheduledDate = useCallback(
    (date: Date) => {
      updateBookingData({ scheduledDate: date });
    },
    [updateBookingData]
  );

  // Set notes
  const setNotes = useCallback(
    (notes: string) => {
      updateBookingData({ notes });
    },
    [updateBookingData]
  );

  // Get estimated price
  const getEstimatedPrice = useCallback(async (): Promise<number | null> => {
    if (!bookingData.businessId || !bookingData.serviceId) {
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const services = await BusinessService.getBusinessServices(
        bookingData.businessId
      );
      const service = services.find((s) => s.id === bookingData.serviceId);

      return service?.price || null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get price estimate';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [bookingData.businessId, bookingData.serviceId]);

  // Check availability for selected date/time
  const checkAvailability = useCallback(
    async (date: Date): Promise<boolean> => {
      if (!bookingData.businessId || !bookingData.serviceId) {
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        // This would typically check against existing bookings
        // For now, we'll do a simple check that the date is in the future
        const isInFuture = date > new Date();

        // Add business hours check here if needed
        const isBusinessHours = true; // Placeholder

        return isInFuture && isBusinessHours;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to check availability';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [bookingData.businessId, bookingData.serviceId]
  );

  // Create booking
  const createBooking = useCallback(async (): Promise<string> => {
    if (!isStepValid('confirmation')) {
      throw new Error('Booking data is incomplete');
    }

    try {
      setCreating(true);
      setError(null);

      const bookingId = await BookingService.createBooking(
        bookingData as CreateBookingData
      );

      // Reset the flow after successful creation
      resetBookingFlow();

      return bookingId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  }, [bookingData, isStepValid]);

  // Reset booking flow
  const resetBookingFlow = useCallback(() => {
    setCurrentStep('business');
    setBookingData({ customerId });
    setError(null);
    setLoading(false);
    setCreating(false);
  }, [customerId]);

  return {
    // State
    currentStep,
    bookingData,
    loading,
    creating,
    error,

    // Validation
    isStepValid,
    canProceedToNext,
    canGoBack,

    // Navigation
    goToStep,
    nextStep,
    previousStep,

    // Data management
    updateBookingData,
    setBusinessId,
    setServiceId,
    setScheduledDate,
    setNotes,

    // Actions
    createBooking,
    resetBookingFlow,

    // Utilities
    clearError,
    getEstimatedPrice,
    checkAvailability,
  };
};
