import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import enhanced components
import {
  ThemedText,
  ThemedButton,
  ThemedCard,
  ThemedTextInput,
  HelperText,
} from '@/components/ui';
import { Header } from '@/components/navigation';

// Import types and theme
import { BookingStackParamList, Service } from '@/types';
import { BusinessWithLocation } from '@/services/firebase/businessService';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils';

// Import Firebase hooks
import {
  useAuth,
  useBusinesses,
  useServices,
  useBookingCreation,
} from '@/hooks';

type BookServiceScreenNavigationProp = NativeStackNavigationProp<
  BookingStackParamList,
  'BookService'
>;
type BookServiceScreenRouteProp = RouteProp<
  BookingStackParamList,
  'BookService'
>;

interface BookServiceScreenProps {
  navigation: BookServiceScreenNavigationProp;
  route: BookServiceScreenRouteProp;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
}

interface BookingFormData {
  selectedVehicle: Vehicle | null;
  scheduledDate: Date;
  notes: string;
}

const BookServiceScreen: React.FC<BookServiceScreenProps> = ({
  navigation,
  route,
}) => {
  const { businessId, serviceId } = route.params;
  const { theme } = useTheme();

  // Firebase hooks
  const { user } = useAuth();
  const { getBusinessById } = useBusinesses();
  const {
    loadServices,
    getServiceById,
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();
  const {
    createBooking,
    updateBookingData,
    loading: bookingLoading,
    error: bookingError,
  } = useBookingCreation(user?.id || '');

  // State management
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [business, setBusiness] = useState<BusinessWithLocation | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    selectedVehicle: null,
    scheduledDate: new Date(Date.now() + 3600000), // 1 hour from now
    notes: '',
  });

  // Load data on mount
  React.useEffect(() => {
    loadData();
  }, [businessId, serviceId]);

  const loadData = async () => {
    try {
      // Load business
      const businessData = await getBusinessById(businessId);
      setBusiness(businessData);

      // Load services for this business
      await loadServices(businessId);

      // If serviceId is provided, get the specific service
      if (serviceId) {
        const service = getServiceById(serviceId);
        setServiceData(service);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Load service and business data
        const [serviceData, businessData] = await Promise.all([
          serviceId ? getServiceById(serviceId) : null,
          getBusinessById(businessId),
        ]);

        if (serviceData) {
          setServiceData(serviceData);
        }

        if (businessData) {
          setBusiness(businessData);
        }

        // For now, use mock vehicles - this should be replaced with user vehicles from Firebase
        const mockVehicles: Vehicle[] = [
          {
            id: '1',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            plateNumber: 'ABC123',
            color: 'Silver',
          },
          {
            id: '2',
            make: 'Honda',
            model: 'Civic',
            year: 2019,
            plateNumber: 'XYZ789',
            color: 'Blue',
          },
        ];

        setVehicles(mockVehicles);

        // Auto-select first vehicle if available
        if (mockVehicles.length > 0) {
          setFormData(prev => ({
            ...prev,
            selectedVehicle: mockVehicles[0],
          }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert(
          'Error',
          'Failed to load service details. Please try again.'
        );
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [businessId, serviceId]);

  // Handle date/time picker changes
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, scheduledDate: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(formData.scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData(prev => ({ ...prev, scheduledDate: newDate }));
    }
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setFormData(prev => ({ ...prev, selectedVehicle: vehicle }));
  };

  // Handle booking creation
  const handleBookService = async () => {
    if (!formData.selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle for the service.');
      return;
    }

    if (formData.scheduledDate <= new Date()) {
      Alert.alert('Error', 'Please select a future date and time.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to book a service.');
      return;
    }

    setIsBooking(true);

    try {
      console.log('handleBookService: Starting booking process');

      // Update booking data in the hook
      updateBookingData({
        customerId: user.id,
        businessId: businessId,
        serviceId: serviceId,
        scheduledDate: formData.scheduledDate,
        vehicleInfo: {
          id: formData.selectedVehicle.id,
          make: formData.selectedVehicle.make,
          model: formData.selectedVehicle.model,
          year: formData.selectedVehicle.year,
          plateNumber: formData.selectedVehicle.plateNumber,
          color: formData.selectedVehicle.color,
        },
        notes: formData.notes,
      });

      console.log('handleBookService: Calling createBooking');
      const bookingId = await createBooking();

      console.log('handleBookService: Booking created with ID:', bookingId);

      Alert.alert(
        'Booking Confirmed!',
        'Your car wash service has been booked successfully.',
        [
          {
            text: 'View Booking',
            onPress: () => {
              navigation.navigate('BookingDetails', { bookingId });
            },
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('handleBookService: Error creating booking:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to create booking. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Handle add vehicle
  const handleAddVehicle = () => {
    // Navigate to profile stack for adding vehicle
    navigation.navigate('Profile' as any, { screen: 'AddVehicle' });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Book Service' />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant='body'
            style={{ color: theme.colors.gray['500'] }}
          >
            Loading service details...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!serviceData || !business) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title='Book Service' />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant='body'
            style={{ color: theme.colors.gray['500'] }}
          >
            Service not found
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Book Service' />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <ThemedCard style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <ThemedText variant='h3' style={styles.serviceName}>
              {serviceData.name}
            </ThemedText>
            <ThemedText
              variant='h4'
              style={[
                styles.servicePrice,
                { color: theme.colors.primary['600'] },
              ]}
            >
              {formatCurrency(serviceData.price)}
            </ThemedText>
          </View>
          <ThemedText
            variant='body'
            style={[
              styles.serviceDescription,
              { color: theme.colors.gray['600'] },
            ]}
          >
            {serviceData.description}
          </ThemedText>
          <View style={styles.serviceMeta}>
            <View style={styles.serviceMetaItem}>
              <ThemedText
                variant='caption'
                style={{ color: theme.colors.gray['500'] }}
              >
                Duration
              </ThemedText>
              <ThemedText variant='body'>
                {serviceData.duration} minutes
              </ThemedText>
            </View>
            <View style={styles.serviceMetaItem}>
              <ThemedText
                variant='caption'
                style={{ color: theme.colors.gray['500'] }}
              >
                Category
              </ThemedText>
              <ThemedText
                variant='body'
                style={{ textTransform: 'capitalize' }}
              >
                {serviceData.category}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        {/* Business Info */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Service Provider
          </ThemedText>
          <View style={styles.businessInfo}>
            <ThemedText variant='bodyLarge' style={styles.businessName}>
              {business.name}
            </ThemedText>
            <ThemedText
              variant='body'
              style={[
                styles.businessAddress,
                { color: theme.colors.gray['600'] },
              ]}
            >
              {business.address}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* Vehicle Selection */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Select Vehicle
          </ThemedText>
          {vehicles.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.vehicleScroll}
            >
              {vehicles.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.id}
                  onPress={() => handleVehicleSelect(vehicle)}
                >
                  <ThemedCard
                    style={[
                      styles.vehicleCard,
                      {
                        borderColor:
                          formData.selectedVehicle?.id === vehicle.id
                            ? theme.colors.primary['500']
                            : theme.colors.gray['200'],
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <ThemedText variant='bodyLarge' style={styles.vehicleName}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </ThemedText>
                    <ThemedText
                      variant='body'
                      style={[
                        styles.vehicleDetails,
                        { color: theme.colors.gray['600'] },
                      ]}
                    >
                      {vehicle.color} • {vehicle.plateNumber}
                    </ThemedText>
                  </ThemedCard>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={handleAddVehicle}>
                <ThemedCard style={styles.addVehicleCard}>
                  <ThemedText
                    variant='body'
                    style={[
                      styles.addVehicleText,
                      { color: theme.colors.primary['500'] },
                    ]}
                  >
                    + Add Vehicle
                  </ThemedText>
                </ThemedCard>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.noVehiclesContainer}>
              <ThemedText
                variant='body'
                style={[
                  styles.noVehiclesText,
                  { color: theme.colors.gray['500'] },
                ]}
              >
                No vehicles found. Add a vehicle to continue.
              </ThemedText>
              <ThemedButton
                title='Add Vehicle'
                variant='outline'
                size='md'
                onPress={handleAddVehicle}
                style={styles.addVehicleButton}
              />
            </View>
          )}
        </ThemedCard>

        {/* Date & Time Selection */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Select Date & Time
          </ThemedText>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateTimeButton}
            >
              <ThemedText variant='body'>
                {formData.scheduledDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.dateTimeButton}
            >
              <ThemedText variant='body'>
                {formData.scheduledDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.scheduledDate}
              mode='date'
              display='default'
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={formData.scheduledDate}
              mode='time'
              display='default'
              onChange={handleTimeChange}
            />
          )}
        </ThemedCard>

        {/* Special Instructions */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Special Instructions (Optional)
          </ThemedText>
          <ThemedTextInput
            placeholder='Any special requests or instructions...'
            value={formData.notes}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, notes: text }))
            }
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
          <HelperText
            text='Let us know if you have any specific requirements for your car wash service.'
            type='default'
          />
        </ThemedCard>

        {/* Booking Summary */}
        <ThemedCard style={styles.section}>
          <ThemedText variant='h4' style={styles.sectionTitle}>
            Booking Summary
          </ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText variant='body'>Service</ThemedText>
            <ThemedText variant='body'>{serviceData.name}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText variant='body'>Vehicle</ThemedText>
            <ThemedText variant='body'>
              {formData.selectedVehicle
                ? `${formData.selectedVehicle.year} ${formData.selectedVehicle.make} ${formData.selectedVehicle.model}`
                : 'Not selected'}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText variant='body'>Date & Time</ThemedText>
            <ThemedText variant='body'>
              {formData.scheduledDate.toLocaleDateString()} at{' '}
              {formData.scheduledDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText variant='bodyLarge' style={{ fontWeight: '600' }}>
              Total
            </ThemedText>
            <ThemedText
              variant='bodyLarge'
              style={{ fontWeight: '600', color: theme.colors.primary['600'] }}
            >
              {formatCurrency(serviceData.price)}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* Book Button */}
        <View style={styles.bookButtonContainer}>
          <ThemedButton
            title={isBooking ? 'Creating Booking...' : 'Book Service'}
            variant='primary'
            size='lg'
            onPress={handleBookService}
            loading={isBooking}
            disabled={isBooking || !formData.selectedVehicle}
            style={styles.bookButton}
          />
        </View>
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
  serviceHeader: {
    margin: 16,
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceName: {
    flex: 1,
    marginRight: 16,
  },
  servicePrice: {
    fontWeight: '700',
  },
  serviceDescription: {
    lineHeight: 22,
    marginBottom: 16,
  },
  serviceMeta: {
    flexDirection: 'row',
    gap: 32,
  },
  serviceMetaItem: {
    gap: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  businessInfo: {
    gap: 4,
  },
  businessName: {
    fontWeight: '600',
  },
  businessAddress: {
    lineHeight: 20,
  },
  vehicleScroll: {
    marginHorizontal: -8,
  },
  vehicleCard: {
    minWidth: 200,
    marginHorizontal: 8,
    padding: 16,
  },
  vehicleName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
  },
  addVehicleCard: {
    minWidth: 120,
    marginHorizontal: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVehicleText: {
    fontWeight: '600',
  },
  noVehiclesContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  noVehiclesText: {
    textAlign: 'center',
  },
  addVehicleButton: {
    alignSelf: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
  },
  notesInput: {
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  bookButtonContainer: {
    padding: 16,
  },
  bookButton: {
    width: '100%',
  },
});

export default BookServiceScreen;
