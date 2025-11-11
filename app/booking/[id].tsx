import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { Header } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBookings } from '@/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookingDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getBookingById } = useBookings();

  const [booking, setBooking] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadBooking = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const bookingData = await getBookingById(id as string);
        if (bookingData) {
          setBooking(bookingData);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load booking details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id, getBookingById]);

  if (loading) {
    return (
      <ProtectedRoute>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Header
            title='Booking Details'
            showBackButton
            onBackPress={() => router.back()}
          />
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
              Loading booking details...
            </ThemedText>
          </View>
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

  if (error || !booking) {
    return (
      <ProtectedRoute>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Header
            title='Booking Details'
            showBackButton
            onBackPress={() => router.back()}
          />
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name='alert-circle'
              size={48}
              color={theme.colors.error['500']}
            />
            <ThemedText
              variant='h4'
              colorVariant='error'
              colorShade='600'
              style={{ marginTop: 16, textAlign: 'center' }}
            >
              {error || 'Booking not found'}
            </ThemedText>
            <ThemedButton
              title='Go Back'
              variant='primary'
              onPress={() => router.back()}
              style={{ marginTop: 24 }}
            />
          </View>
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

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
    <ProtectedRoute>
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
                  Booking ID
                </ThemedText>
                <ThemedText variant='h4' style={{ marginTop: 2 }}>
                  {booking.id}
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
              {booking.serviceName || 'Car Wash Service'}
            </ThemedText>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name='store'
                size={20}
                color={theme.colors.primary['500']}
              />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <ThemedText variant='body' style={{ fontWeight: '600' }}>
                  {booking.businessName || 'Business Name'}
                </ThemedText>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                >
                  {booking.businessAddress || 'Business Address'}
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
              Payment Summary
            </ThemedText>
            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.totalRow}>
                <ThemedText variant='h4'>Total Amount</ThemedText>
                <ThemedText
                  variant='h4'
                  colorVariant='primary'
                  style={{ fontWeight: '700' }}
                >
                  {formatPrice(booking.totalAmount)}
                </ThemedText>
              </View>
              {booking.serviceDuration && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name='clock-outline'
                    size={20}
                    color={theme.colors.gray['500']}
                  />
                  <ThemedText
                    variant='body'
                    colorVariant='gray'
                    colorShade='600'
                    style={{ marginLeft: 8 }}
                  >
                    Estimated duration: {booking.serviceDuration} minutes
                  </ThemedText>
                </View>
              )}
            </ThemedCard>
          </View>

          {booking.notes && (
            <View style={styles.section}>
              <ThemedText variant='h3' style={styles.sectionTitle}>
                Notes
              </ThemedText>
              <ThemedCard variant='elevated' style={styles.card}>
                <ThemedText variant='body' colorVariant='gray' colorShade='700'>
                  {booking.notes}
                </ThemedText>
              </ThemedCard>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
