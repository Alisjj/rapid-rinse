import React from 'react';
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/theme';
import { BusinessProvider } from '@/services/firebase';
import { AuthProvider } from '@/services/firebase/authContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <Slot />
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
