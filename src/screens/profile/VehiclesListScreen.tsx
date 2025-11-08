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
import { ThemedText, ThemedButton, ThemedCard } from '@/components/ui';
import { Header } from '@/components/navigation';

// Import types and theme
import { ProfileStackParamList } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { fetchUserVehicles, deleteVehicle } from '@/services/api';

type VehiclesListScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'VehiclesList'
>;
type VehiclesListScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'VehiclesList'
>;

interface VehiclesListScreenProps {
  navigation: VehiclesListScreenNavigationProp;
  route: VehiclesListScreenRouteProp;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  type: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehiclesListScreen: React.FC<VehiclesListScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();

  // State management
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with actual API calls
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      plateNumber: 'ABC123',
      color: 'Silver',
      type: 'Sedan',
      isDefault: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      plateNumber: 'XYZ789',
      color: 'Blue',
      type: 'Sedan',
      isDefault: false,
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date(),
    },
  ];

  // Data loading function
  const loadVehicles = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVehicles(mockVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles. Please try again.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Load data on component mount and focus
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [loadVehicles])
  );

  // Handle vehicle deletion
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock delete vehicle - replace with actual API call
              await new Promise((resolve) => setTimeout(resolve, 1000));

              setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
              Alert.alert('Success', 'Vehicle deleted successfully');
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert(
                'Error',
                'Failed to delete vehicle. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  // Handle vehicle edit
  const handleEditVehicle = (vehicle: Vehicle) => {
    navigation.navigate('EditVehicle', { vehicleId: vehicle.id });
  };

  // Handle add vehicle
  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  // Handle set default vehicle
  const handleSetDefault = async (vehicle: Vehicle) => {
    try {
      // Mock set default - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setVehicles((prev) =>
        prev.map((v) => ({ ...v, isDefault: v.id === vehicle.id }))
      );
    } catch (error) {
      console.error('Error setting default vehicle:', error);
      Alert.alert('Error', 'Failed to set default vehicle. Please try again.');
    }
  };

  // Render vehicle item
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <ThemedCard style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleInfo}>
          <ThemedText variant="bodyLarge" style={styles.vehicleName}>
            {item.year} {item.make} {item.model}
          </ThemedText>
          <ThemedText
            variant="body"
            style={[styles.vehicleDetails, { color: theme.colors.gray['600'] }]}
          >
            {item.color} {item.type} • {item.plateNumber}
          </ThemedText>
          {item.isDefault && (
            <View
              style={[
                styles.defaultBadge,
                { backgroundColor: theme.colors.primary['100'] },
              ]}
            >
              <ThemedText
                variant="caption"
                style={[
                  styles.defaultText,
                  { color: theme.colors.primary['700'] },
                ]}
              >
                Default Vehicle
              </ThemedText>
            </View>
          )}
        </View>
        <View
          style={[
            styles.vehicleIcon,
            { backgroundColor: theme.colors.gray['100'] },
          ]}
        >
          <ThemedText variant="h4">🚗</ThemedText>
        </View>
      </View>

      <View style={styles.vehicleActions}>
        {!item.isDefault && (
          <ThemedButton
            variant="ghost"
            size="sm"
            onPress={() => handleSetDefault(item)}
            style={styles.actionButton}
          >
            Set as Default
          </ThemedButton>
        )}
        <ThemedButton
          variant="ghost"
          size="sm"
          onPress={() => handleEditVehicle(item)}
          style={styles.actionButton}
        >
          Edit
        </ThemedButton>
        <ThemedButton
          variant="ghost"
          size="sm"
          onPress={() => handleDeleteVehicle(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <ThemedText style={{ color: theme.colors.error['500'] }}>
            Delete
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedCard>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: theme.colors.gray['100'] },
        ]}
      >
        <ThemedText variant="h1">🚗</ThemedText>
      </View>
      <ThemedText variant="h4" style={styles.emptyTitle}>
        No vehicles yet
      </ThemedText>
      <ThemedText
        variant="body"
        style={[styles.emptyMessage, { color: theme.colors.gray['500'] }]}
      >
        Add your first vehicle to start booking car wash services
      </ThemedText>
      <ThemedButton
        variant="primary"
        size="lg"
        onPress={handleAddVehicle}
        style={styles.emptyAddButton}
      >
        Add Your First Vehicle
      </ThemedButton>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ThemedText variant="body" style={{ color: theme.colors.gray['500'] }}>
        Loading your vehicles...
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="My Vehicles" />

      <View style={styles.content}>
        {loading ? (
          renderLoadingState()
        ) : (
          <>
            <FlatList
              data={vehicles}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={loadVehicles}
                  tintColor={theme.colors.primary['500']}
                  colors={[theme.colors.primary['500']]}
                />
              }
              ListEmptyComponent={renderEmptyState}
            />

            {vehicles.length > 0 && (
              <View style={styles.addButtonContainer}>
                <ThemedButton
                  variant="primary"
                  size="lg"
                  onPress={handleAddVehicle}
                  style={styles.addButton}
                  leftIcon="plus"
                >
                  Add New Vehicle
                </ThemedButton>
              </View>
            )}
          </>
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
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  vehicleCard: {
    marginBottom: 12,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
    marginRight: 12,
  },
  vehicleName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleDetails: {
    marginBottom: 8,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButton: {
    // Additional styles for delete button if needed
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
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyAddButton: {
    alignSelf: 'center',
  },
  addButtonContainer: {
    padding: 16,
  },
  addButton: {
    width: '100%',
  },
});

export default VehiclesListScreen;
