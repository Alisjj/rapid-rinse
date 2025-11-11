import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import {
  ThemedText,
  ThemedCard,
  ThemedButton,
  ThemedTextInput,
} from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookService() {
  const { theme } = useTheme();
  const router = useRouter();
  const { businessId, businessName, serviceId, serviceName, servicePrice } =
    useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Mock user vehicles
  const savedVehicles = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      color: 'Silver',
      licensePlate: 'ABC-1234',
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: '2021',
      color: 'Black',
      licensePlate: 'XYZ-5678',
    },
  ];

  // Vehicle selection
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    savedVehicles[0]?.id || ''
  );
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  // New vehicle info (for adding)
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');

  const selectedVehicle = savedVehicles.find(v => v.id === selectedVehicleId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatDateLong = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleBooking = () => {
    // Validate form
    if (!selectedVehicleId && !showAddVehicle) {
      Alert.alert('Missing Information', 'Please select a vehicle.');
      return;
    }

    if (
      showAddVehicle &&
      (!vehicleMake || !vehicleModel || !vehicleYear || !licensePlate)
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all vehicle information fields.'
      );
      return;
    }

    // Get vehicle info
    const vehicleInfo = showAddVehicle
      ? `${vehicleYear} ${vehicleMake} ${vehicleModel}`
      : `${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}`;

    // Create booking
    const bookingId = Math.random().toString(36).substring(7);

    Alert.alert(
      'Booking Confirmed!',
      `Your ${serviceName} has been booked for ${formatDateLong(selectedDate)} at ${formatTime(selectedTime)}.\n\nVehicle: ${vehicleInfo}\nConfirmation Code: RR-${bookingId.toUpperCase()}`,
      [
        {
          text: 'View Booking',
          onPress: () => router.push('/bookings'),
        },
        {
          text: 'Done',
          onPress: () => router.push('/'),
        },
      ]
    );
  };

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='Book Service'
          showBackButton
          onBackPress={() => router.back()}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Summary */}
          <ThemedCard variant='elevated' style={styles.card}>
            <ThemedText variant='h3' style={{ marginBottom: 8 }}>
              {serviceName}
            </ThemedText>
            <ThemedText variant='body' colorVariant='gray' colorShade='600'>
              {businessName}
            </ThemedText>
            <View style={styles.priceRow}>
              <ThemedText
                variant='h4'
                colorVariant='primary'
                style={{ fontWeight: '700' }}
              >
                ${servicePrice}
              </ThemedText>
            </View>
          </ThemedCard>

          {/* Date & Time Selection */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Select Date & Time
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.dateTimeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                    style={{ marginBottom: 8 }}
                  >
                    Date
                  </ThemedText>
                  <ThemedButton
                    title={formatDate(selectedDate)}
                    variant='outline'
                    onPress={() => setShowDatePicker(true)}
                    icon={
                      <MaterialCommunityIcons
                        name='calendar'
                        size={20}
                        color={theme.colors.primary['500']}
                      />
                    }
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                    style={{ marginBottom: 8 }}
                  >
                    Time
                  </ThemedText>
                  <ThemedButton
                    title={formatTime(selectedTime)}
                    variant='outline'
                    onPress={() => setShowTimePicker(true)}
                    icon={
                      <MaterialCommunityIcons
                        name='clock'
                        size={20}
                        color={theme.colors.primary['500']}
                      />
                    }
                  />
                </View>
              </View>

              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode='date'
                    display='spinner'
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    style={styles.picker}
                  />
                  <ThemedButton
                    title='Done'
                    variant='primary'
                    size='sm'
                    onPress={() => setShowDatePicker(false)}
                    style={{ marginTop: 12 }}
                  />
                </View>
              )}

              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={selectedTime}
                    mode='time'
                    display='spinner'
                    onChange={handleTimeChange}
                    style={styles.picker}
                  />
                  <ThemedButton
                    title='Done'
                    variant='primary'
                    size='sm'
                    onPress={() => setShowTimePicker(false)}
                    style={{ marginTop: 12 }}
                  />
                </View>
              )}
            </ThemedCard>
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Select Vehicle
            </ThemedText>

            {!showAddVehicle ? (
              <ThemedCard variant='elevated' style={styles.card}>
                {savedVehicles.map(vehicle => (
                  <TouchableOpacity
                    key={vehicle.id}
                    onPress={() => setSelectedVehicleId(vehicle.id)}
                    style={[
                      styles.vehicleOption,
                      selectedVehicleId === vehicle.id && {
                        backgroundColor: theme.colors.primary['50'],
                        borderColor: theme.colors.primary['500'],
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name='car'
                      size={32}
                      color={
                        selectedVehicleId === vehicle.id
                          ? theme.colors.primary['500']
                          : theme.colors.gray['400']
                      }
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <ThemedText variant='body' style={{ fontWeight: '600' }}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </ThemedText>
                      <ThemedText
                        variant='caption'
                        colorVariant='gray'
                        colorShade='600'
                      >
                        {vehicle.color} • {vehicle.licensePlate}
                      </ThemedText>
                    </View>
                    {selectedVehicleId === vehicle.id && (
                      <MaterialCommunityIcons
                        name='check-circle'
                        size={24}
                        color={theme.colors.primary['500']}
                      />
                    )}
                  </TouchableOpacity>
                ))}

                <ThemedButton
                  title='Add New Vehicle'
                  variant='ghost'
                  onPress={() => setShowAddVehicle(true)}
                  icon={
                    <MaterialCommunityIcons
                      name='plus'
                      size={20}
                      color={theme.colors.primary['500']}
                    />
                  }
                  style={{ marginTop: 12 }}
                />
              </ThemedCard>
            ) : (
              <ThemedCard variant='elevated' style={styles.card}>
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <ThemedText
                      variant='caption'
                      colorVariant='gray'
                      colorShade='600'
                      style={{ marginBottom: 4 }}
                    >
                      Make *
                    </ThemedText>
                    <ThemedTextInput
                      placeholder='Toyota'
                      value={vehicleMake}
                      onChangeText={setVehicleMake}
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText
                      variant='caption'
                      colorVariant='gray'
                      colorShade='600'
                      style={{ marginBottom: 4 }}
                    >
                      Model *
                    </ThemedText>
                    <ThemedTextInput
                      placeholder='Camry'
                      value={vehicleModel}
                      onChangeText={setVehicleModel}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <ThemedText
                      variant='caption'
                      colorVariant='gray'
                      colorShade='600'
                      style={{ marginBottom: 4 }}
                    >
                      Year *
                    </ThemedText>
                    <ThemedTextInput
                      placeholder='2020'
                      value={vehicleYear}
                      onChangeText={setVehicleYear}
                      keyboardType='numeric'
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText
                      variant='caption'
                      colorVariant='gray'
                      colorShade='600'
                      style={{ marginBottom: 4 }}
                    >
                      Color
                    </ThemedText>
                    <ThemedTextInput
                      placeholder='Silver'
                      value={vehicleColor}
                      onChangeText={setVehicleColor}
                    />
                  </View>
                </View>

                <View style={{ marginTop: 12 }}>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                    style={{ marginBottom: 4 }}
                  >
                    License Plate *
                  </ThemedText>
                  <ThemedTextInput
                    placeholder='ABC-1234'
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                    autoCapitalize='characters'
                  />
                </View>

                <ThemedButton
                  title='Use Saved Vehicle'
                  variant='ghost'
                  onPress={() => {
                    setShowAddVehicle(false);
                    setSelectedVehicleId(savedVehicles[0]?.id || '');
                  }}
                  icon={
                    <MaterialCommunityIcons
                      name='arrow-left'
                      size={20}
                      color={theme.colors.primary['500']}
                    />
                  }
                  style={{ marginTop: 12 }}
                />
              </ThemedCard>
            )}
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Special Instructions (Optional)
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <ThemedTextInput
                placeholder='Any special requests or instructions...'
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: 'top' }}
              />
            </ThemedCard>
          </View>

          {/* Booking Summary */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Booking Summary
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.summaryRow}>
                <ThemedText variant='body' colorVariant='gray' colorShade='600'>
                  Service
                </ThemedText>
                <ThemedText variant='body' style={{ fontWeight: '600' }}>
                  {serviceName}
                </ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <ThemedText variant='body' colorVariant='gray' colorShade='600'>
                  Date
                </ThemedText>
                <ThemedText variant='body' style={{ fontWeight: '600' }}>
                  {formatDate(selectedDate)}
                </ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <ThemedText variant='body' colorVariant='gray' colorShade='600'>
                  Time
                </ThemedText>
                <ThemedText variant='body' style={{ fontWeight: '600' }}>
                  {formatTime(selectedTime)}
                </ThemedText>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <ThemedText variant='h4'>Total</ThemedText>
                <ThemedText
                  variant='h4'
                  colorVariant='primary'
                  style={{ fontWeight: '700' }}
                >
                  ${servicePrice}
                </ThemedText>
              </View>
            </ThemedCard>
          </View>

          {/* Book Button */}
          <View style={styles.actionSection}>
            <ThemedButton
              title='Confirm Booking'
              variant='primary'
              onPress={handleBooking}
              icon={
                <MaterialCommunityIcons
                  name='check-circle'
                  size={20}
                  color='#FFFFFF'
                />
              }
              style={{ marginBottom: 24 }}
            />
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
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  priceRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formField: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#D1D5DB',
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
  },
  pickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  picker: {
    width: '100%',
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
});
