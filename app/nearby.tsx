import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { ThemedText, ThemedCard } from '@/components/ui';
import { BusinessCard } from '@/components/business';
import { Header } from '@/components/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNearbyBusinesses } from '@/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data for fallback
// Firebase data is loaded automatically by the useNearbyBusinesses hook

export default function NearbyBusinesses() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    nearbyBusinesses,
    loading,
    refreshing,
    error,
    userLocation,
    refreshNearbyBusinesses,
    getCurrentLocationAndLoad,
  } = useNearbyBusinesses();

  // Load user location and nearby businesses (handled by useNearbyBusinesses hook)
  useEffect(() => {
    // Hook automatically loads location and businesses
  }, []);

  // Load user location and nearby businesses (handled by useNearbyBusinesses hook)

  const handleRefresh = async () => {
    await refreshNearbyBusinesses();
  };

  const handleRetryLocation = async () => {
    await getCurrentLocationAndLoad();
  };

  // nearbyBusinesses already includes distance information from the hook

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='Nearby Car Washes'
          showBackButton
          onBackPress={() => router.back()}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary['500']}
            />
          }
        >
          {error && (
            <View style={styles.errorContainer}>
              <ThemedCard
                variant='elevated'
                style={[
                  styles.errorCard,
                  { backgroundColor: theme.colors.warning['50'] },
                ]}
              >
                <View style={styles.errorContent}>
                  <MaterialCommunityIcons
                    name='map-marker-off'
                    size={24}
                    color={theme.colors.warning['500']}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <ThemedText
                      variant='body'
                      style={{ color: theme.colors.warning['700'] }}
                    >
                      {error}
                    </ThemedText>
                    <ThemedText
                      variant='caption'
                      style={{
                        color: theme.colors.warning['600'],
                        marginTop: 4,
                      }}
                    >
                      Showing all available businesses
                    </ThemedText>
                  </View>
                  <TouchableOpacity onPress={handleRetryLocation}>
                    <MaterialCommunityIcons
                      name='refresh'
                      size={20}
                      color={theme.colors.warning['500']}
                    />
                  </TouchableOpacity>
                </View>
              </ThemedCard>
            </View>
          )}

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
                  <TouchableOpacity>
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

          <View style={styles.header}>
            <ThemedText variant='h3'>
              {userLocation ? 'Nearby Locations' : 'All Locations'}
            </ThemedText>
            {loading ? (
              <View style={styles.locationStatus}>
                <ActivityIndicator
                  size='small'
                  color={theme.colors.primary['500']}
                />
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginLeft: 8 }}
                >
                  Getting your location...
                </ThemedText>
              </View>
            ) : (
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='600'
                style={{ marginTop: 4 }}
              >
                {nearbyBusinesses.length} car wash
                {nearbyBusinesses.length !== 1 ? 'es' : ''} found
                {userLocation ? ' near you' : ''}
              </ThemedText>
            )}
          </View>

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size='large'
                color={theme.colors.primary['500']}
              />
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='600'
                style={{ marginTop: 12 }}
              >
                Loading nearby businesses...
              </ThemedText>
            </View>
          ) : nearbyBusinesses.length > 0 ? (
            nearbyBusinesses.map((business: any) => (
              <View key={business.id} style={styles.businessCard}>
                <BusinessCard
                  business={business}
                  onPress={() => router.push(`/business/${business.id}`)}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name='map-marker-off'
                size={48}
                color={theme.colors.gray['400']}
              />
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='600'
                style={{ marginTop: 12, textAlign: 'center' }}
              >
                {userLocation
                  ? 'No car washes found within 10km of your location'
                  : 'No businesses available at the moment'}
              </ThemedText>
              {!userLocation && (
                <TouchableOpacity
                  onPress={handleRetryLocation}
                  style={styles.retryButton}
                >
                  <ThemedText
                    variant='button'
                    style={{ color: theme.colors.primary['500'] }}
                  >
                    Enable Location
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  businessCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
