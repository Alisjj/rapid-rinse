import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { Header } from '../../components/navigation';
import { useBusinesses } from '../../hooks';

type BusinessDetailScreenRouteProp = RouteProp<
  { BusinessDetail: { businessId: string } },
  'BusinessDetail'
>;

export const BusinessDetailScreen: React.FC = () => {
  const route = useRoute<BusinessDetailScreenRouteProp>();
  const { businessId } = route.params;
  const { getBusinessById } = useBusinesses();

  const business = getBusinessById(businessId);

  if (!business) {
    return (
      <View style={styles.container}>
        <Header title='Business Details' showBack />
        <View style={styles.errorContainer}>
          <ThemedText variant='h3'>Business not found</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={business.name} showBack />
      <ScrollView style={styles.content}>
        <ThemedCard style={styles.businessCard}>
          <ThemedText variant='h2'>{business.name}</ThemedText>
          <ThemedText variant='body' style={styles.description}>
            {business.description}
          </ThemedText>

          <View style={styles.infoSection}>
            <ThemedText variant='h3'>Contact Information</ThemedText>
            <ThemedText variant='body'>Address: {business.address}</ThemedText>
            <ThemedText variant='body'>Phone: {business.phone}</ThemedText>
          </View>

          <View style={styles.servicesSection}>
            <ThemedText variant='h3'>Services</ThemedText>
            {business.services?.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <ThemedText variant='body'>{service.name}</ThemedText>
                <ThemedText variant='caption'>${service.price}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <ThemedButton
              title='Book Service'
              onPress={() => {
                // Navigate to booking screen
              }}
              style={styles.bookButton}
            />
            <ThemedButton
              title='View on Map'
              variant='outline'
              onPress={() => {
                // Navigate to map view
              }}
              style={styles.mapButton}
            />
          </View>
        </ThemedCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessCard: {
    padding: 20,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  servicesSection: {
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bookButton: {
    flex: 1,
  },
  mapButton: {
    flex: 1,
  },
});
