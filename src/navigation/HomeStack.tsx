import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { defaultScreenOptions, modalScreenOptions } from './animations';
import type { HomeStackParamList } from '../types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
        options={{
          headerShown: true,
          title: 'Business Details',
          headerBackTitle: 'Back',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ServiceBooking"
        component={ServiceBookingScreen}
        options={{
          ...modalScreenOptions,
          title: 'Book Service',
          headerBackTitle: 'Back',
          gestureEnabled: false, // Prevent accidental dismissal during booking
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{
          headerShown: true,
          title: 'Search Results',
          headerBackTitle: 'Back',
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
}

// Placeholder screen components - these will be implemented in later tasks
function HomeScreen() {
  return null; // Will be implemented in screen migration tasks
}

function BusinessDetailsScreen() {
  return null; // Will be implemented in screen migration tasks
}

function ServiceBookingScreen() {
  return null; // Will be implemented in screen migration tasks
}

function SearchResultsScreen() {
  return null; // Will be implemented in screen migration tasks
}
