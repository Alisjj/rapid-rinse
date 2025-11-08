import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import { ThemedText, ThemedButton, ThemedCard } from '@/components/ui';
import { Header } from '@/components/navigation';

// Import types and theme
import { ProfileStackParamList, User } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { fetchUserProfile, signOut } from '@/services/firebase';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileScreen'
>;
type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'ProfileScreen'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

interface ProfileStats {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  favoriteServices: string[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // State management
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with actual API calls
  const mockUser: User = {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
  };

  const mockStats: ProfileStats = {
    totalBookings: 12,
    completedBookings: 10,
    totalSpent: 324.89,
    favoriteServices: ['Premium Wash', 'Interior Clean'],
  };

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);

      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUser(mockUser);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            // Mock sign out - replace with actual Firebase auth
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Navigation will be handled by the auth state change
            console.log('User signed out');
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  // Navigation handlers
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleVehicles = () => {
    navigation.navigate('VehiclesList');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  // Profile menu items
  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: '👤',
      onPress: handleEditProfile,
    },
    {
      id: 'vehicles',
      title: 'My Vehicles',
      subtitle: 'Manage your registered vehicles',
      icon: '🚗',
      onPress: handleVehicles,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      icon: '⚙️',
      onPress: handleSettings,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title="Profile" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant="body"
            style={{ color: theme.colors.gray['500'] }}
          >
            Loading profile...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header title="Profile" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ThemedText
            variant="body"
            style={{ color: theme.colors.gray['500'] }}
          >
            Profile not found
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Profile" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ThemedCard style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primary['100'] },
              ]}
            >
              <ThemedText
                variant="h2"
                style={{ color: theme.colors.primary['600'] }}
              >
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText variant="h3" style={styles.userName}>
                {user.name}
              </ThemedText>
              <ThemedText
                variant="body"
                style={[styles.userEmail, { color: theme.colors.gray['600'] }]}
              >
                {user.email}
              </ThemedText>
              {user.phone && (
                <ThemedText
                  variant="body"
                  style={[
                    styles.userPhone,
                    { color: theme.colors.gray['600'] },
                  ]}
                >
                  {user.phone}
                </ThemedText>
              )}
              <ThemedText
                variant="caption"
                style={[
                  styles.memberSince,
                  { color: theme.colors.gray['500'] },
                ]}
              >
                Member since{' '}
                {user.createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        {/* Stats Section */}
        {stats && (
          <ThemedCard style={styles.statsCard}>
            <ThemedText variant="h4" style={styles.statsTitle}>
              Your Activity
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText
                  variant="h3"
                  style={[
                    styles.statValue,
                    { color: theme.colors.primary['600'] },
                  ]}
                >
                  {stats.totalBookings}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.statLabel,
                    { color: theme.colors.gray['500'] },
                  ]}
                >
                  Total Bookings
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText
                  variant="h3"
                  style={[
                    styles.statValue,
                    { color: theme.colors.success['600'] },
                  ]}
                >
                  {stats.completedBookings}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.statLabel,
                    { color: theme.colors.gray['500'] },
                  ]}
                >
                  Completed
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText
                  variant="h3"
                  style={[
                    styles.statValue,
                    { color: theme.colors.warning['600'] },
                  ]}
                >
                  ${stats.totalSpent.toFixed(0)}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.statLabel,
                    { color: theme.colors.gray['500'] },
                  ]}
                >
                  Total Spent
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} onPress={item.onPress}>
              <ThemedCard style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuIcon,
                        { backgroundColor: theme.colors.gray['100'] },
                      ]}
                    >
                      <ThemedText variant="bodyLarge">{item.icon}</ThemedText>
                    </View>
                    <View style={styles.menuItemText}>
                      <ThemedText
                        variant="bodyLarge"
                        style={styles.menuItemTitle}
                      >
                        {item.title}
                      </ThemedText>
                      <ThemedText
                        variant="caption"
                        style={[
                          styles.menuItemSubtitle,
                          { color: theme.colors.gray['500'] },
                        ]}
                      >
                        {item.subtitle}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText
                    variant="bodyLarge"
                    style={{ color: theme.colors.gray['400'] }}
                  >
                    ›
                  </ThemedText>
                </View>
              </ThemedCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <ThemedButton
            variant="outline"
            size="lg"
            title="Sign Out"
            onPress={handleSignOut}
            style={[
              styles.signOutButton,
              { borderColor: theme.colors.error['500'] },
            ]}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText
            variant="caption"
            style={[styles.appVersion, { color: theme.colors.gray['400'] }]}
          >
            RapidRinse v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    margin: 16,
    marginBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 16,
  },
  userPhone: {
    fontSize: 16,
  },
  memberSince: {
    marginTop: 4,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statsTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
  },
  menuSection: {
    marginHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    padding: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    gap: 2,
  },
  menuItemTitle: {
    fontWeight: '600',
  },
  menuItemSubtitle: {
    lineHeight: 16,
  },
  signOutSection: {
    padding: 16,
    marginTop: 16,
  },
  signOutButton: {
    width: '100%',
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  appVersion: {
    textAlign: 'center',
  },
});

export default ProfileScreen;
