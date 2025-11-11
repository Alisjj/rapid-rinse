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
  TouchableOpacity,
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

// Import services (placeholder for now)
// import { createUserWithEmailAndPassword } from '@/services/firebase';

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;
type RegistrationScreenRouteProp = RouteProp<AuthStackParamList, 'Register'>;

interface RegistrationScreenProps {
  navigation: RegistrationScreenNavigationProp;
  route: RegistrationScreenRouteProp;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Refs for form navigation
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

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

  // Password strength checker
  const getPasswordStrength = (
    password: string
  ): { score: number; text: string; color: string } => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { text: 'Very Weak', color: theme.colors.error['500'] },
      1: { text: 'Weak', color: theme.colors.error['400'] },
      2: { text: 'Fair', color: theme.colors.warning['500'] },
      3: { text: 'Good', color: theme.colors.warning['400'] },
      4: { text: 'Strong', color: theme.colors.success['500'] },
      5: { text: 'Very Strong', color: theme.colors.success['600'] },
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (getPasswordStrength(formData.password).score < 3) {
      newErrors.password =
        'Password is too weak. Include uppercase, lowercase, numbers, and symbols.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!acceptedTerms) {
      newErrors.general =
        'Please accept the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const validateField = (field: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
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
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (getPasswordStrength(value).score < 3) {
          newErrors.password = 'Password is too weak';
        } else {
          delete newErrors.password;
        }

        // Re-validate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (
          formData.confirmPassword &&
          value === formData.confirmPassword
        ) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== value) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }

    // Real-time validation with debounce
    setTimeout(() => validateField(field, value), 300);
  };

  // Handle registration
  const handleRegistration = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Mock registration - replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message and navigate
      Alert.alert(
        'Success!',
        'Your account has been created successfully. Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social registration (placeholder)
  const handleSocialRegistration = (
    provider: 'google' | 'apple' | 'facebook'
  ) => {
    Alert.alert(
      'Social Registration',
      `${provider} registration will be implemented soon`
    );
  };

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

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
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode='contain'
              />
              <ThemedText variant='h2' style={styles.title}>
                Create Account
              </ThemedText>
              <ThemedText
                variant='body'
                style={[styles.subtitle, { color: theme.colors.gray['500'] }]}
              >
                Join RapidRinse to book car wash services
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* General Error */}
              {errors.general && (
                <HelperText
                  text={errors.general}
                  type='error'
                  style={styles.generalError}
                />
              )}

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label='Full Name'
                  placeholder='Enter your full name'
                  value={formData.fullName}
                  onChangeText={value => handleInputChange('fullName', value)}
                  autoCapitalize='words'
                  autoComplete='name'
                  returnKeyType='next'
                  onSubmitEditing={() => emailRef.current?.focus()}
                  errorText={errors.fullName}
                />
                {errors.fullName && (
                  <HelperText text={errors.fullName} type='error' />
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label='Email Address'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoComplete='email'
                  returnKeyType='next'
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  errorText={errors.email}
                />
                {errors.email && (
                  <HelperText text={errors.email} type='error' />
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label='Password'
                  placeholder='Create a strong password'
                  value={formData.password}
                  onChangeText={value => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoComplete='password-new'
                  returnKeyType='next'
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  errorText={errors.password}
                  rightIcon={showPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
                {errors.password && (
                  <HelperText text={errors.password} type='error' />
                )}
                {passwordStrength && formData.password && !errors.password && (
                  <HelperText
                    text={`Password strength: ${passwordStrength.text}`}
                    type='default'
                  />
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <ThemedTextInput
                  label='Confirm Password'
                  placeholder='Confirm your password'
                  value={formData.confirmPassword}
                  onChangeText={value =>
                    handleInputChange('confirmPassword', value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoComplete='password-new'
                  returnKeyType='done'
                  onSubmitEditing={handleRegistration}
                  errorText={errors.confirmPassword}
                  rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
                {errors.confirmPassword && (
                  <HelperText text={errors.confirmPassword} type='error' />
                )}
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  style={styles.termsButton}
                >
                  <ThemedText
                    variant='caption'
                    style={{ color: theme.colors.gray['600'] }}
                  >
                    I agree to the{' '}
                    <ThemedText
                      variant='caption'
                      style={{ color: theme.colors.primary['500'] }}
                    >
                      Terms of Service
                    </ThemedText>{' '}
                    and{' '}
                    <ThemedText
                      variant='caption'
                      style={{ color: theme.colors.primary['500'] }}
                    >
                      Privacy Policy
                    </ThemedText>
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <ThemedButton
                title='Create Account'
                variant='primary'
                size='lg'
                onPress={handleRegistration}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
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
                  variant='caption'
                  style={[
                    styles.dividerText,
                    { color: theme.colors.gray['500'] },
                  ]}
                >
                  Or sign up with
                </ThemedText>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.gray['200'] },
                  ]}
                />
              </View>

              {/* Social Registration Buttons */}
              <View style={styles.socialContainer}>
                <ThemedButton
                  title='Google'
                  variant='outline'
                  size='md'
                  onPress={() => handleSocialRegistration('google')}
                  style={styles.socialButton}
                />

                {Platform.OS === 'ios' && (
                  <ThemedButton
                    title='Apple'
                    variant='outline'
                    size='md'
                    onPress={() => handleSocialRegistration('apple')}
                    style={styles.socialButton}
                  />
                )}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText
                variant='body'
                style={{ color: theme.colors.gray['500'] }}
              >
                Already have an account?{' '}
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 24,
  },
  generalError: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  registerButton: {
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

export default RegistrationScreen;
