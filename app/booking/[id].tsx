import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock booking data
const mockBookingDetails: Record<string, any> = {
  '1': {
    id: '1',
    serviceName: 'Express Wash',
    businessName: 'Quick Wash Express',
    businessAddress: '123 Main St, City, State',
    businessPhone: '+1 (234) 567-8900',
    scheduledDate: new Date(Date.now() + 86400000),
    status: 'confirmed',
    totalAmount: 25.99,
    paymentStatus: 'paid',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Silver',
      licensePlate: 'ABC-1234',
    },
    serviceDetails: [
      { name: 'Express Wash', price: 15.99, duration: 15 },
      { name: 'Tire Shine', price: 5.0, duration: 5 },
      { name: 'Air Freshener', price: 5.0, duration: 2 },
    ],
    notes: 'Please pay extra attention to the wheels',
    confirmationCode: 'RR-2024-001',
  },
};

export default function BookingDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const booking = mockBookingDetails[id as string] || mockBookingDetails['1'];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return theme.colors.success['500'];
      case 'pending':
        return theme.colors.warning['500'];
      case 'completed':
        return theme.colors.primary['500'];
      case 'cancelled':
        return theme.colors.error['500'];
      default:
        return theme.colors.gray['500'];
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title='Booking Details'
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedCard variant='elevated' style={styles.card}>
          <View style={styles.statusHeader}>
            <View>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
              >
                Confirmation Code
              </ThemedText>
              <ThemedText variant='h4' style={{ marginTop: 2 }}>
                {booking.confirmationCode}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(booking.status) },
              ]}
            >
              <ThemedText
                variant='caption'
                style={{
                  color: '#FFFFFF',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {booking.status}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        <ThemedCard variant='elevated' style={styles.card}>
          <ThemedText variant='h3' style={{ marginBottom: 12 }}>
            {booking.serviceName}
          </ThemedText>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name='store'
              size={20}
              color={theme.colors.primary['500']}
            />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <ThemedText variant='body' style={{ fontWeight: '600' }}>
                {booking.businessName}
              </ThemedText>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
              >
                {booking.businessAddress}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name='calendar'
              size={20}
              color={theme.colors.primary['500']}
            />
            <ThemedText
              variant='body'
              style={{ marginLeft: 8, fontWeight: '600' }}
            >
              {formatDate(booking.scheduledDate)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name='clock'
              size={20}
              color={theme.colors.primary['500']}
            />
            <ThemedText
              variant='body'
              style={{ marginLeft: 8, fontWeight: '600' }}
            >
              {formatTime(booking.scheduledDate)}
            </ThemedText>
          </View>
        </ThemedCard>

        <View style={styles.section}>
          <ThemedText variant='h3' style={styles.sectionTitle}>
            Vehicle Information
          </ThemedText>
          <ThemedCard variant='elevated' style={styles.card}>
            <View style={styles.vehicleRow}>
              <MaterialCommunityIcons
                name='car'
                size={32}
                color={theme.colors.primary['500']}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <ThemedText variant='h4'>
                  {booking.vehicleInfo.year} {booking.vehicleInfo.make}{' '}
                  {booking.vehicleInfo.model}
                </ThemedText>
                <ThemedText
                  variant='body'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginTop: 2 }}
                >
                  {booking.vehicleInfo.color} •{' '}
                  {booking.vehicleInfo.licensePlate}
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        </View>

        <View style={styles.section}>
          <ThemedText variant='h3' style={styles.sectionTitle}>
            Service Breakdown
          </ThemedText>
          <ThemedCard variant='elevated' style={styles.card}>
            {booking.serviceDetails.map((service: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.serviceRow,
                  index < booking.serviceDetails.length - 1 &&
                    styles.serviceRowBorder,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText variant='body' style={{ fontWeight: '600' }}>
                    {service.name}
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                  >
                    {service.duration} minutes
                  </ThemedText>
                </View>
                <ThemedText variant='body' style={{ fontWeight: '600' }}>
                  {formatPrice(service.price)}
                </ThemedText>
              </View>
            ))}

            <View style={styles.totalRow}>
              <ThemedText variant='h4'>Total</ThemedText>
              <ThemedText
                variant='h4'
                colorVariant='primary'
                style={{ fontWeight: '700' }}
              >
                {formatPrice(booking.totalAmount)}
              </ThemedText>
            </View>
          </ThemedCard>
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
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  serviceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D5DB',
  },
});
