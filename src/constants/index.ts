// App configuration constants
export const APP_CONFIG = {
  NAME: 'Rapid Rinse',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
  PAGINATION_LIMIT: 20,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  BUSINESSES: {
    LIST: '/businesses',
    DETAIL: '/businesses/:id',
    SERVICES: '/businesses/:id/services',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAIL: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@rapid_rinse_auth_token',
  USER_DATA: '@rapid_rinse_user_data',
  ONBOARDING_COMPLETED: '@rapid_rinse_onboarding',
} as const;

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
} as const;

// Business categories
export const BUSINESS_CATEGORIES = [
  'Car Wash',
  'Laundry',
  'Dry Cleaning',
  'Detailing',
  'Mobile Service',
] as const;

// Booking status options
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Theme colors (will be expanded in theme configuration)
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#F2F2F7',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#8E8E93',
} as const;
