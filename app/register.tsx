import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks';

export default function Register() {
  const { theme } = useTheme();
  const router = useRouter();
  const { register, loading: authLoading, error } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.'
      );
      return;
    }

    try {
      await register(email, password, fullName, phone || undefined);
      // Registration successful - user will be automatically redirected by ProtectedRoute
      router.replace('/');
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Registration failed:', err);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Back Button */}
      <View style={styles.backButton}>
        <MaterialCommunityIcons
          name='arrow-left'
          size={28}
          color={theme.colors.gray['700']}
          onPress={() => router.back()}
          style={{ padding: 8 }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: theme.colors.primary['500'] },
              ]}
            >
              <MaterialCommunityIcons
                name='car-wash'
                size={48}
                color='#FFFFFF'
              />
            </View>
            <ThemedText variant='h1' style={{ marginTop: 16 }}>
              Create Account
            </ThemedText>
            <ThemedText
              variant='body'
              colorVariant='gray'
              colorShade='600'
              style={{ marginTop: 8, textAlign: 'center' }}
            >
              Sign up to get started with RapidRinse
            </ThemedText>
          </View>

          {/* Registration Form */}
          <ThemedCard variant='elevated' style={styles.card}>
            <View style={styles.formField}>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                style={{ marginBottom: 4 }}
              >
                Full Name *
              </ThemedText>
              <ThemedTextInput
                placeholder='John Doe'
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize='words'
              />
            </View>

            <View style={styles.formField}>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                style={{ marginBottom: 4 }}
              >
                Email *
              </ThemedText>
              <ThemedTextInput
                placeholder='john@example.com'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
              />
            </View>

            <View style={styles.formField}>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                style={{ marginBottom: 4 }}
              >
                Phone Number (Optional)
              </ThemedText>
              <ThemedTextInput
                placeholder='+1 (234) 567-8900'
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
              />
            </View>

            <View style={styles.formField}>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                style={{ marginBottom: 4 }}
              >
                Password *
              </ThemedText>
              <ThemedTextInput
                placeholder='At least 6 characters'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
                rightIcon={
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={theme.colors.gray['400']}
                  />
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            <View style={styles.formField}>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                style={{ marginBottom: 4 }}
              >
                Confirm Password *
              </ThemedText>
              <ThemedTextInput
                placeholder='Re-enter password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize='none'
                rightIcon={
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={theme.colors.gray['400']}
                  />
                }
                onRightIconPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </View>

            <ThemedButton
              title={authLoading ? 'Creating Account...' : 'Create Account'}
              variant='primary'
              onPress={handleRegister}
              disabled={authLoading}
              style={{ marginTop: 16 }}
            />
          </ThemedCard>

          {/* Terms */}
          <ThemedText
            variant='caption'
            colorVariant='gray'
            colorShade='500'
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            By creating an account, you agree to our{'\n'}
            Terms of Service and Privacy Policy
          </ThemedText>

          {/* Social Sign Up */}
          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.gray['300'] },
              ]}
            />
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='500'
              style={{ paddingHorizontal: 12 }}
            >
              OR
            </ThemedText>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.gray['300'] },
              ]}
            />
          </View>

          <View style={styles.socialButtons}>
            <ThemedButton
              title='Sign up with Google'
              variant='outline'
              onPress={() =>
                Alert.alert('Google Sign Up', 'Feature coming soon!')
              }
              icon={
                <MaterialCommunityIcons
                  name='google'
                  size={20}
                  color={theme.colors.gray['700']}
                />
              }
              style={{ marginBottom: 12 }}
            />
            <ThemedButton
              title='Sign up with Apple'
              variant='outline'
              onPress={() =>
                Alert.alert('Apple Sign Up', 'Feature coming soon!')
              }
              icon={
                <MaterialCommunityIcons
                  name='apple'
                  size={20}
                  color={theme.colors.gray['700']}
                />
              }
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <ThemedText variant='body' colorVariant='gray' colorShade='600'>
              Already have an account?{' '}
            </ThemedText>
            <ThemedButton
              title='Sign In'
              variant='ghost'
              size='sm'
              onPress={() => router.push('/login')}
              style={{ padding: 0, minHeight: 0 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialButtons: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
});
