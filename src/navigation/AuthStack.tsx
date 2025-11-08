import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authScreenOptions, fadeAnimation } from './animations';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={authScreenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          ...fadeAnimation,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          title: 'Reset Password',
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

// Placeholder screen components - these will be implemented in later tasks
function LoginScreen() {
  return null; // Will be implemented in screen migration tasks
}

function RegisterScreen() {
  return null; // Will be implemented in screen migration tasks
}

function ForgotPasswordScreen() {
  return null; // Will be implemented in screen migration tasks
}
