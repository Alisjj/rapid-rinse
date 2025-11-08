import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock business data
const mockBusinessDetails: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Quick Wash Express',
    description:
      'Fast and reliable car wash service with state-of-the-art equipment',
    address: '123 Main St, City, State 12345',
    phone: '+1 (234) 567-8900',
    email: 'info@quickwash.com',
    rating: 4.5,
    reviewCount: 128,
    distance: 0.8,
    isOpen: true,
    hours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    services: [
      { id: '1', name: 'Express Wash', price: 15.99, duration: 15 },
      { id: '2', name: 'Standard Wash', price: 25.99, duration: 30 },
      { id: '3', name: 'Premium Wash', price: 35.99, duration: 45 },
      { id: '4', name: 'Full Detail', price: 89.99, duration: 120 },
    ],
  },
  '2': {
    id: '2',
    name: 'Premium Auto Spa',
    description:
      'Luxury car detailing and wash services for discerning customers',
    address: '456 Oak Ave, City, State 12345',
    phone: '+1 (234) 567-8901',
    email: 'info@premiumspa.com',
    rating: 4.8,
    reviewCount: 256,
    distance: 1.2,
    isOpen: true,
    hours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: 'Closed',
    },
    services: [
      { id: '1', name: 'Luxury Wash', price: 45.99, duration: 45 },
      { id: '2', name: 'Premium Detail', price: 129.99, duration: 180 },
      { id: '3', name: 'Interior Deep Clean', price: 79.99, duration: 90 },
      { id: '4', name: 'Paint Protection', price: 199.99, duration: 240 },
    ],
  },
};

export default function BusinessDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const business =
    mockBusinessDetails[id as string] || mockBusinessDetails['1'];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={business.name}
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                {business.rating}
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
                    backgroundColor: business.isOpen
                      ? theme.colors.success['500']
                      : theme.colors.error['500'],
                  },
                ]}
              />
              <ThemedText variant='caption' style={{ fontWeight: '600' }}>
                {business.isOpen ? 'Open Now' : 'Closed'}
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
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='500'
                style={{ marginTop: 4 }}
              >
                {business.distance} km away
              </ThemedText>
            </View>
            <ThemedButton
              title='Open in Maps'
              variant='outline'
              onPress={() => console.log('Open maps for:', business.address)}
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
          {business.services.map((service: any) => (
            <ThemedCard
              key={service.id}
              variant='elevated'
              style={styles.serviceCard}
            >
              <View style={styles.serviceHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant='h4'>{service.name}</ThemedText>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                    style={{ marginTop: 2 }}
                  >
                    {service.duration} minutes
                  </ThemedText>
                </View>
                <ThemedText
                  variant='h4'
                  colorVariant='primary'
                  style={{ fontWeight: '700' }}
                >
                  ${service.price}
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
          ))}
        </View>

        {/* Hours */}
        <View style={styles.section}>
          <ThemedText variant='h3' style={styles.sectionTitle}>
            Hours of Operation
          </ThemedText>
          <ThemedCard variant='elevated' style={styles.card}>
            {Object.entries(business.hours).map(([day, hours]) => (
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
                  {String(hours)}
                </ThemedText>
              </View>
            ))}
          </ThemedCard>
        </View>

        <View style={styles.actionButtons}>
          <ThemedButton
            title='Call Business'
            variant='outline'
            onPress={() => console.log('Call:', business.phone)}
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
            onPress={() => console.log('Directions to:', business.address)}
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
});
