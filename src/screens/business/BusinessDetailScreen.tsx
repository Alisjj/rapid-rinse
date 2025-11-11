import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { Header } from '../../components/navigation';
import { useBusinesses } from '../../hooks';
import { formatCurrency } from '../../utils';
import { BusinessWithLocation } from '../../services/firebase/businessService';

type BusinessDetailScreenRouteProp = RouteProp<
  { BusinessDetail: { businessId: string } },
  'BusinessDetail'
>;

export const BusinessDetailScreen: React.FC = () => {
  const route = useRoute<BusinessDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { businessId } = route.params;
  const { getBusinessById } = useBusinesses();

  const [business, setBusiness] = useState<BusinessWithLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const businessData = await getBusinessById(businessId);
      setBusiness(businessData);
    } catch (error) {
      console.error('Failed to load business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title='Business Details'
          leftIcon='arrow-left'
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </View>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <Header
          title='Business Details'
          leftIcon='arrow-left'
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <ThemedText variant='h3'>Business not found</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={business.name}
        leftIcon='arrow-left'
        onLeftPress={() => navigation.goBack()}
      />
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
                <ThemedText variant='caption'>
                  {formatCurrency(service.price)}
                </ThemedText>
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
  loadingContainer: {
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
