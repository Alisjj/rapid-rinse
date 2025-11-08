import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import { ThemedText, SearchBar } from '@/components/ui';
import { BookingCard } from '@/components/business';
import { Header } from '@/components/navigation';

// Import types and theme
import { BookingStackParamList, Booking } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { fetchUserBookings } from '@/services/api';

type BookingsListScreenNavigationProp = NativeStackNavigationProp<
  BookingStackParamList,
  'BookingsList'
>;
type BookingsListScreenRouteProp = RouteProp<
  BookingStackParamList,
  'BookingsList'
>;

interface BookingsListScreenProps {
  navigation: BookingsListScreenNavigationProp;
  route: BookingsListScreenRouteProp;
}

type BookingStatus =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

interface FilterOption {
  key: BookingStatus;
  label: string;
  count: number;
}

const BookingsListScreen: React.FC<BookingsListScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<BookingStatus>('all');

  // Mock data for now - will be replaced with actual API calls
  const mockBookings: Booking[] = [
    {
      id: '1',
      customerId: '1',
      businessId: '1',
      serviceId: '1',
      scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
      status: 'confirmed',
      totalAmount: 25.99,
      notes: 'Please wash the exterior thoroughly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      customerId: '1',
      businessId: '2',
      serviceId: '2',
      scheduledDate: new Date(Date.now() - 86400000), // Yesterday
      status: 'completed',
      totalAmount: 45.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      customerId: '1',
      businessId: '1',
      serviceId: '3',
      scheduledDate: new Date(Date.now() + 172800000), // Day after tomorrow
      status: 'pending',
      totalAmount: 35.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Filter options with counts
  const getFilterOptions = useCallback((): FilterOption[] => {
    const statusCounts = bookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return [
      { key: 'all', label: 'All', count: bookings.length },
      { key: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
      {
        key: 'confirmed',
        label: 'Confirmed',
        count: statusCounts.confirmed || 0,
      },
      {
        key: 'completed',
        label: 'Completed',
        count: statusCounts.completed || 0,
      },
      {
        key: 'cancelled',
        label: 'Cancelled',
        count: statusCounts.cancelled || 0,
      },
    ];
  }, [bookings]);

  // Data loading function
  const loadBookings = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Filter and search bookings
  const filterBookings = useCallback(() => {
    let filtered = bookings;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (booking) => booking.status === selectedFilter
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(query) ||
          booking.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by scheduled date (newest first)
    filtered.sort(
      (a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()
    );

    setFilteredBookings(filtered);
  }, [bookings, selectedFilter, searchQuery]);

  // Load data on component mount and focus
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  // Apply filters when dependencies change
  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  // Navigation handlers
  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterPress = (filter: BookingStatus) => {
    setSelectedFilter(filter);
  };

  // Render filter tabs
  const renderFilterTabs = () => {
    const filterOptions = getFilterOptions();

    return (
      <View style={styles.filterContainer}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterTabs}
          renderItem={({ item }) => (
            <ThemedText
              variant="button"
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    selectedFilter === item.key
                      ? theme.colors.primary['500']
                      : theme.colors.gray['100'],
                  color:
                    selectedFilter === item.key
                      ? theme.colors.gray['50']
                      : theme.colors.gray['700'],
                },
              ]}
              onPress={() => handleFilterPress(item.key)}
            >
              {item.label} ({item.count})
            </ThemedText>
          )}
        />
      </View>
    );
  };

  // Render booking item
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onPress={() => handleBookingPress(item)}
      style={styles.bookingCard}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText variant="h4" style={styles.emptyTitle}>
        {selectedFilter === 'all'
          ? 'No bookings yet'
          : `No ${selectedFilter} bookings`}
      </ThemedText>
      <ThemedText
        variant="body"
        style={[styles.emptyMessage, { color: theme.colors.gray['500'] }]}
      >
        {selectedFilter === 'all'
          ? 'Book your first car wash service to get started'
          : `You don't have any ${selectedFilter} bookings at the moment`}
      </ThemedText>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ThemedText variant="body" style={{ color: theme.colors.gray['500'] }}>
        Loading your bookings...
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="My Bookings" showBackButton={false} />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search bookings..."
          onSearch={handleSearch}
          style={styles.searchBar}
        />

        {/* Filter Tabs */}
        {renderFilterTabs()}

        {/* Bookings List */}
        {loading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadBookings}
                tintColor={theme.colors.primary['500']}
                colors={[theme.colors.primary['500']]}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTabs: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  bookingCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BookingsListScreen;
