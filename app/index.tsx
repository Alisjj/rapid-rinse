import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, SearchBar } from '@/components/ui';
import { BusinessCard, BookingCard } from '@/components/business';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data
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

export default function Index() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title='RapidRinse'
        showNotificationBadge={false}
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <MaterialCommunityIcons
                name='login'
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            onSearch={query => console.log('Search:', query)}
          />
        </View>

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

          {mockBusinesses.map(business => (
            <View key={business.id} style={styles.businessCard}>
              <BusinessCard
                business={business}
                onPress={() => router.push(`/business/${business.id}`)}
              />
            </View>
          ))}
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
});
