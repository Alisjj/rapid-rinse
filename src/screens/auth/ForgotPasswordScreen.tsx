import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import {
  ThemedText,
  ThemedTextInput,
  ThemedButton,
  HelperText,
} from '@/components/ui';

// Import types and theme
import { AuthStackParamList } from '@/types';
import { useTheme } from '@/theme';

// Import services
import { AuthService } from '@/services/firebase';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;
type ForgotPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ForgotPassword'
>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();

  // Form state
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Email validation
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await AuthService.resetPassword(email);
      console.log('Password reset email sent to:', email);
      setEmailSent(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(
        error.message || 'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend email
  const handleResendEmail = () => {
    setEmailSent(false);
    handlePasswordReset();
  };

  if (emailSent) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Success Icon */}
            <View
              style={[
                styles.successIcon,
                { backgroundColor: theme.colors.success['100'] },
              ]}
            >
              <ThemedText
                variant='h1'
                style={{ color: theme.colors.success['600'] }}
              >
                ✓
              </ThemedText>
            </View>

            {/* Success Message */}
            <ThemedText variant='h3' style={styles.successTitle}>
              Check Your Email
            </ThemedText>

            <ThemedText
              variant='body'
              style={[
                styles.successMessage,
                { color: theme.colors.gray['600'] },
              ]}
            >
              We've sent a password reset link to
            </ThemedText>

            <ThemedText
              variant='bodyLarge'
              style={[styles.emailText, { color: theme.colors.primary['600'] }]}
            >
              {email}
            </ThemedText>

            <ThemedText
              variant='body'
              style={[
                styles.instructionText,
                { color: theme.colors.gray['600'] },
              ]}
            >
              Click the link in the email to reset your password. If you don't
              see the email, check your spam folder.
            </ThemedText>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <ThemedButton
                title='Back to Sign In'
                variant='primary'
                size='lg'
                onPress={() => navigation.navigate('Login')}
                style={styles.actionButton}
              />

              <ThemedButton
                title='Resend Email'
                variant='outline'
                size='md'
                onPress={handleResendEmail}
                loading={isLoading}
                disabled={isLoading}
                style={styles.actionButton}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemedButton
                title='Back'
                variant='ghost'
                size='sm'
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
            </View>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode='contain'
              />
              <ThemedText variant='h2' style={styles.title}>
                Forgot Password?
              </ThemedText>
              <ThemedText
                variant='body'
                style={[styles.subtitle, { color: theme.colors.gray['500'] }]}
              >
                No worries! Enter your email address and we'll send you a link
                to reset your password.
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Error Message */}
              {error && (
                <HelperText
                  text={error}
                  type='error'
                  style={styles.errorMessage}
                />
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label='Email Address'
                  placeholder='Enter your email'
                  value={email}
                  onChangeText={value => {
                    setEmail(value);
                    if (error) setError(''); // Clear error when user types
                  }}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoComplete='email'
                  returnKeyType='done'
                  onSubmitEditing={handlePasswordReset}
                  errorText={error}
                />
              </View>

              {/* Reset Button */}
              <ThemedButton
                title='Send Reset Link'
                variant='primary'
                size='lg'
                onPress={handlePasswordReset}
                loading={isLoading}
                disabled={isLoading || !email.trim()}
                style={styles.resetButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText
                variant='body'
                style={{ color: theme.colors.gray['500'] }}
              >
                Remember your password?{' '}
                <ThemedText
                  variant='body'
                  style={[
                    styles.footerLink,
                    { color: theme.colors.primary['500'] },
                  ]}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign In
                </ThemedText>
              </ThemedText>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  backButton: {
    paddingHorizontal: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  errorMessage: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerLink: {
    fontWeight: '600',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
