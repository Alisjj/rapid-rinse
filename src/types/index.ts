// Core application types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'business_owner';
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  services: Service[];
  operatingHours: OperatingHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface Booking {
  id: string;
  customerId: string;
  businessId: string;
  serviceId: string;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  BookingDetails: { bookingId: string };
  BusinessDetails: { businessId: string };
  ServiceBooking: { serviceId: string; businessId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Vehicles: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  BusinessDetails: { businessId: string };
  ServiceBooking: { serviceId: string; businessId: string };
  SearchResults: { query: string };
};

export type BookingStackParamList = {
  BookingsList: undefined;
  BookingDetails: { bookingId: string };
  BookService: { businessId: string; serviceId?: string };
  BookingConfirmation: { bookingId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  VehiclesList: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: { query: string };
  BusinessDetails: { businessId: string };
  NearbyBusinesses: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
// Theme-related types
export interface ThemeMode {
  isDark: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
}

export interface StyleProps {
  style?: any;
  testID?: string;
}

// Component variant types for consistent theming
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type CardVariant = 'default' | 'elevated' | 'outlined';
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodyLarge'
  | 'caption'
  | 'button';
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'gray';
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
