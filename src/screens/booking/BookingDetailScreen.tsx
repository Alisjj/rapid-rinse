import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import { ThemedText, ThemedButton, ThemedCard } from '@/components/ui';
import { Header } from '@/components/navigation';
import { formatCurrency } from '@/utils';

// Import types and theme
import {
  BookingStackParamList,
  Booking,
  Business,
  Service,
  User,
} from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { fetchBookingDetails, cancelBooking, rescheduleBooking } from '@/services/api';

type BookingDetailScreenNavigationProp = NativeStackNavigationProp<
  BookingStackParamList,
  'BookingDetails'
>;
type BookingDetailScreenRouteProp = RouteProp<
  BookingStackParamList,
  'BookingDetails'
>;

interface BookingDetailScreenProps {
  navigation: BookingDetailScreenNavigationProp;
  route: BookingDetailScreenRouteProp;
}

interface BookingDetails extends Booking {
  business?: Business;
  service?: Service;
  washer?: User;
}

// Timeline Component
const BookingTimeline: React.FC<{ booking: BookingDetails }> = ({
  booking,
}) => {
  const { theme } = useTheme();

  const getTimelineSteps = () => {
    const steps = [
      { key: 'pending', label: 'Booking Requested', completed: true },
      {
        key: 'confirmed',
        label: 'Booking Confirmed',
        completed: ['confirmed', 'completed'].includes(booking.status),
      },
      {
        key: 'in-progress',
        label: 'Service in Progress',
        completed: booking.status === 'completed',
      },
      {
        key: 'completed',
        label: 'Service Completed',
        completed: booking.status === 'completed',
      },
    ];

    if (booking.status === 'cancelled') {
      return [
        { key: 'pending', label: 'Booking Requested', completed: true },
        { key: 'cancelled', label: 'Booking Cancelled', completed: true },
      ];
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  return (
    <View style={styles.timeline}>
      {timelineSteps.map((step, index) => (
        <View key={step.key} style={styles.timelineStep}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: step.completed
                    ? theme.colors.primary['500']
                    : theme.colors.gray['300'],
                },
              ]}
            >
              {step.completed && (
                <ThemedText
                  variant='caption'
                  style={{ color: theme.colors.gray['50'] }}
                >
                  ✓
                </ThemedText>
              )}
            </View>
            {index < timelineSteps.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor: step.completed
                      ? theme.colors.primary['500']
                      : theme.colors.gray['300'],
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.timelineRight}>
            <ThemedText
              variant='body'
              style={{
                color: step.completed
                  ? theme.colors.text
                  : theme.colors.gray['500'],
                fontWeight: step.completed ? '600' : '400',
              }}
            >
              {step.label}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning['500'];
      case 'confirmed':
        return theme.colors.primary['500'];
      case 'completed':
        return theme.colors.success['500'];
      case 'cancelled':
        return theme.colors.error['500'];
      default:
        return theme.colors.gray['500'];
    }
  };

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}
    >
      <ThemedText
        variant='caption'
        style={[styles.statusText, { color: theme.colors.gray['50'] }]}
      >
        {status.toUpperCase()}
      </ThemedText>
    </View>
  );
};

