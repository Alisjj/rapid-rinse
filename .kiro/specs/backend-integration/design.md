# Backend Integration Design Document

## Overview

This design document outlines the architecture and implementation strategy for transforming the RapidRinse application from a prototype with mock data into a production-ready system with Firebase backend, Paystack payment integration, and real-time data synchronization.

### Technology Stack

**Backend & Database:**

- Firebase Authentication (user auth)
- Firebase Firestore (NoSQL database)
- Firebase Storage (image hosting)
- Firebase Cloud Functions (serverless backend logic)

**Payment Processing:**

- Paystack (Nigerian payment gateway)

**Notifications:**

- Expo Notifications (push notifications)
- Firebase Cloud Messaging (notification delivery)

**Maps & Location:**

- Expo Location (GPS access)
- Google Maps API (directions)

**State Management:**

- React Context API (existing)
- Firebase real-time listeners

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│                   (React Native + Expo)                      │
├─────────────────────────────────────────────────────────────┤
│  Authentication │  Booking Flow  │  Profile  │  Payments    │
└────────┬────────┴────────┬───────┴─────┬─────┴──────┬───────┘
         │                 │             │            │
         ▼                 ▼             ▼            ▼
┌────────────────────────────────────────────────────────────┐
│                    Firebase Services                        │
├─────────────┬──────────────┬──────────────┬────────────────┤
│    Auth     │  Firestore   │   Storage    │ Cloud Functions│
└─────────────┴──────────────┴──────────────┴────────────────┘
         │                 │             │            │
         └─────────────────┴─────────────┴────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │    Paystack    │
                  │  Payment API   │
                  └────────────────┘
```

### Data Flow

1. **User Authentication Flow:**
   - User enters credentials → Firebase Auth validates → Returns JWT token
   - Token stored in secure storage → Used for all API requests
   - Token refresh handled automatically by Firebase SDK

2. **Booking Creation Flow:**
   - User selects service → Check availability in Firestore
   - Create booking document → Trigger Cloud Function
   - Cloud Function sends notifications → Update UI with confirmation

3. **Payment Flow:**
   - User initiates payment → Call Paystack API
   - Paystack processes payment → Webhook to Cloud Function
   - Cloud Function updates booking status → Send receipt notification

## Components and Interfaces

### 1. Firebase Service Layer

**Location:** `src/services/firebase/`

#### firebaseConfig.ts

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const initializeFirebase: () => void;
```

#### authService.ts

```typescript
interface AuthService {
  signUp(email: string, password: string, userData: UserData): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
```

#### firestoreService.ts

```typescript
interface FirestoreService {
  // Business operations
  getBusinesses(location: GeoPoint, radius: number): Promise<Business[]>;
  getBusinessById(id: string): Promise<Business>;
  searchBusinesses(query: string): Promise<Business[]>;

  // Booking operations
  createBooking(booking: BookingInput): Promise<Booking>;
  getBookings(userId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<void>;
  cancelBooking(id: string): Promise<void>;

  // User operations
  getUserProfile(userId: string): Promise<UserProfile>;
  updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void>;

  // Vehicle operations
  addVehicle(userId: string, vehicle: Vehicle): Promise<Vehicle>;
  getVehicles(userId: string): Promise<Vehicle[]>;
  deleteVehicle(vehicleId: string): Promise<void>;

  // Review operations
  addReview(businessId: string, review: Review): Promise<void>;
  getReviews(businessId: string): Promise<Review[]>;
}
```

#### storageService.ts

```typescript
interface StorageService {
  uploadImage(uri: string, path: string): Promise<string>;
  deleteImage(url: string): Promise<void>;
  getImageUrl(path: string): Promise<string>;
}
```

### 2. Payment Service

**Location:** `src/services/payment/`

#### paystackService.ts

```typescript
interface PaystackService {
  initializePayment(
    amount: number,
    email: string,
    reference: string
  ): Promise<PaymentResponse>;
  verifyPayment(reference: string): Promise<PaymentVerification>;
  processRefund(transactionId: string, amount: number): Promise<RefundResponse>;
}

interface PaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaymentVerification {
  status: 'success' | 'failed';
  amount: number;
  reference: string;
  transaction: string;
}
```

