import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { navigationRef } from './navigationRef';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import {
  saveNavigationState,
  loadNavigationState,
} from './navigationPersistence';
import { BookingDetailScreen, BookServiceScreen } from '../screens/booking';
import { BusinessDetailScreen } from '../screens/business';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
              BusinessDetails: 'business/:businessId',
              ServiceBooking: 'booking/:businessId/:serviceId',
              SearchResults: 'search/:query',
            },
          },
          Search: {
            screens: {
              SearchScreen: 'search',
              SearchResults: 'search/:query',
              BusinessDetails: 'business/:businessId',
              NearbyBusinesses: 'nearby',
            },
          },
          Bookings: {
            screens: {
              BookingsList: 'bookings',
              BookingDetails: 'booking/:bookingId',
              BookService: 'book/:businessId',
              BookingConfirmation: 'booking-confirmation/:bookingId',
            },
          },
          Vehicles: 'vehicles',
          Profile: {
            screens: {
              ProfileScreen: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
              VehiclesList: 'vehicles',
              AddVehicle: 'vehicles/add',
              EditVehicle: 'vehicles/:vehicleId/edit',
            },
          },
        },
      },
      BookingDetails: 'booking/:bookingId',
      BusinessDetails: 'business/:businessId',
      ServiceBooking: 'booking/:businessId/:serviceId',
    },
  },
};

interface RootNavigatorProps {
  isAuthenticated: boolean;
}

export function RootNavigator({ isAuthenticated }: RootNavigatorProps) {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<
    NavigationState | undefined
  >();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await loadNavigationState();
        if (savedState) {
          setInitialState(savedState);
        }
      } catch (error) {
        console.warn('Failed to restore navigation state:', error);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null; // Show loading screen while restoring state
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      initialState={initialState}
      onStateChange={saveNavigationState}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name='Main' component={MainTabs} />
        ) : (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}

        {/* Global modal screens */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name='BookingDetails'
            component={BookingDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='BusinessDetails'
            component={BusinessDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='ServiceBooking'
            component={BookServiceScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
