/**
 * Firestore Collection Helpers
 *
 * Helper functions for creating and validating Firestore documents
 */

import { Timestamp } from 'firebase/firestore';
import {
  User,
  UserInput,
  Business,
  BusinessInput,
  Booking,
  BookingInput,
  Vehicle,
  VehicleInput,
  Review,
  ReviewInput,
} from './collections';

// ============================================================================
// User Helpers
// ============================================================================

export const createUserDocument = (
  id: string,
  input: UserInput
): Omit<User, 'id'> => {
  const now = Timestamp.now();

  return {
    email: input.email,
    displayName: input.displayName,
    phoneNumber: input.phoneNumber,
    photoURL: input.photoURL,
    role: input.role,
    createdAt: now,
    updatedAt: now,
    preferences: {
      notifications: input.preferences?.notifications ?? true,
      language: input.preferences?.language ?? 'en',
    },
  };
};

export const validateUserInput = (input: UserInput): string[] => {
  const errors: string[] = [];

  if (!input.email || !input.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!input.displayName || input.displayName.trim().length < 2) {
    errors.push('Display name must be at least 2 characters');
  }

  if (!input.phoneNumber || input.phoneNumber.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!['customer', 'business_owner'].includes(input.role)) {
    errors.push('Valid role is required');
  }

  return errors;
};

// ============================================================================
// Business Helpers
// ============================================================================

export const createBusinessDocument = (
  id: string,
  input: BusinessInput
): Omit<Business, 'id'> => {
  const now = Timestamp.now();

  return {
    ownerId: input.ownerId,
    name: input.name,
    description: input.description,
    address: input.address,
    location: input.location,
    phone: input.phone,
    email: input.email,
    imageUrl: input.imageUrl,
    images: input.images || [],
    rating: 0,
    reviewCount: 0,
    operatingHours: input.operatingHours,
    services: input.services,
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };
};

export const validateBusinessInput = (input: BusinessInput): string[] => {
  const errors: string[] = [];

  if (!input.ownerId) {
    errors.push('Owner ID is required');
  }

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Business name must be at least 2 characters');
  }

  if (!input.address || input.address.trim().length < 5) {
    errors.push('Valid address is required');
  }

  if (
    !input.location ||
    typeof input.location.latitude !== 'number' ||
    typeof input.location.longitude !== 'number'
  ) {
    errors.push('Valid location coordinates are required');
  }

  if (!input.phone || input.phone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!input.email || !input.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!input.services || input.services.length === 0) {
    errors.push('At least one service is required');
  }

  return errors;
};

// ============================================================================
// Booking Helpers
// ============================================================================

export const createBookingDocument = (
  id: string,
  input: BookingInput
): Omit<Booking, 'id'> => {
  const now = Timestamp.now();
  const scheduledDate =
    input.scheduledDate instanceof Timestamp
      ? input.scheduledDate
      : Timestamp.fromDate(input.scheduledDate);

  return {
    userId: input.userId,
    businessId: input.businessId,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    servicePrice: input.servicePrice,
    vehicleId: input.vehicleId,
    vehicleInfo: input.vehicleInfo,
    scheduledDate,
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount: input.totalAmount,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
};

export const validateBookingInput = (input: BookingInput): string[] => {
  const errors: string[] = [];

  if (!input.userId) {
    errors.push('User ID is required');
  }

  if (!input.businessId) {
    errors.push('Business ID is required');
  }

  if (!input.serviceId) {
    errors.push('Service ID is required');
  }

  if (!input.serviceName || input.serviceName.trim().length < 2) {
    errors.push('Service name is required');
  }

  if (typeof input.servicePrice !== 'number' || input.servicePrice <= 0) {
    errors.push('Valid service price is required');
  }

  if (!input.vehicleId) {
    errors.push('Vehicle ID is required');
  }

  if (
    !input.vehicleInfo ||
    !input.vehicleInfo.make ||
    !input.vehicleInfo.model ||
    !input.vehicleInfo.licensePlate
  ) {
    errors.push('Complete vehicle information is required');
  }

  if (!input.scheduledDate) {
    errors.push('Scheduled date is required');
  }

  if (typeof input.totalAmount !== 'number' || input.totalAmount <= 0) {
    errors.push('Valid total amount is required');
  }

  return errors;
};

// ============================================================================
// Vehicle Helpers
// ============================================================================

export const createVehicleDocument = (
  id: string,
  input: VehicleInput
): Omit<Vehicle, 'id'> => {
  const now = Timestamp.now();

  return {
    userId: input.userId,
    year: input.year,
    make: input.make,
    model: input.model,
    licensePlate: input.licensePlate.toUpperCase(),
    color: input.color,
    createdAt: now,
  };
};

export const validateVehicleInput = (input: VehicleInput): string[] => {
  const errors: string[] = [];

  if (!input.userId) {
    errors.push('User ID is required');
  }

  if (!input.year || input.year.trim().length !== 4) {
    errors.push('Valid year is required (4 digits)');
  }

  if (!input.make || input.make.trim().length < 2) {
    errors.push('Vehicle make is required');
  }

  if (!input.model || input.model.trim().length < 1) {
    errors.push('Vehicle model is required');
  }

  if (!input.licensePlate || input.licensePlate.trim().length < 3) {
    errors.push('Valid license plate is required');
  }

  return errors;
};

// ============================================================================
// Review Helpers
// ============================================================================

export const createReviewDocument = (
  id: string,
  input: ReviewInput
): Omit<Review, 'id'> => {
  const now = Timestamp.now();

  return {
    businessId: input.businessId,
    userId: input.userId,
    bookingId: input.bookingId,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))), // Ensure 1-5 range
    comment: input.comment.trim(),
    createdAt: now,
    flagged: false,
  };
};

export const validateReviewInput = (input: ReviewInput): string[] => {
  const errors: string[] = [];

  if (!input.businessId) {
    errors.push('Business ID is required');
  }

  if (!input.userId) {
    errors.push('User ID is required');
  }

  if (!input.bookingId) {
    errors.push('Booking ID is required');
  }

  if (
    typeof input.rating !== 'number' ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!input.comment || input.comment.trim().length < 10) {
    errors.push('Review comment must be at least 10 characters');
  }

  if (input.comment && input.comment.length > 1000) {
    errors.push('Review comment must not exceed 1000 characters');
  }

  return errors;
};
