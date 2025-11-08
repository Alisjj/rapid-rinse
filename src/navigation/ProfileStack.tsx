import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerBackTitle: 'Profile',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerBackTitle: 'Profile',
        }}
      />
      <Stack.Screen
        name="VehiclesList"
        component={VehiclesListScreen}
        options={{
          headerShown: true,
          title: 'My Vehicles',
          headerBackTitle: 'Profile',
        }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{
          headerShown: true,
          title: 'Add Vehicle',
          headerBackTitle: 'Vehicles',
        }}
      />
      <Stack.Screen
        name="EditVehicle"
        component={EditVehicleScreen}
        options={{
          headerShown: true,
          title: 'Edit Vehicle',
          headerBackTitle: 'Vehicles',
        }}
      />
    </Stack.Navigator>
  );
}

// Placeholder screen components - these will be implemented in later tasks
function ProfileScreen() {
  return null; // Will be implemented in screen migration tasks
}

function EditProfileScreen() {
  return null; // Will be implemented in screen migration tasks
}

function SettingsScreen() {
  return null; // Will be implemented in screen migration tasks
}

function VehiclesListScreen() {
  return null; // Will be implemented in screen migration tasks
}

function AddVehicleScreen() {
  return null; // Will be implemented in screen migration tasks
}

function EditVehicleScreen() {
  return null; // Will be implemented in screen migration tasks
}
