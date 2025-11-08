import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { defaultScreenOptions, modalScreenOptions } from './animations';
import type { BookingStackParamList } from '../types';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="BookingsList"
        component={BookingsListScreen}
        options={{
          title: 'My Bookings',
        }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          headerShown: true,
          title: 'Booking Details',
          headerBackTitle: 'Bookings',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="BookService"
        component={BookServiceScreen}
        options={{
          ...modalScreenOptions,
          title: 'Book Service',
          headerBackTitle: 'Back',
          gestureEnabled: false, // Prevent accidental dismissal during booking
        }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{
          headerShown: true,
          title: 'Booking Confirmed',
          headerBackTitle: 'Back',
          gestureEnabled: false, // Prevent swipe back on confirmation screen
          animation: 'fade',
          headerLeft: () => null, // Remove back button on confirmation
        }}
      />
    </Stack.Navigator>
  );
}

// Placeholder screen components - these will be implemented in later tasks
function BookingsListScreen() {
  return null; // Will be implemented in screen migration tasks
}

function BookingDetailsScreen() {
  return null; // Will be implemented in screen migration tasks
}

function BookServiceScreen() {
  return null; // Will be implemented in screen migration tasks
}

function BookingConfirmationScreen() {
  return null; // Will be implemented in screen migration tasks
}