### 3. Notification Service

**Location:** `src/services/notifications/`

#### notificationService.ts

```typescript
interface NotificationService {
  requestPermissions(): Promise<boolean>;
  registerForPushNotifications(): Promise<string>; // Returns push token
  sendLocalNotification(title: string, body: string): Promise<void>;
  scheduleNotification(
    title: string,
    body: string,
    trigger: Date
  ): Promise<string>;
  cancelNotification(id: string): Promise<void>;
}
```

### 4. Location Service

**Location:** `src/services/location/`

#### locationService.ts

```typescript
interface LocationService {
  requestPermissions(): Promise<boolean>;
  getCurrentLocation(): Promise<Location>;
  calculateDistance(from: Location, to: Location): number;
  openMapsApp(address: string): Promise<void>;
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
```

### 5. Context Providers

#### AuthContext

```typescript
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: UserData
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

#### BookingContext

```typescript
interface BookingContextValue {
  bookings: Booking[];
  loading: boolean;
  createBooking: (booking: BookingInput) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}
```

#### BusinessContext

```typescript
interface BusinessContextValue {
  businesses: Business[];
  loading: boolean;
  searchBusinesses: (query: string) => Promise<void>;
  getBusinessById: (id: string) => Promise<Business>;
  refreshBusinesses: () => Promise<void>;
}
```

## Data Models

### Firestore Collections Structure

#### users

```typescript
{
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL?: string;
  role: 'customer' | 'business_owner';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  pushToken?: string;
  preferences: {
    notifications: boolean;
    language: string;
  };
}
```

#### businesses

```typescript
{
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  location: GeoPoint; // For geoqueries
  phone: string;
  email: string;
  imageUrl?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  operatingHours: {
    [day: string]: {
      isOpen: boolean;
      open: string;
      close: string;
    };
  };
  services: Service[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### bookings

```typescript
{
  id: string;
  userId: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  vehicleId: string;
  vehicleInfo: {
    year: string;
    make: string;
    model: string;
    licensePlate: string;
  };
  scheduledDate: Timestamp;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentReference?: string;
  totalAmount: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancelledAt?: Timestamp;
  completedAt?: Timestamp;
}
```

#### vehicles

```typescript
{
  id: string;
  userId: string;
  year: string;
  make: string;
  model: string;
  licensePlate: string;
  color?: string;
  createdAt: Timestamp;
}
```

#### reviews

```typescript
{
  id: string;
  businessId: string;
  userId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
  flagged: boolean;
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }

    // Businesses collection
    match /businesses/{businessId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
        (resource.data.ownerId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() &&
        (resource.data.userId == request.auth.uid ||
         resource.data.businessId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.businesses);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() &&
        (resource.data.userId == request.auth.uid ||
         resource.data.businessId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.businesses);
      allow delete: if isOwner(resource.data.userId);
    }

    // Vehicles collection
    match /vehicles/{vehicleId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

## Cloud Functions

### Booking Notifications

```typescript
// Trigger: onCreate in bookings collection
export const onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();

    // Send notification to business owner
    await sendPushNotification(
      booking.businessOwnerId,
      'New Booking',
      `New booking for ${booking.serviceName}`
    );

    // Send confirmation to customer
    await sendPushNotification(
      booking.userId,
      'Booking Confirmed',
      `Your booking is confirmed for ${booking.scheduledDate}`
    );
  });
```

### Payment Webhook

```typescript
// HTTP endpoint for Paystack webhook
export const paystackWebhook = functions.https.onRequest(async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;

    // Update booking payment status
    await admin
      .firestore()
      .collection('bookings')
      .where('paymentReference', '==', reference)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.update({ paymentStatus: 'paid' });
        });
      });
  }

  res.status(200).send('OK');
});
```

### Scheduled Reminders

```typescript
// Scheduled function: runs every hour
export const sendBookingReminders = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async context => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await admin
      .firestore()
      .collection('bookings')
      .where('scheduledDate', '>=', tomorrow)
      .where('scheduledDate', '<', new Date(tomorrow.getTime() + 3600000))
      .where('status', '==', 'confirmed')
      .get();

    bookings.forEach(async doc => {
      const booking = doc.data();
      await sendPushNotification(
        booking.userId,
        'Booking Reminder',
        `Your booking is tomorrow at ${booking.scheduledDate}`
      );
    });
  });
