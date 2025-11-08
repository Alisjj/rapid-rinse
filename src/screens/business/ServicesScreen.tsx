import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ThemedText, SearchBar } from '../../components/ui';
import { Header } from '../../components/navigation';
import { ServiceCard } from '../../components/business';
import { useServices } from '../../hooks';
import { Service } from '../../types';

type ServicesScreenRouteProp = RouteProp<
  { Services: { businessId?: string; category?: string } },
  'Services'
>;

export const ServicesScreen: React.FC = () => {
  const route = useRoute<ServicesScreenRouteProp>();
  const { businessId, category } = route.params || {};
  const { services, loading, searchServices } = useServices();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = services;

    if (businessId) {
      filtered = filtered.filter(service => service.businessId === businessId);
    }

    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, businessId, category, searchQuery]);

  const renderServiceItem = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onPress={() => {
        // Navigate to service booking
      }}
      onBookPress={() => {
        // Navigate to booking screen
      }}
      style={styles.serviceCard}
    />
  );

  const getScreenTitle = () => {
    if (category) return `${category} Services`;
    if (businessId) return 'Available Services';
    return 'All Services';
  };

  return (
    <View style={styles.container}>
      <Header title={getScreenTitle()} showBack />

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder='Search services...'
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={query => setSearchQuery(query)}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText variant='body'>Loading services...</ThemedText>
        </View>
      ) : filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText variant='h3'>No services found</ThemedText>
          <ThemedText variant='body' style={styles.emptyText}>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'No services available at this time'}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  serviceCard: {
    marginBottom: 12,
  },
});
