import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText } from '@/components/ui';
import { BusinessCard } from '@/components/business';
import { Header } from '@/components/navigation';

// Mock data - expanded list
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
  {
    id: '3',
    name: 'Eco Clean Car Wash',
    description: 'Environmentally friendly car wash',
    address: '789 Green Blvd, City, State',
    phone: '+1234567892',
    email: 'info@ecoclean.com',
    ownerId: '3',
    services: [],
    operatingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.6,
    reviewCount: 89,
    distance: 1.5,
    isOpen: true,
  },
  {
    id: '4',
    name: 'Shine & Go',
    description: 'Quick service, great results',
    address: '321 Speed Way, City, State',
    phone: '+1234567893',
    email: 'info@shineandgo.com',
    ownerId: '4',
    services: [],
    operatingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.3,
    reviewCount: 67,
    distance: 2.1,
    isOpen: false,
  },
  {
    id: '5',
    name: 'Deluxe Detail Center',
    description: 'Premium detailing services',
    address: '555 Luxury Lane, City, State',
    phone: '+1234567894',
    email: 'info@deluxedetail.com',
    ownerId: '5',
    services: [],
    operatingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.9,
    reviewCount: 342,
    distance: 2.8,
    isOpen: true,
  },
];

export default function NearbyBusinesses() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title='Nearby Car Washes'
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText variant='h3'>All Nearby Locations</ThemedText>
          <ThemedText
            variant='body'
            colorVariant='gray'
            colorShade='600'
            style={{ marginTop: 4 }}
          >
            {mockBusinesses.length} car washes found near you
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
  businessCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
