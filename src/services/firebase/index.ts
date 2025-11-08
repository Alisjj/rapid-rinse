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
} from './bookingService';

// User service
export { UserService } from './userService';
export type { Vehicle, UserPreferences, FavoriteBusiness } from './userService';

// Firebase utilities
export * from './utils';
