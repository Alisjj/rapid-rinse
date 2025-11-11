import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, SearchBar } from '@/components/ui';
import { BusinessCard, BookingCard } from '@/components/business';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBusinessContext } from '@/services/firebase';
import { LocationService } from '@/services/location';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    customerId: '1',
    businessId: '1',
    serviceId: '1',
    scheduledDate: new Date(Date.now() + 86400000),
    status: 'confirmed' as const,
    totalAmount: 25.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Express Wash',
    businessName: 'Quick Wash Express',
    paymentStatus: 'paid' as const,
  },
];

// Mock businesses for fallback
const mockBusinesses = [
  {
    id: '1',
    name: 'Quick Wash Express',
    description: 'Fast and reliable car wash service',
    address: '123 Main St, City, State',
    phone: '+1234567890',
    email: 'info@quickwash.com',
    ownerId: '1',
    services: [],
    operatingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.5,
    reviewCount: 128,
    distance: 0.8,
    isOpen: true,
  },
  {
    id: '2',
    name: 'Premium Auto Spa',
    description: 'Luxury car detailing and wash',
    address: '456 Oak Ave, City, State',
    phone: '+1234567891',
    email: 'info@premiumspa.com',
    ownerId: '2',
    services: [],
    operatingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.8,
    reviewCount: 256,
    distance: 1.2,
    isOpen: true,
  },
];

export default function Index() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    businesses,
    loading,
    refreshing,
    error,
    searchBusinesses,
    refreshBusinesses,
    clearError,
  } = useBusinessContext();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await searchBusinesses(query);
  };

  const handleRefresh = async () => {
    await refreshBusinesses();
  };

  const handleCheckLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        Alert.alert(
          'Your Location',
          `Latitude: ${location.latitude.toFixed(6)}\nLongitude: ${location.longitude.toFixed(6)}\n\nAddress: ${location.address || 'Not available'}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'Could not get your location. Please check permissions.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to get location: ' + (error as Error).message
      );
    }
  };

  // Show only first 2 businesses on home screen
  // Adapt Firebase Business type to component Business type
  const displayedBusinesses = businesses.slice(0, 2).map((business: any) => ({
    ...business,
    // createdAt and updatedAt are already Date objects from formatDocumentData
  })) as any[];

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='RapidRinse'
          showNotificationBadge={false}
          rightComponent={
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={handleCheckLocation}>
                <MaterialCommunityIcons
                  name='crosshairs-gps'
                  size={28}
                  color={theme.colors.primary['500']}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/profile')}>
                <MaterialCommunityIcons
                  name='account-circle'
                  size={28}
                  color={theme.colors.primary['500']}
                />
              </TouchableOpacity>
            </View>
          }
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
          <ThemedCard
            variant='elevated'
            style={[
              styles.welcomeBanner,
              { backgroundColor: theme.colors.primary['500'] },
            ]}
          >
            <View style={styles.welcomeContent}>
              <ThemedText
                variant='bodyLarge'
                style={{ color: theme.colors.gray['50'] }}
              >
                Hi there,
              </ThemedText>
              <ThemedText
                variant='h3'
                style={{ color: theme.colors.gray['50'], marginTop: 4 }}
              >
                Good Day
              </ThemedText>
              <ThemedText
                variant='caption'
                style={{ color: theme.colors.gray['100'], marginTop: 4 }}
              >
                Ready to get your car washed?
              </ThemedText>
            </View>
          </ThemedCard>

          <View style={styles.searchBar}>
            <SearchBar
              placeholder='Search for car wash services...'
              onSearch={handleSearch}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

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
                  <TouchableOpacity onPress={clearError}>
                    <MaterialCommunityIcons
                      name='close'
                      size={20}
                      color={theme.colors.error['500']}
                    />
                  </TouchableOpacity>
                </View>
              </ThemedCard>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant='h4'>Nearby Car Washes</ThemedText>
              <ThemedText
                variant='button'
                style={{ color: theme.colors.primary['500'] }}
                onPress={() => router.push('/nearby')}
              >
                View All
              </ThemedText>
            </View>

            {loading && !refreshing ? (
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
                  Loading businesses...
                </ThemedText>
              </View>
            ) : displayedBusinesses.length > 0 ? (
              displayedBusinesses.map(business => (
                <View key={business.id} style={styles.businessCard}>
                  <BusinessCard
                    business={business}
                    onPress={() => router.push(`/business/${business.id}`)}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name='store-off'
                  size={48}
                  color={theme.colors.gray['400']}
                />
                <ThemedText
                  variant='body'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginTop: 12, textAlign: 'center' }}
                >
                  {searchQuery
                    ? 'No businesses found matching your search'
                    : 'No businesses available at the moment'}
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant='h4'>Recent Activity</ThemedText>
              <ThemedText
                variant='button'
                style={{ color: theme.colors.primary['500'] }}
                onPress={() => router.push('/bookings')}
              >
                View All
              </ThemedText>
            </View>

            {mockBookings.map(booking => (
              <View key={booking.id} style={styles.bookingCard}>
                <BookingCard
                  booking={booking}
                  onPress={() => router.push(`/booking/${booking.id}`)}
                />
              </View>
            ))}
          </View>
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
  welcomeBanner: {
    margin: 16,
    marginBottom: 8,
  },
  welcomeContent: {
    padding: 20,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  businessCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 8,
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
