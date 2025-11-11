import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { BookingCard } from '@/components/business';
import { Header } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBookings, useAuth } from '@/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Bookings() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const {
    bookings,
    loading,
    refreshing,
    error,
    loadBookings,
    refreshBookings,
    getUpcomingBookings,
    getPastBookings,
  } = useBookings();

  // Load bookings on mount
  React.useEffect(() => {
    if (user?.uid) {
      loadBookings({ customerId: user.uid });
    }
  }, [user?.uid, loadBookings]);

  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();

  const handleRefresh = async () => {
    await refreshBookings();
  };

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='My Bookings'
          showBackButton
          onBackPress={() => router.back()}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary['500']}
            />
          }
        >
          {error && (
            <View style={styles.errorContainer}>
              <ThemedCard
                variant='elevated'
                style={[
                  styles.errorCard,
                  { backgroundColor: theme.colors.error['50'] },
                ]}
              >
                <View style={styles.errorContent}>
                  <MaterialCommunityIcons
                    name='alert-circle'
                    size={24}
                    color={theme.colors.error['500']}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <ThemedText
                      variant='body'
                      style={{ color: theme.colors.error['700'] }}
                    >
                      {error}
                    </ThemedText>
                  </View>
                  <TouchableOpacity onPress={() => loadBookings()}>
                    <MaterialCommunityIcons
                      name='refresh'
                      size={20}
                      color={theme.colors.error['500']}
                    />
                  </TouchableOpacity>
                </View>
              </ThemedCard>
            </View>
          )}

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText variant='h4'>Upcoming</ThemedText>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                >
                  {upcomingBookings.length} booking
                  {upcomingBookings.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>

              {upcomingBookings.map(booking => (
                <View key={booking.id} style={styles.bookingCard}>
                  <BookingCard
                    booking={booking}
                    onPress={() => router.push(`/booking/${booking.id}`)}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText variant='h4'>Past Bookings</ThemedText>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                >
                  {pastBookings.length} booking
                  {pastBookings.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>

              {pastBookings.map(booking => (
                <View key={booking.id} style={styles.bookingCard}>
                  <BookingCard
                    booking={booking}
                    onPress={() => router.push(`/booking/${booking.id}`)}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Loading State */}
          {loading && !refreshing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size='large'
                color={theme.colors.primary['500']}
              />
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='600'
                style={{ marginTop: 12 }}
              >
                Loading bookings...
              </ThemedText>
            </View>
          )}

          {/* Empty State */}
          {!loading && !error && bookings.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name='calendar-blank-outline'
                size={48}
                color={theme.colors.gray['400']}
              />
              <ThemedText
                variant='h4'
                colorVariant='gray'
                colorShade='600'
                style={{ marginTop: 16, textAlign: 'center' }}
              >
                No Bookings Yet
              </ThemedText>
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='500'
                style={{ marginTop: 8, textAlign: 'center' }}
              >
                Your booking history will appear here once you schedule
                services.
              </ThemedText>
              <ThemedButton
                title='Find Services'
                variant='primary'
                onPress={() => router.push('/')}
                style={{ marginTop: 24 }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorCard: {
    padding: 12,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
