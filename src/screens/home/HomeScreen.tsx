import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import { Header } from '@/components/navigation';
import { SearchBar } from '@/components/ui';
import { BusinessCard, BookingCard } from '@/components/business';
import { ThemedText, ThemedCard } from '@/components/ui';

// Import types and theme
import { HomeStackParamList, Business, Booking, User } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { fetchUserData, fetchRecentBookings, fetchNearbyBusinesses } from '@/services/api';
// import { initializeLocation } from '@/services/location';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;
type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'HomeScreen'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

// Error Boundary Component
class HomeScreenErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <ThemedText
            variant="h3"
            style={{ textAlign: 'center', marginBottom: 16 }}
          >
            Something went wrong
          </ThemedText>
          <ThemedText
            variant="body"
            style={{ textAlign: 'center', marginBottom: 20 }}
          >
            We're sorry, but something unexpected happened. Please try
            refreshing the screen.
          </ThemedText>
        </View>
      );
    }

    return this.props.children;
  }
}

// Welcome Banner Component
const WelcomeBanner: React.FC<{ userName?: string }> = ({ userName }) => {
  const { theme } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ThemedCard
      variant="elevated"
      style={[
        styles.welcomeBanner,
        { backgroundColor: theme.colors.primary['500'] },
      ]}
    >
      <View style={styles.welcomeContent}>
        <ThemedText
          variant="bodyLarge"
          style={[styles.greeting, { color: theme.colors.gray['50'] }]}
        >
          Hi {userName || 'there'},
        </ThemedText>
        <ThemedText
          variant="h3"
          style={[styles.welcomeMessage, { color: theme.colors.gray['50'] }]}
        >
          {getGreeting()}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={[styles.welcomeSubtext, { color: theme.colors.gray['100'] }]}
        >
          Ready to get your car washed?
        </ThemedText>
      </View>
    </ThemedCard>
  );
};

// Nearby Businesses Section
const NearbyBusinessesSection: React.FC<{
  businesses: Business[];
  onViewAll: () => void;
  onBusinessPress: (business: Business) => void;
  loading: boolean;
}> = ({ businesses, onViewAll, onBusinessPress, loading }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="h4">Nearby Car Washes</ThemedText>
        <ThemedText
          variant="button"
          style={{ color: theme.colors.primary['500'] }}
          onPress={onViewAll}
        >
          View Map
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText
            variant="body"
            style={{ color: theme.colors.gray['500'] }}
          >
            Finding nearby car washes...
          </ThemedText>
        </View>
      ) : businesses.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.businessesScroll}
        >
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onPress={() => onBusinessPress(business)}
              style={styles.businessCard}
            />
          ))}
        </ScrollView>
      ) : (
        <ThemedCard style={styles.emptyStateCard}>
          <ThemedText
            variant="body"
            style={{ textAlign: 'center', color: theme.colors.gray['500'] }}
          >
            No car washes found nearby
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{
              textAlign: 'center',
              color: theme.colors.gray['400'],
              marginTop: 4,
            }}
          >
            Try expanding your search area
          </ThemedText>
        </ThemedCard>
      )}
    </View>
  );
};

// Recent Activity Section
const RecentActivitySection: React.FC<{
  bookings: Booking[];
  onViewAll: () => void;
  onBookingPress: (booking: Booking) => void;
  loading: boolean;
}> = ({ bookings, onViewAll, onBookingPress, loading }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="h4">Recent Activity</ThemedText>
        <ThemedText
          variant="button"
          style={{ color: theme.colors.primary['500'] }}
          onPress={onViewAll}
        >
          View All
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText
            variant="body"
            style={{ color: theme.colors.gray['500'] }}
          >
            Loading your bookings...
          </ThemedText>
        </View>
      ) : bookings.length > 0 ? (
        <View>
          {bookings.slice(0, 3).map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => onBookingPress(booking)}
              style={styles.bookingCard}
            />
          ))}
        </View>
      ) : (
        <ThemedCard style={styles.emptyStateCard}>
          <ThemedText
            variant="body"
            style={{ textAlign: 'center', color: theme.colors.gray['500'] }}
          >
            No recent bookings
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{
              textAlign: 'center',
              color: theme.colors.gray['400'],
              marginTop: 4,
            }}
          >
            Book your first car wash to get started
          </ThemedText>
        </ThemedCard>
      )}
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // State management
  const [userData, setUserData] = useState<User | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState({
    user: true,
    bookings: true,
    businesses: true,
  });

  // Mock data for now - will be replaced with actual API calls
  const mockUserData: User = {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookings: Booking[] = [
    {
      id: '1',
      customerId: '1',
      businessId: '1',
      serviceId: '1',
      scheduledDate: new Date(),
      status: 'completed',
      totalAmount: 25.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockBusinesses: Business[] = [
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
    },
  ];

  // Data loading function
  const loadData = useCallback(async () => {
    setRefreshing(true);
    setLoading({ user: true, bookings: true, businesses: true });

    try {
      // Simulate API calls with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserData(mockUserData);
      setLoading((prev) => ({ ...prev, user: false }));

      setRecentBookings(mockBookings);
      setLoading((prev) => ({ ...prev, bookings: false }));

      setNearbyBusinesses(mockBusinesses);
      setLoading((prev) => ({ ...prev, businesses: false }));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load data on component mount and focus
  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      // Refresh data when screen comes into focus
      loadData();
    }, [loadData])
  );

  // Navigation handlers
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigation.navigate('SearchResults', { query: query.trim() });
    }
  };

  const handleBusinessPress = (business: Business) => {
    navigation.navigate('BusinessDetails', { businessId: business.id });
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const handleViewAllBusinesses = () => {
    navigation.navigate('NearbyBusinesses');
  };

  const handleViewAllBookings = () => {
    navigation.getParent()?.navigate('Bookings');
  };

  const handleError = (error: Error) => {
    console.error('HomeScreen Error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  };

  return (
    <HomeScreenErrorBoundary onError={handleError}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title="RapidRinse"
          showNotificationBadge
          onRightPress={() => {
            // Handle notification press
          }}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              tintColor={theme.colors.primary['500']}
              colors={[theme.colors.primary['500']]}
            />
          }
        >
          <WelcomeBanner userName={userData?.name?.split(' ')[0]} />

          <SearchBar
            placeholder="Search for car wash services..."
            onSearch={handleSearch}
            style={styles.searchBar}
          />

          <NearbyBusinessesSection
            businesses={nearbyBusinesses}
            onViewAll={handleViewAllBusinesses}
            onBusinessPress={handleBusinessPress}
            loading={loading.businesses}
          />

          <RecentActivitySection
            bookings={recentBookings}
            onViewAll={handleViewAllBookings}
            onBookingPress={handleBookingPress}
            loading={loading.bookings}
          />
        </ScrollView>
      </SafeAreaView>
    </HomeScreenErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  welcomeBanner: {
    margin: 16,
    marginBottom: 8,
  },
  welcomeContent: {
    padding: 20,
  },
  greeting: {
    marginBottom: 4,
  },
  welcomeMessage: {
    marginBottom: 4,
  },
  welcomeSubtext: {
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  businessesScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  businessCard: {
    width: 280,
    marginRight: 12,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateCard: {
    marginHorizontal: 16,
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
