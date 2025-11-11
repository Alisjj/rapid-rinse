# Firestore Service Usage Guide

This document provides examples of how to use the comprehensive `FirestoreService` for all Firestore operations.

## Overview

The `FirestoreService` provides a unified interface for:

- Business operations with geolocation filtering
- Booking operations with availability checking
- User profile and vehicle management
- Review operations with pagination

## Business Operations

### Get Businesses with Geolocation Filtering

```typescript
import { FirestoreService } from '@/services/firebase';

// Get businesses within 10km radius
const { businesses, lastDoc } = await FirestoreService.getBusinesses(
  {
    location: {
      latitude: 10.2897,
      longitude: 11.1678,
      radius: 10, // kilometers
    },
    isActive: true,
    minRating: 4.0,
  },
  {
    limit: 20,
  }
);
```

### Get Business by ID

```typescript
const business = await FirestoreService.getBusinessById('business-id');
if (business) {
  console.log(business.name, business.services);
}
```

### Search Businesses

```typescript
const { businesses } = await FirestoreService.searchBusinesses('car wash', {
  location: {
    latitude: 10.2897,
    longitude: 11.1678,
    radius: 5,
  },
});
```

### Real-time Business Updates

```typescript
const unsubscribe = FirestoreService.subscribeToBusinesses(
  { isActive: true },
  businesses => {
    console.log('Updated businesses:', businesses);
  }
);

// Cleanup when done
unsubscribe();
```

## Booking Operations

### Create Booking with Availability Check

```typescript
const bookingId = await FirestoreService.createBooking({
  userId: 'user-id',
  businessId: 'business-id',
  serviceId: 'service-id',
  serviceName: 'Full Service Wash',
  servicePrice: 5000,
  vehicleId: 'vehicle-id',
  vehicleInfo: {
    year: '2020',
    make: 'Toyota',
    model: 'Camry',
    licensePlate: 'ABC123',
  },
  scheduledDate: new Date('2025-11-15T10:00:00'),
  totalAmount: 5000,
  notes: 'Please focus on the interior',
});
```

### Get User Bookings

```typescript
const bookings = await FirestoreService.getBookings({
  userId: 'user-id',
  status: 'confirmed',
});
```

### Update Booking Status

```typescript
await FirestoreService.updateBooking('booking-id', {
  status: 'confirmed',
});
```

### Cancel Booking with Refund

```typescript
await FirestoreService.cancelBooking(
  'booking-id',
  'Customer requested cancellation'
);
```

### Real-time Booking Updates

```typescript
const unsubscribe = FirestoreService.subscribeToBookings(
  { userId: 'user-id' },
  bookings => {
    console.log('Updated bookings:', bookings);
  }
);

// Cleanup when done
unsubscribe();
```

## User Profile and Vehicle Operations

### Get User Profile

```typescript
const user = await FirestoreService.getUserProfile('user-id');
```

### Update User Profile

```typescript
await FirestoreService.updateUserProfile('user-id', {
  displayName: 'John Doe',
  phoneNumber: '+2348012345678',
});
```

### Add Vehicle

```typescript
const vehicleId = await FirestoreService.addVehicle({
  userId: 'user-id',
  year: '2020',
  make: 'Toyota',
  model: 'Camry',
  licensePlate: 'ABC123',
  color: 'Silver',
});
```

### Get User Vehicles

```typescript
const vehicles = await FirestoreService.getVehicles('user-id');
```

### Delete Vehicle

```typescript
await FirestoreService.deleteVehicle('vehicle-id');
```

### Upload Profile Picture

```typescript
const photoURL = await FirestoreService.uploadProfilePicture(
  'user-id',
  'file:///path/to/image.jpg'
);
```

## Review Operations

### Add Review

```typescript
const reviewId = await FirestoreService.addReview({
  businessId: 'business-id',
  userId: 'user-id',
  bookingId: 'booking-id',
  rating: 5,
  comment: 'Excellent service! Very professional and thorough.',
});
```

### Get Reviews with Pagination

```typescript
const { reviews, lastDoc } = await FirestoreService.getReviews({
  businessId: 'business-id',
  minRating: 4,
  limit: 10,
});

// Load more reviews
const { reviews: moreReviews } = await FirestoreService.getReviews({
  businessId: 'business-id',
  limit: 10,
  lastDoc: lastDoc,
});
```

### Flag Review for Moderation

```typescript
await FirestoreService.flagReview('review-id');
```

## Error Handling

All methods throw errors that should be caught and handled:

```typescript
try {
  const booking = await FirestoreService.createBooking(bookingData);
  console.log('Booking created:', booking);
} catch (error) {
  if (error instanceof Error) {
    console.error('Booking error:', error.message);
    // Show user-friendly error message
  }
}
```

## Cleanup

When your component unmounts or you're done with the service:

```typescript
// Clear cache
FirestoreService.clearCache();

// Cleanup all listeners
FirestoreService.cleanup();
```

## Integration with React Hooks

Example custom hook using FirestoreService:

```typescript
import { useState, useEffect } from 'react';
import { FirestoreService } from '@/services/firebase';

export function useBusinesses(location: {
  latitude: number;
  longitude: number;
}) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirestoreService.subscribeToBusinesses(
      {
        location: { ...location, radius: 10 },
        isActive: true,
      },
      updatedBusinesses => {
        setBusinesses(updatedBusinesses);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [location.latitude, location.longitude]);

  return { businesses, loading };
}
```

## Notes

- All methods include proper validation and error handling
- Real-time listeners automatically update when data changes
- Caching is implemented for frequently accessed data (5-minute TTL)
- Geolocation filtering uses the Haversine formula for accurate distance calculations
- Booking availability is checked automatically before creation
- Review submission automatically updates business ratings
