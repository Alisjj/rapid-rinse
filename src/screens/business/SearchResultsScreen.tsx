import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ThemedText } from '../../components/ui';
import { Header } from '../../components/navigation';
import { BusinessCard } from '../../components/business';
import { useBusinesses } from '../../hooks';
import { BusinessWithLocation } from '../../services/firebase/businessService';

type SearchResultsScreenRouteProp = RouteProp<
  { SearchResults: { query: string; location?: string } },
  'SearchResults'
>;

export const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsScreenRouteProp>();
  const { query, location } = route.params;
  const { searchBusinesses, businesses, loading } = useBusinesses();

  useEffect(() => {
    const performSearch = async () => {
      try {
        await searchBusinesses(query);
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    performSearch();
  }, [query, location, searchBusinesses]);

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
        title={`Search Results for "${query}"`}
        showBackButton={true}
        onBackPress={() => {}}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText variant='body'>Searching...</ThemedText>
        </View>
      ) : businesses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText variant='h3'>No results found</ThemedText>
          <ThemedText variant='body' style={styles.emptyText}>
            Try adjusting your search terms or location
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
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
