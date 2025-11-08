import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText } from '@/components/ui';
import { BookingCard } from '@/components/business';
import { Header } from '@/components/navigation';

// Mock data - expanded list
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
  {
    id: '2',
    customerId: '1',
    businessId: '2',
    serviceId: '2',
    scheduledDate: new Date(Date.now() - 86400000 * 2),
    status: 'completed' as const,
    totalAmount: 45.99,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    serviceName: 'Premium Detail',
    businessName: 'Premium Auto Spa',
    paymentStatus: 'paid' as const,
  },
  {
    id: '3',
    customerId: '1',
    businessId: '3',
    serviceId: '3',
    scheduledDate: new Date(Date.now() - 86400000 * 7),
    status: 'completed' as const,
    totalAmount: 35.99,
    createdAt: new Date(Date.now() - 86400000 * 8),
    updatedAt: new Date(Date.now() - 86400000 * 7),
    serviceName: 'Eco Wash',
    businessName: 'Eco Clean Car Wash',
    paymentStatus: 'paid' as const,
  },
  {
    id: '4',
    customerId: '1',
    businessId: '1',
    serviceId: '4',
    scheduledDate: new Date(Date.now() + 86400000 * 3),
    status: 'pending' as const,
    totalAmount: 29.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Standard Wash',
    businessName: 'Quick Wash Express',
    paymentStatus: 'pending' as const,
  },
];

export default function Bookings() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title='My Bookings'
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText variant='h3'>All Bookings</ThemedText>
          <ThemedText
            variant='body'
            colorVariant='gray'
            colorShade='600'
            style={{ marginTop: 4 }}
          >
            {mockBookings.length} total bookings
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
