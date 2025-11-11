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

export default function Login() {
  const { theme } = useTheme();
  const router = useRouter();
  const { login, loading: authLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Missing Information',
        'Please enter both email and password.'
      );
      return;
    }

    try {
      await login(email, password);
      // Login successful - user will be automatically redirected by ProtectedRoute
      router.replace('/');
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Login failed:', err);
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
          {/* Logo/Header */}
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
              RapidRinse
            </ThemedText>
            <ThemedText
              variant='body'
              colorVariant='gray'
              colorShade='600'
              style={{ marginTop: 8, textAlign: 'center' }}
            >
              Welcome back! Sign in to continue
            </ThemedText>
          </View>

          {/* Login Form */}
          <ThemedCard variant='elevated' style={styles.card}>
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
                placeholder='Enter your email'
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
                Password
              </ThemedText>
              <ThemedTextInput
                placeholder='Enter your password'
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

            <ThemedButton
              title='Forgot Password?'
              variant='ghost'
              size='sm'
              onPress={() =>
                Alert.alert(
                  'Forgot Password',
                  'Password reset feature coming soon!'
                )
              }
              style={{ alignSelf: 'flex-end', marginTop: -8 }}
            />

            <ThemedButton
              title={authLoading ? 'Signing In...' : 'Sign In'}
              variant='primary'
              onPress={handleLogin}
              disabled={authLoading}
              style={{ marginTop: 16 }}
            />
          </ThemedCard>

          {/* Social Login */}
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
              title='Continue with Google'
              variant='outline'
              onPress={() =>
                Alert.alert('Google Sign In', 'Feature coming soon!')
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
              title='Continue with Apple'
              variant='outline'
              onPress={() =>
                Alert.alert('Apple Sign In', 'Feature coming soon!')
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

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <ThemedText variant='body' colorVariant='gray' colorShade='600'>
              Don't have an account?{' '}
            </ThemedText>
            <ThemedButton
              title='Sign Up'
              variant='ghost'
              size='sm'
              onPress={() => router.push('/register')}
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
    marginTop: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
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
  },
});
