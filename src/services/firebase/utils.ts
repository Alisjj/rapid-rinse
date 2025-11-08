import { Timestamp } from 'firebase/firestore';

/**
 * Utility functions for Firebase operations
 */

// Convert Firestore Timestamp to Date
export const timestampToDate = (
  timestamp: Timestamp | null | undefined
): Date => {
  if (!timestamp) {
    return new Date();
  }
  return timestamp.toDate();
};

// Convert Date to Firestore Timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Format Firestore document data
export const formatDocumentData = <T>(data: any): T => {
  const formatted = { ...data };

  // Convert Timestamp fields to Date objects
  Object.keys(formatted).forEach((key) => {
    if (formatted[key] instanceof Timestamp) {
      formatted[key] = formatted[key].toDate();
    }
  });

  return formatted as T;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
};

// Generate user initials from full name
export const getUserInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Format phone number
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber;
};
