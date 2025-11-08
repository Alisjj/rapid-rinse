import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { HomeStack } from './HomeStack';
import { SearchStack } from './SearchStack';
import { BookingStack } from './BookingStack';
import { ProfileStack } from './ProfileStack';
import type { MainTabParamList } from '../types';

// Custom tab bar badge hook (placeholder for future implementation)
function useTabBadges() {
  // This would connect to app state to show badges
  return {
    bookingsBadge: undefined, // Could show pending bookings count
    homeBadge: undefined, // Could show notifications count
  };
}

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const { bookingsBadge, homeBadge } = useTabBadges();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Bookings':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Vehicles':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarBadge: homeBadge,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingStack}
        options={{
          title: 'Bookings',
          tabBarBadge: bookingsBadge,
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{
          title: 'Vehicles',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Placeholder screen component - this will be implemented in later tasks
function VehiclesScreen() {
  return null; // Will be implemented in screen migration tasks
}
