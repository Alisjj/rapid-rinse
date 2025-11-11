import React, { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/firebase/authContext';
import { useTheme } from '@/theme';
import { ThemedText } from '@/components/ui';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that checks authentication status
 * and redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size='large' color={theme.colors.primary['500']} />
        <ThemedText variant='body' style={styles.loadingText}>
          Checking authentication...
        </ThemedText>
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    // Use setTimeout to avoid navigation during render
    setTimeout(() => {
      router.replace('/login' as any);
    }, 0);

    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size='large' color={theme.colors.primary['500']} />
        <ThemedText variant='body' style={styles.loadingText}>
          Redirecting to login...
        </ThemedText>
      </View>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
