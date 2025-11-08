import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SearchResultsScreen,
  NearbyBusinessesScreen,
  ServicesScreen,
} from '../screens/business';

export type SearchStackParamList = {
  SearchResults: { query: string; location?: string };
  NearbyBusinesses: undefined;
  Services: { businessId?: string; category?: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name='SearchResults' component={SearchResultsScreen} />
      <Stack.Screen
        name='NearbyBusinesses'
        component={NearbyBusinessesScreen}
      />
      <Stack.Screen name='Services' component={ServicesScreen} />
    </Stack.Navigator>
  );
}
