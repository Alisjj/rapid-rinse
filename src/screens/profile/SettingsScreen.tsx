import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import { ThemedText, ThemedCard, ThemedButton } from '@/components/ui';
import { Header } from '@/components/navigation';

// Import types and theme
import { ProfileStackParamList } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { updateUserSettings } from '@/services/api';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;
type SettingsScreenRouteProp = RouteProp<ProfileStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
}

interface NotificationSettings {
  bookingReminders: boolean;
  promotionalOffers: boolean;
  serviceUpdates: boolean;
  emailNotifications: boolean;
}

interface AppSettings {
  darkMode: boolean;
  autoLocation: boolean;
  savePaymentMethods: boolean;
  biometricAuth: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    bookingReminders: true,
    promotionalOffers: false,
    serviceUpdates: true,
    emailNotifications: true,
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    darkMode: false,
    autoLocation: true,
    savePaymentMethods: true,
    biometricAuth: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle notification setting change
  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    // Auto-save settings
    saveSettings();
  };

  // Handle app setting change
  const handleAppSettingChange = (key: keyof AppSettings, value: boolean) => {
    setAppSettings((prev) => ({ ...prev, [key]: value }));
    // Auto-save settings
    saveSettings();
  };

  // Save settings
  const saveSettings = async () => {
    try {
      // Mock save settings - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  // Handle clear cache
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including images and temporary files. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Mock clear cache - replace with actual implementation
              await new Promise((resolve) => setTimeout(resolve, 2000));
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle reset settings
  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotifications({
              bookingReminders: true,
              promotionalOffers: false,
              serviceUpdates: true,
              emailNotifications: true,
            });
            setAppSettings({
              darkMode: false,
              autoLocation: true,
              savePaymentMethods: true,
              biometricAuth: false,
            });
            saveSettings();
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  // Render setting item with switch
  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <ThemedText variant="bodyLarge" style={styles.settingTitle}>
          {title}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={[styles.settingSubtitle, { color: theme.colors.gray['500'] }]}
        >
          {subtitle}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.gray['300'],
          true: theme.colors.primary['200'],
        }}
        thumbColor={
          value ? theme.colors.primary['500'] : theme.colors.gray['50']
        }
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Settings" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <ThemedCard style={styles.section}>
          <ThemedText variant="h4" style={styles.sectionTitle}>
            Notifications
          </ThemedText>

          {renderSettingItem(
            'Booking Reminders',
            'Get notified about upcoming appointments',
            notifications.bookingReminders,
            (value) => handleNotificationChange('bookingReminders', value)
          )}

          {renderSettingItem(
            'Promotional Offers',
            'Receive special deals and discounts',
            notifications.promotionalOffers,
            (value) => handleNotificationChange('promotionalOffers', value)
          )}

          {renderSettingItem(
            'Service Updates',
            'Updates about your bookings and services',
            notifications.serviceUpdates,
            (value) => handleNotificationChange('serviceUpdates', value)
          )}

          {renderSettingItem(
            'Email Notifications',
            'Receive notifications via email',
            notifications.emailNotifications,
            (value) => handleNotificationChange('emailNotifications', value)
          )}
        </ThemedCard>

        {/* App Preferences Section */}
        <ThemedCard style={styles.section}>
          <ThemedText variant="h4" style={styles.sectionTitle}>
            App Preferences
          </ThemedText>

          {renderSettingItem(
            'Dark Mode',
            'Use dark theme throughout the app',
            appSettings.darkMode,
            (value) => handleAppSettingChange('darkMode', value)
          )}

          {renderSettingItem(
            'Auto Location',
            'Automatically detect your location',
            appSettings.autoLocation,
            (value) => handleAppSettingChange('autoLocation', value)
          )}

          {renderSettingItem(
            'Save Payment Methods',
            'Securely save payment information',
            appSettings.savePaymentMethods,
            (value) => handleAppSettingChange('savePaymentMethods', value)
          )}

          {renderSettingItem(
            'Biometric Authentication',
            'Use fingerprint or face ID for security',
            appSettings.biometricAuth,
            (value) => handleAppSettingChange('biometricAuth', value)
          )}
        </ThemedCard>

        {/* Data & Storage Section */}
        <ThemedCard style={styles.section}>
          <ThemedText variant="h4" style={styles.sectionTitle}>
            Data & Storage
          </ThemedText>

          <View style={styles.actionItem}>
            <View style={styles.actionText}>
              <ThemedText variant="bodyLarge" style={styles.actionTitle}>
                Clear Cache
              </ThemedText>
              <ThemedText
                variant="caption"
                style={[
                  styles.actionSubtitle,
                  { color: theme.colors.gray['500'] },
                ]}
              >
                Free up storage space by clearing cached data
              </ThemedText>
            </View>
            <ThemedButton
              variant="outline"
              size="sm"
              title="Clear"
              onPress={handleClearCache}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </ThemedCard>

        {/* About Section */}
        <ThemedCard style={styles.section}>
          <ThemedText variant="h4" style={styles.sectionTitle}>
            About
          </ThemedText>

          <View style={styles.infoItem}>
            <ThemedText variant="body" style={styles.infoLabel}>
              App Version
            </ThemedText>
            <ThemedText
              variant="body"
              style={[styles.infoValue, { color: theme.colors.gray['600'] }]}
            >
              1.0.0
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText variant="body" style={styles.infoLabel}>
              Build Number
            </ThemedText>
            <ThemedText
              variant="body"
              style={[styles.infoValue, { color: theme.colors.gray['600'] }]}
            >
              100
            </ThemedText>
          </View>

          <View style={styles.linkItems}>
            <ThemedText
              variant="body"
              style={[styles.linkItem, { color: theme.colors.primary['500'] }]}
              onPress={() =>
                Alert.alert(
                  'Terms of Service',
                  'Terms of Service will be displayed here'
                )
              }
            >
              Terms of Service
            </ThemedText>

            <ThemedText
              variant="body"
              style={[styles.linkItem, { color: theme.colors.primary['500'] }]}
              onPress={() =>
                Alert.alert(
                  'Privacy Policy',
                  'Privacy Policy will be displayed here'
                )
              }
            >
              Privacy Policy
            </ThemedText>

            <ThemedText
              variant="body"
              style={[styles.linkItem, { color: theme.colors.primary['500'] }]}
              onPress={() =>
                Alert.alert(
                  'Support',
                  'Contact support at support@rapidrinse.com'
                )
              }
            >
              Contact Support
            </ThemedText>
          </View>
        </ThemedCard>

        {/* Reset Section */}
        <View style={styles.resetSection}>
          <ThemedButton
            variant="outline"
            size="lg"
            title="Reset All Settings"
            onPress={handleResetSettings}
            style={[
              styles.resetButton,
              { borderColor: theme.colors.warning['500'] },
            ]}
          />
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
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    marginBottom: 2,
  },
  settingSubtitle: {
    lineHeight: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionText: {
    flex: 1,
    marginRight: 16,
  },
  actionTitle: {
    marginBottom: 2,
  },
  actionSubtitle: {
    lineHeight: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    // Additional styles if needed
  },
  linkItems: {
    marginTop: 16,
    gap: 12,
  },
  linkItem: {
    fontWeight: '500',
    paddingVertical: 4,
  },
  resetSection: {
    padding: 16,
    marginTop: 16,
  },
  resetButton: {
    width: '100%',
  },
});

export default SettingsScreen;
