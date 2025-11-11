import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { Header } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils';
import { useBusinesses } from '@/hooks';
import { BusinessWithLocation } from '@/services/firebase/businessService';

// Firebase data is loaded automatically by the useBusinesses hook

export default function BusinessDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getBusinessById, error, clearError } = useBusinesses();

  const [business, setBusiness] = useState<BusinessWithLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessDetails();
  }, [id]);

  const loadBusinessDetails = async () => {
    try {
      setLoading(true);
      clearError();
      const businessData = await getBusinessById(id as string);

      if (businessData) {
        setBusiness(businessData);
      } else {
        Alert.alert('Error', 'Business not found', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load business details', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async () => {
    if (!business) return;

    const phoneNumber = business.phone.replace(/\s/g, '');
    const url = `tel:${phoneNumber}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleGetDirections = async () => {
    if (!business) return;

    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        business.address
      )}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open directions');
    }
  };

  const isBusinessOpen = (business: BusinessWithLocation): boolean => {
    const now = new Date();
    const dayOfWeek = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = business.operatingHours[dayOfWeek];
    if (!todayHours || !todayHours.isOpen) {
      return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='Business Details'
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary['500']} />
          <ThemedText
            variant='body'
            colorVariant='gray'
            colorShade='600'
            style={{ marginTop: 12 }}
          >
            Loading business details...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!business) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='Business Details'
          showBackButton
          onBackPress={() => router.back()}
        />
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
            style={{ marginTop: 12 }}
          >
            Business not found
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const isOpen = isBusinessOpen(business);

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title={business.name}
          showBackButton
          onBackPress={() => router.back()}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          {/* Business Info Card */}
          <ThemedCard variant='elevated' style={styles.card}>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <MaterialCommunityIcons
                  name='star'
                  size={20}
                  color={theme.colors.warning['500']}
                />
                <ThemedText variant='h4' style={{ marginLeft: 4 }}>
                  {business.rating?.toFixed(1) || 'N/A'}
                </ThemedText>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginLeft: 4 }}
                >
                  ({business.reviewCount} reviews)
                </ThemedText>
              </View>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isOpen
                        ? theme.colors.success['500']
                        : theme.colors.error['500'],
                    },
                  ]}
                />
                <ThemedText variant='caption' style={{ fontWeight: '600' }}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </ThemedText>
              </View>
            </View>

            <ThemedText
              variant='body'
              colorVariant='gray'
              colorShade='700'
              style={{ marginTop: 12 }}
            >
              {business.description}
            </ThemedText>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name='map-marker'
                size={20}
                color={theme.colors.primary['500']}
              />
              <ThemedText variant='body' style={{ marginLeft: 8, flex: 1 }}>
                {business.address}
              </ThemedText>
            </View>

            {business?.distance !== null &&
              business?.distance !== undefined && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name='map-marker-distance'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                  <ThemedText variant='body' style={{ marginLeft: 8 }}>
                    {business.distance} km away
                  </ThemedText>
                </View>
              )}

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name='phone'
                size={20}
                color={theme.colors.primary['500']}
              />
              <ThemedText variant='body' style={{ marginLeft: 8 }}>
                {business.phone}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name='email'
                size={20}
                color={theme.colors.primary['500']}
              />
              <ThemedText variant='body' style={{ marginLeft: 8 }}>
                {business.email}
              </ThemedText>
            </View>
          </ThemedCard>

          {/* Map View */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Location
            </ThemedText>
            <ThemedCard variant='elevated' style={styles.mapCard}>
              <View style={styles.mapPlaceholder}>
                <MaterialCommunityIcons
                  name='map-marker'
                  size={48}
                  color={theme.colors.primary['500']}
                />
                <ThemedText
                  variant='body'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginTop: 8, textAlign: 'center' }}
                >
                  {business.address}
                </ThemedText>
                {business?.distance !== null &&
                  business?.distance !== undefined && (
                    <ThemedText
                      variant='caption'
                      colorVariant='gray'
                      colorShade='500'
                      style={{ marginTop: 4 }}
                    >
                      {business.distance} km away
                    </ThemedText>
                  )}
              </View>
              <ThemedButton
                title='Open in Maps'
                variant='outline'
                onPress={handleGetDirections}
                icon={
                  <MaterialCommunityIcons
                    name='map'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
                style={{ marginTop: 12 }}
              />
            </ThemedCard>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Services
            </ThemedText>
            {business.services && business.services.length > 0 ? (
              business.services.map(service => (
                <ThemedCard
                  key={service.id}
                  variant='elevated'
                  style={styles.serviceCard}
                >
                  <View style={styles.serviceHeader}>
                    <View style={{ flex: 1 }}>
                      <ThemedText variant='h4'>{service.name}</ThemedText>
                      {service.description && (
                        <ThemedText
                          variant='caption'
                          colorVariant='gray'
                          colorShade='600'
                          style={{ marginTop: 2 }}
                        >
                          {service.description}
                        </ThemedText>
                      )}
                      <ThemedText
                        variant='caption'
                        colorVariant='gray'
                        colorShade='600'
                        style={{ marginTop: 4 }}
                      >
                        {service.duration} minutes
                      </ThemedText>
                    </View>
                    <ThemedText
                      variant='h4'
                      colorVariant='primary'
                      style={{ fontWeight: '700' }}
                    >
                      {formatCurrency(service.price)}
                    </ThemedText>
                  </View>
                  <ThemedButton
                    title='Book Now'
                    variant='primary'
                    size='sm'
                    onPress={() =>
                      router.push({
                        pathname: '/book-service',
                        params: {
                          businessId: business.id,
                          businessName: business.name,
                          serviceId: service.id,
                          serviceName: service.name,
                          servicePrice: service.price,
                        },
                      })
                    }
                    style={{ marginTop: 12 }}
                  />
                </ThemedCard>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText
                  variant='body'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ textAlign: 'center' }}
                >
                  No services available
                </ThemedText>
              </View>
            )}
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Hours of Operation
            </ThemedText>
            <ThemedCard variant='elevated' style={styles.card}>
              {Object.entries(business.operatingHours).map(([day, hours]) => (
                <View key={day} style={styles.hourRow}>
                  <ThemedText
                    variant='body'
                    style={{ textTransform: 'capitalize', flex: 1 }}
                  >
                    {day}
                  </ThemedText>
                  <ThemedText
                    variant='body'
                    colorVariant='gray'
                    colorShade='700'
                    style={{ fontWeight: '600' }}
                  >
                    {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </ThemedText>
                </View>
              ))}
            </ThemedCard>
          </View>

          <View style={styles.actionButtons}>
            <ThemedButton
              title='Call Business'
              variant='outline'
              onPress={handleCall}
              icon={
                <MaterialCommunityIcons
                  name='phone'
                  size={20}
                  color={theme.colors.primary['500']}
                />
              }
              style={{ flex: 1, marginRight: 8 }}
            />
            <ThemedButton
              title='Get Directions'
              variant='primary'
              onPress={handleGetDirections}
              icon={
                <MaterialCommunityIcons
                  name='directions'
                  size={20}
                  color='#FFFFFF'
                />
              }
              style={{ flex: 1, marginLeft: 8 }}
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
    margin: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  serviceCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  mapCard: {
    marginHorizontal: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorCard: {
    padding: 12,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
