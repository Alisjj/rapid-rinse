/**
 * Firestore Collections Structure
 *
 * This file defines the TypeScript types and interfaces for all Firestore collections
 * in the RapidRinse application.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// User Collection
// ============================================================================

export type UserRole = 'customer' | 'business_owner';

export interface UserPreferences {
  notifications: boolean;
  language: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  pushToken?: string;
  preferences: UserPreferences;
}

export interface UserInput {
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL?: string;
  role: UserRole;
  preferences?: Partial<UserPreferences>;
}

// ============================================================================
// Business Collection
// ============================================================================

export interface OperatingHours {
  [day: string]: {
    isOpen: boolean;
    open: string;
    close: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageUrl?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  location: GeoPoint;
  phone: string;
  email: string;
  imageUrl?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  operatingHours: OperatingHours;
  services: Service[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BusinessInput {
  ownerId: string;
  name: string;
  description: string;
  address: string;
  location: GeoPoint;
  phone: string;
  email: string;
  imageUrl?: string;
  images?: string[];
  operatingHours: OperatingHours;
  services: Service[];
  isActive?: boolean;
}

// ============================================================================
// Booking Collection
// ============================================================================

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  licensePlate: string;
}

export interface Booking {
  id: string;
  userId: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  vehicleId: string;
  vehicleInfo: VehicleInfo;
  scheduledDate: Timestamp;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  totalAmount: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancelledAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface BookingInput {
  userId: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  vehicleId: string;
  vehicleInfo: VehicleInfo;
  scheduledDate: Date | Timestamp;
  totalAmount: number;
  notes?: string;
}

// ============================================================================
// Vehicle Collection
// ============================================================================

export interface Vehicle {
  id: string;
  userId: string;
  year: string;
  make: string;
  model: string;
  licensePlate: string;
  color?: string;
  createdAt: Timestamp;
}

export interface VehicleInput {
  userId: string;
  year: string;
  make: string;
  model: string;
  licensePlate: string;
  color?: string;
}

// ============================================================================
// Review Collection
// ============================================================================

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
  flagged: boolean;
}

export interface ReviewInput {
  businessId: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
}

// ============================================================================
// Collection Names
// ============================================================================

export const COLLECTIONS = {
  USERS: 'users',
  BUSINESSES: 'businesses',
  BOOKINGS: 'bookings',
  VEHICLES: 'vehicles',
  REVIEWS: 'reviews',
} as const;

// ============================================================================
// Helper Types
// ============================================================================

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// Type guards
export const isValidUserRole = (role: string): role is UserRole => {
  return role === 'customer' || role === 'business_owner';
};

export const isValidBookingStatus = (
  status: string
): status is BookingStatus => {
  return [
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
  ].includes(status);
};

export const isValidPaymentStatus = (
  status: string
): status is PaymentStatus => {
  return ['pending', 'paid', 'refunded'].includes(status);
};
