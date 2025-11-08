import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='nearby' options={{ headerShown: false }} />
        <Stack.Screen name='bookings' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