const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { bookingId } = route.params;
  const { theme } = useTheme();

  // State management
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with actual API calls
  const mockBookingDetails: BookingDetails = {
    id: bookingId,
    customerId: '1',
    businessId: '1',
    serviceId: '1',
    scheduledDate: new Date(Date.now() + 86400000),
    status: 'confirmed',
    totalAmount: 25.99,
    notes: 'Please wash the exterior thoroughly',
    createdAt: new Date(),
    updatedAt: new Date(),
    business: {
      id: '1',
      ownerId: '1',
      name: 'Quick Wash Express',
      description: 'Fast and reliable car wash service',
      address: '123 Main St, City, State 12345',
      location: { latitude: 37.7749, longitude: -122.4194 },
      phone: '+1 (555) 123-4567',
      email: 'info@quickwash.com',
      imageUrl: '',
      images: [],
      rating: 4.5,
      reviewCount: 10,
      operatingHours: {},
      services: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    service: {
      id: '1',
      name: 'Premium Exterior Wash',
      description: 'Complete exterior cleaning with wax protection',
      price: 25.99,
      duration: 45,
      category: 'exterior',
    },
    washer: {
      id: '2',
      email: 'washer@example.com',
      name: 'Mike Johnson',
      phone: '+1 (555) 987-6543',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  // Load booking details
  useEffect(() => {
    const loadBookingDetails = async () => {
      setLoading(true);

      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooking(mockBookingDetails);
      } catch (error) {
        console.error('Error loading booking details:', error);
        Alert.alert(
          'Error',
          'Failed to load booking details. Please try again.'
        );
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingId]);

  // Handle cancel booking
  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock cancel booking - replace with actual API call
              await new Promise(resolve => setTimeout(resolve, 1000));

              setBooking(prev =>
                prev ? { ...prev, status: 'cancelled' } : null
              );
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert(
                'Error',
                'Failed to cancel booking. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  // Handle reschedule booking
  const handleRescheduleBooking = () => {
    // Navigate to reschedule screen or show date picker
    Alert.alert(
      'Reschedule',
      'Reschedule functionality will be implemented soon'
    );
  };

  // Handle contact business
  const handleContactBusiness = () => {
    if (!booking?.business?.phone) return;

    Alert.alert('Contact Business', `Call ${booking.business.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${booking.business!.phone}`);
        },
      },
    ]);
  };

  // Handle contact washer
  const handleContactWasher = () => {
    if (!booking?.washer?.phone) return;

    Alert.alert('Contact Washer', `Call ${booking.washer.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${booking.washer!.phone}`);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Booking Details' />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant='body'
            style={{ color: theme.colors.gray['500'] }}
          >
            Loading booking details...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Booking Details' />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant='body'
            style={{ color: theme.colors.gray['500'] }}
          >
            Booking not found
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Booking Details' />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ThemedCard style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <ThemedText variant='h4'>
                Booking #{booking.id.slice(-6)}
              </ThemedText>
              <ThemedText
                variant='caption'
                style={{ color: theme.colors.gray['500'] }}
              >
                Created {booking.createdAt.toLocaleDateString()}
              </ThemedText>
            </View>
            <StatusBadge status={booking.status} />
          </View>
        </ThemedCard>

        {/* Timeline Section */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Booking Progress
          </ThemedText>
          <BookingTimeline booking={booking} />
        </ThemedCard>

        {/* Service Details */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Service Details
          </ThemedText>
          <View style={styles.serviceDetails}>
            <ThemedText variant='bodyLarge' style={styles.serviceName}>
              {booking.service?.name}
            </ThemedText>
            <ThemedText
              variant='body'
              style={[
                styles.serviceDescription,
                { color: theme.colors.gray['600'] },
              ]}
            >
              {booking.service?.description}
            </ThemedText>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceInfoItem}>
                <ThemedText
                  variant='caption'
                  style={{ color: theme.colors.gray['500'] }}
                >
                  Duration
                </ThemedText>
                <ThemedText variant='body'>
                  {booking.service?.duration} minutes
                </ThemedText>
              </View>
              <View style={styles.serviceInfoItem}>
                <ThemedText
                  variant='caption'
                  style={{ color: theme.colors.gray['500'] }}
                >
                  Price
                </ThemedText>
                <ThemedText variant='bodyLarge' style={{ fontWeight: '600' }}>
                  {formatCurrency(booking.totalAmount)}
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedCard>

        {/* Schedule Details */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Schedule
          </ThemedText>
          <View style={styles.scheduleDetails}>
            <ThemedText variant='bodyLarge' style={styles.scheduleDate}>
              {booking.scheduledDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </ThemedText>
            <ThemedText
              variant='body'
              style={{ color: theme.colors.gray['600'] }}
            >
              {booking.scheduledDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* Business Details */}
        {booking.business && (
          <ThemedCard style={styles.section}>
            <ThemedText variant='h4' style={styles.sectionTitle}>
              Business
            </ThemedText>
            <View style={styles.businessDetails}>
              <ThemedText variant='bodyLarge' style={styles.businessName}>
                {booking.business.name}
              </ThemedText>
              <ThemedText
                variant='body'
                style={[
                  styles.businessAddress,
                  { color: theme.colors.gray['600'] },
                ]}
              >
                {booking.business.address}
              </ThemedText>
              <ThemedButton
                title='Call Business'
                variant='outline'
                size='sm'
                onPress={handleContactBusiness}
                style={styles.contactButton}
              />
            </View>
          </ThemedCard>
        )}

        {/* Washer Details */}
        {booking.washer && (
          <ThemedCard style={styles.section}>
            <ThemedText variant='h4' style={styles.sectionTitle}>
              Assigned Washer
            </ThemedText>
            <View style={styles.washerDetails}>
              <ThemedText variant='bodyLarge' style={styles.washerName}>
                {booking.washer.name}
              </ThemedText>
              <ThemedText
                variant='body'
                style={[
                  styles.washerPhone,
                  { color: theme.colors.gray['600'] },
                ]}
              >
                {booking.washer.phone}
              </ThemedText>
              <ThemedButton
                title='Call Washer'
                variant='outline'
                size='sm'
                onPress={handleContactWasher}
                style={styles.contactButton}
              />
            </View>
          </ThemedCard>
        )}

        {/* Notes */}
        {booking.notes && (
          <ThemedCard style={styles.section}>
            <ThemedText variant='h4' style={styles.sectionTitle}>
              Special Instructions
            </ThemedText>
            <ThemedText
              variant='body'
              style={[styles.notes, { color: theme.colors.gray['600'] }]}
            >
              {booking.notes}
            </ThemedText>
          </ThemedCard>
        )}

        {/* Action Buttons */}
        {booking.status === 'pending' || booking.status === 'confirmed' ? (
          <View style={styles.actionButtons}>
            {booking.status === 'confirmed' && (
              <ThemedButton
                title='Reschedule'
                variant='outline'
                size='lg'
                onPress={handleRescheduleBooking}
                style={styles.actionButton}
              />
            )}
            <TouchableOpacity
              onPress={handleCancelBooking}
              style={[
                styles.actionButtonTouchable,
                { borderColor: theme.colors.error['500'] },
              ]}
            >
              <ThemedText style={{ color: theme.colors.error['500'] }}>
                Cancel Booking
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 40,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    minHeight: 20,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 2,
  },
  serviceDetails: {
    gap: 8,
  },
  serviceName: {
    fontWeight: '600',
  },
  serviceDescription: {
    lineHeight: 20,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceInfoItem: {
    flex: 1,
  },
  scheduleDetails: {
    gap: 4,
  },
  scheduleDate: {
    fontWeight: '600',
  },
  businessDetails: {
    gap: 8,
  },
  businessName: {
    fontWeight: '600',
  },
  businessAddress: {
    lineHeight: 20,
  },
  contactButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  washerDetails: {
    gap: 8,
  },
  washerName: {
    fontWeight: '600',
  },
  washerPhone: {
    lineHeight: 20,
  },
  notes: {
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonTouchable: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BookingDetailScreen;
