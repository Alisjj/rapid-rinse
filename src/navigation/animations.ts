import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// Custom transition animations
export const slideFromRightAnimation: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
};

export const slideFromBottomAnimation: NativeStackNavigationOptions = {
  animation: 'slide_from_bottom',
};

export const fadeAnimation: NativeStackNavigationOptions = {
  animation: 'fade',
};

export const flipAnimation: NativeStackNavigationOptions = {
  animation: 'flip',
};

export const modalPresentationAnimation: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
};

export const fullScreenModalAnimation: NativeStackNavigationOptions = {
  presentation: 'fullScreenModal',
  animation: 'slide_from_bottom',
};

// Common screen options
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  gestureEnabled: true,
  headerShown: true,
};

export const authScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  gestureEnabled: false, // Disable swipe back on auth screens
};
