// Firebase configuration and services
export { app, auth, db, storage, firebaseConfig } from './config';

// Authentication service
export { AuthService } from './authService';
export type { UserProfile, AuthServiceError } from './authService';

// Authentication context and hooks
export { AuthProvider, useAuth } from './authContext';

// Business service
export { BusinessService } from './businessService';
export type {
  BusinessWithLocation,
  BusinessSearchFilters,
} from './businessService';

// Booking service
export { BookingService } from './bookingService';
export type {
  BookingWithDetails,
  CreateBookingData,
  UpdateBookingData,
  BookingFilters,
  VehicleInfo,
} from './bookingService';

// Vehicle service
export { VehicleService } from './vehicleService';
export type {
  Vehicle as VehicleDocument,
  CreateVehicleData,
} from './vehicleService';

// User service
export { UserService } from './userService';
export type { Vehicle, UserPreferences, FavoriteBusiness } from './userService';

// Firestore service (comprehensive service layer)
export { FirestoreService } from './firestoreService';
export type {
  BusinessFilters,
  PaginationOptions,
  ReviewFilters,
  BusinessListener,
  BookingListener,
} from './firestoreService';

// Business context
export { BusinessProvider, useBusinessContext } from './businessContext';
export type { BusinessContextValue } from './businessContext';

// Firebase utilities
export * from './utils';

// Firestore collections and types
export * from './collections';
export * from './collectionHelpers';
