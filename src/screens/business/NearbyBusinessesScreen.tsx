import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { ThemedText } from '../../components/ui';
import { Header } from '../../components/navigation';
import { BusinessCard } from '../../components/business';
import { MapViewComponent } from '../../components/map';
import { useNearbyBusinesses, useMap } from '../../hooks';
import { BusinessWithLocation } from '../../services/firebase/businessService';

export const NearbyBusinessesScreen: React.FC = () => {
  const { nearbyBusinesses, loading, refreshNearbyBusinesses } =
    useNearbyBusinesses();
  const { userLocation } = useMap();
  const [showMap, setShowMap] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshNearbyBusinesses();
    } finally {
      setRefreshing(false);
    }
  };

  const renderBusinessItem = ({ item }: { item: BusinessWithLocation }) => (
    <View style={styles.businessCard}>
      <BusinessCard
        business={item}
        onPress={() => {
          // Navigate to business detail
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title='Nearby Businesses'
        showBackButton={true}
        onBackPress={() => {
          // Navigate back
        }}
        rightIcon={showMap ? 'format-list-bulleted' : 'map'}
        onRightPress={() => setShowMap(!showMap)}
      />

      {showMap ? (
        <MapViewComponent
          userLocation={userLocation || undefined}
          onMarkerPress={marker => {
            // Navigate to business detail
          }}
        />
      ) : (
        <>
          {loading && nearbyBusinesses.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ThemedText variant='body'>
                Finding nearby businesses...
              </ThemedText>
            </View>
          ) : nearbyBusinesses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText variant='h3'>No nearby businesses</ThemedText>
              <ThemedText variant='body' style={styles.emptyText}>
                Try expanding your search radius or check your location settings
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={nearbyBusinesses}
              renderItem={renderBusinessItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  businessCard: {
    marginBottom: 12,
  },
});
