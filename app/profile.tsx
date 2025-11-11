import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import {
  ThemedText,
  ThemedCard,
  ThemedButton,
  ThemedTextInput,
} from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks';

export default function Profile() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    user,
    userProfile,
    logout,
    updateProfile,
    loading: authLoading,
  } = useAuth();

  // User data from Firebase
  const [name, setName] = useState(
    userProfile?.fullName || user?.displayName || ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when user data changes
  React.useEffect(() => {
    if (userProfile) {
      setName(userProfile.fullName || '');
      setPhone(userProfile.phoneNumber || '');
    }
    if (user) {
      setEmail(user.email || '');
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: name,
        phoneNumber: phone || undefined,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Logout successful - user will be redirected to login by ProtectedRoute
            router.replace('/login');
          } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title='Profile'
          showBackButton
          onBackPress={() => router.back()}
          rightComponent={
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <MaterialCommunityIcons
                name={isEditing ? 'close' : 'pencil'}
                size={24}
                color={theme.colors.primary['500']}
              />
            </TouchableOpacity>
          }
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primary['100'] },
              ]}
            >
              <MaterialCommunityIcons
                name='account'
                size={48}
                color={theme.colors.primary['500']}
              />
            </View>
            <ThemedText variant='h3' style={{ marginTop: 12 }}>
              {name}
            </ThemedText>
            <ThemedText
              variant='body'
              colorVariant='gray'
              colorShade='600'
              style={{ marginTop: 4 }}
            >
              {email}
            </ThemedText>
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Account Information
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.formField}>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginBottom: 4 }}
                >
                  Full Name
                </ThemedText>
                <ThemedTextInput
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder='Enter your name'
                />
              </View>

              <View style={styles.formField}>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginBottom: 4 }}
                >
                  Email
                </ThemedText>
                <ThemedTextInput
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  placeholder='Enter your email'
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>

              <View style={styles.formField}>
                <ThemedText
                  variant='caption'
                  colorVariant='gray'
                  colorShade='600'
                  style={{ marginBottom: 4 }}
                >
                  Phone Number
                </ThemedText>
                <ThemedTextInput
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  placeholder='Enter your phone'
                  keyboardType='phone-pad'
                />
              </View>

              {isEditing && (
                <ThemedButton
                  title='Save Changes'
                  variant='primary'
                  onPress={handleSave}
                  style={{ marginTop: 12 }}
                />
              )}
            </ThemedCard>
          </View>

          {/* My Vehicles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant='h3'>My Vehicles</ThemedText>
              <ThemedButton
                title='Add'
                variant='ghost'
                size='sm'
                onPress={() =>
                  Alert.alert('Add Vehicle', 'Add vehicle feature coming soon!')
                }
                icon={
                  <MaterialCommunityIcons
                    name='plus'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
              />
            </View>

            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.vehicleItem}>
                <MaterialCommunityIcons
                  name='car'
                  size={32}
                  color={theme.colors.primary['500']}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <ThemedText variant='body' style={{ fontWeight: '600' }}>
                    2020 Toyota Camry
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                  >
                    Silver • ABC-1234
                  </ThemedText>
                </View>
                <MaterialCommunityIcons
                  name='chevron-right'
                  size={24}
                  color={theme.colors.gray['400']}
                />
              </View>
            </ThemedCard>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Quick Actions
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <ThemedButton
                title='My Bookings'
                variant='ghost'
                onPress={() => router.push('/bookings')}
                icon={
                  <MaterialCommunityIcons
                    name='calendar-check'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
                style={styles.actionButton}
              />

              <ThemedButton
                title='Payment Methods'
                variant='ghost'
                onPress={() =>
                  Alert.alert('Payment Methods', 'Feature coming soon!')
                }
                icon={
                  <MaterialCommunityIcons
                    name='credit-card'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
                style={styles.actionButton}
              />

              <ThemedButton
                title='Notifications'
                variant='ghost'
                onPress={() =>
                  Alert.alert('Notifications', 'Feature coming soon!')
                }
                icon={
                  <MaterialCommunityIcons
                    name='bell'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
                style={styles.actionButton}
              />

              <ThemedButton
                title='Help & Support'
                variant='ghost'
                onPress={() =>
                  Alert.alert('Help & Support', 'Feature coming soon!')
                }
                icon={
                  <MaterialCommunityIcons
                    name='help-circle'
                    size={20}
                    color={theme.colors.primary['500']}
                  />
                }
                style={styles.actionButton}
              />
            </ThemedCard>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <ThemedText variant='h3' style={styles.sectionTitle}>
              Settings
            </ThemedText>

            <ThemedCard variant='elevated' style={styles.card}>
              <View style={styles.settingItem}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant='body' style={{ fontWeight: '600' }}>
                    Push Notifications
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                  >
                    Receive booking reminders
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.toggle,
                    { backgroundColor: theme.colors.success['500'] },
                  ]}
                >
                  <View style={styles.toggleThumb} />
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant='body' style={{ fontWeight: '600' }}>
                    Email Updates
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    colorVariant='gray'
                    colorShade='600'
                  >
                    Receive promotional emails
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.toggle,
                    { backgroundColor: theme.colors.gray['300'] },
                  ]}
                >
                  <View style={[styles.toggleThumb, { left: 2 }]} />
                </View>
              </View>
            </ThemedCard>
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <ThemedButton
              title='Logout'
              variant='outline'
              onPress={handleLogout}
              icon={
                <MaterialCommunityIcons
                  name='logout'
                  size={20}
                  color={theme.colors.error['500']}
                />
              }
              style={[
                styles.logoutButton,
                { borderColor: theme.colors.error['500'] },
              ]}
            />
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='500'
              style={{ textAlign: 'center' }}
            >
              RapidRinse v1.0.0
            </ThemedText>
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='500'
              style={{ textAlign: 'center', marginTop: 4 }}
            >
              © 2024 RapidRinse. All rights reserved.
            </ThemedText>
          </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    marginHorizontal: 16,
  },
  formField: {
    marginBottom: 16,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButton: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: 2,
  },
  logoutButton: {
    marginHorizontal: 16,
  },
  appInfo: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});