```

## Error Handling

### Error Types

```typescript
enum ErrorCode {
  AUTH_FAILED = 'AUTH_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  BOOKING_UNAVAILABLE = 'BOOKING_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

class AppError extends Error {
  code: ErrorCode;
  userMessage: string;

  constructor(code: ErrorCode, message: string, userMessage: string) {
    super(message);
    this.code = code;
    this.userMessage = userMessage;
  }
}
```

### Error Handling Strategy

- Network errors: Retry with exponential backoff (3 attempts)
- Auth errors: Clear session and redirect to login
- Payment errors: Allow retry, show clear error messages
- Validation errors: Show inline form errors
- Server errors: Show generic error message, log to Firebase Crashlytics

## Testing Strategy

### Unit Tests

- Service layer functions (Firebase, Paystack)
- Utility functions (date formatting, validation)
- Context providers state management

### Integration Tests

- Authentication flow (sign up, sign in, sign out)
- Booking creation and management
- Payment processing
- Notification delivery

### End-to-End Tests

- Complete booking flow from search to payment
- User registration and profile management
- Business listing and search

### Testing Tools

- Jest (unit tests)
- React Native Testing Library (component tests)
- Detox (E2E tests)
- Firebase Emulator Suite (local testing)

## Performance Optimization

### Data Caching

- Cache business listings for 5 minutes
- Cache user profile data
- Use Firestore offline persistence
- Implement image caching with expo-image

### Query Optimization

- Use Firestore composite indexes for complex queries
- Implement pagination for large lists (20 items per page)
- Use geohashing for location-based queries
- Limit real-time listeners to active screens only

### Image Optimization

- Compress images before upload (max 1MB)
- Generate thumbnails using Cloud Functions
- Use progressive image loading
- Implement lazy loading for image galleries

## Security Measures

### Authentication Security

- Enforce strong password requirements (min 8 chars, uppercase, number)
- Implement rate limiting on auth endpoints
- Use Firebase App Check to prevent abuse
- Enable multi-factor authentication (optional)

### Data Security

- Encrypt sensitive data at rest
- Use HTTPS for all network requests
- Implement proper Firestore security rules
- Sanitize user inputs to prevent injection attacks

### Payment Security

- Never store card details in the app
- Use Paystack's secure payment page
- Verify webhook signatures
- Implement transaction logging for audit trail

## Deployment Strategy

### Development Environment

- Firebase project: rapidrinse-dev
- Paystack test mode
- Test push notifications

### Staging Environment

- Firebase project: rapidrinse-staging
- Paystack test mode
- Full feature testing

### Production Environment

- Firebase project: rapidrinse-prod
- Paystack live mode
- Production push notifications
- Enable Firebase Performance Monitoring
- Enable Firebase Crashlytics

### CI/CD Pipeline

1. Run tests on pull request
2. Build app for staging on merge to develop
3. Deploy Cloud Functions to staging
4. Manual QA approval
5. Build production app on merge to main
6. Deploy Cloud Functions to production
7. Submit to App Store and Play Store

## Migration Plan

### Phase 1: Firebase Setup (Week 1)

- Create Firebase project
- Set up Firestore database
- Configure authentication
- Deploy security rules
- Set up Firebase Storage

### Phase 2: Core Services (Week 2-3)

- Implement Firebase service layer
- Replace mock data with Firestore queries
- Implement authentication flow
- Add real-time listeners

### Phase 3: Payment Integration (Week 4)

- Set up Paystack account
- Implement payment service
- Create payment webhook
- Test payment flow

### Phase 4: Notifications (Week 5)

- Set up Expo Notifications
- Implement push notification service
- Create Cloud Functions for notifications
- Test notification delivery

### Phase 5: Testing & Polish (Week 6-7)

- Write unit and integration tests
- Perform end-to-end testing
- Fix bugs and optimize performance
- Prepare for deployment

### Phase 6: Deployment (Week 8)

- Deploy to staging
- Conduct user acceptance testing
- Deploy to production
- Submit to app stores
