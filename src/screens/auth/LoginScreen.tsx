import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Animated,
} from 'react-native';
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

// Import services (placeholder for now)
// import { signInWithEmailAndPassword } from '@/services/firebase';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Refs for form navigation
  // Note: ThemedTextInput doesn't support refs, so we'll handle focus differently

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

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const validateField = (field: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    // Real-time validation with debounce
    setTimeout(() => validateField(field, value), 300);
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Mock login - replace with actual Firebase auth
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      console.log('Login successful:', formData.email);

      // Navigate to main app
      // navigation.navigate('Main');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Handle social login (placeholder)
  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    Alert.alert('Social Login', `${provider} login will be implemented soon`);
  };

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
          keyboardShouldPersistTaps="handled"
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
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <ThemedText variant="h2" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText
                variant="body"
                style={[styles.subtitle, { color: theme.colors.gray['500'] }]}
              >
                Sign in to your account to continue
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* General Error */}
              {errors.general && (
                <HelperText
                  type="error"
                  text={errors.general}
                  style={styles.generalError}
                />
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    /* Focus next field */
                  }}
                  errorText={errors.email}
                />
                {errors.email && (
                  <HelperText type="error" text={errors.email} />
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  errorText={errors.password}
                  rightIcon={
                    <ThemedText>{showPassword ? '👁️' : '🙈'}</ThemedText>
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
                {errors.password && (
                  <HelperText type="error" text={errors.password} />
                )}
              </View>

              {/* Forgot Password */}
              <View style={styles.forgotPasswordContainer}>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.forgotPassword,
                    { color: theme.colors.primary['500'] },
                  ]}
                  onPress={handleForgotPassword}
                >
                  Forgot Password?
                </ThemedText>
              </View>

              {/* Login Button */}
              <ThemedButton
                variant="primary"
                size="lg"
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.gray['200'] },
                  ]}
                />
                <ThemedText
                  variant="caption"
                  style={[
                    styles.dividerText,
                    { color: theme.colors.gray['500'] },
                  ]}
                >
                  Or continue with
                </ThemedText>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.gray['200'] },
                  ]}
                />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <ThemedButton
                  variant="outline"
                  size="md"
                  title="Google"
                  onPress={() => handleSocialLogin('google')}
                  style={styles.socialButton}
                  icon={<ThemedText>🔍</ThemedText>}
                  iconPosition="left"
                />

                {Platform.OS === 'ios' && (
                  <ThemedButton
                    variant="outline"
                    size="md"
                    title="Apple"
                    onPress={() => handleSocialLogin('apple')}
                    style={styles.socialButton}
                    icon={<ThemedText>🍎</ThemedText>}
                    iconPosition="left"
                  />
                )}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText
                variant="body"
                style={{ color: theme.colors.gray['500'] }}
              >
                Don't have an account?{' '}
                <ThemedText
                  variant="body"
                  style={[
                    styles.footerLink,
                    { color: theme.colors.primary['500'] },
                  ]}
                  onPress={() => navigation.navigate('Register')}
                >
                  Sign Up
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
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  generalError: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPassword: {
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerLink: {
    fontWeight: '600',
  },
});

export default LoginScreen;
