import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import enhanced components
import {
  ThemedText,
  ThemedTextInput,
  ThemedButton,
  ThemedCard,
  HelperText,
} from '@/components/ui';
import { Header } from '@/components/navigation';

// Import types and theme
import { ProfileStackParamList } from '@/types';
import { useTheme } from '@/theme';

// Import services (placeholder for now)
// import { createVehicle } from '@/services/api';

type AddVehicleScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'AddVehicle'
>;
type AddVehicleScreenRouteProp = RouteProp<ProfileStackParamList, 'AddVehicle'>;

interface AddVehicleScreenProps {
  navigation: AddVehicleScreenNavigationProp;
  route: AddVehicleScreenRouteProp;
}

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  color: string;
  type: string;
}

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  plateNumber?: string;
  color?: string;
  type?: string;
  general?: string;
}

const AddVehicleScreen: React.FC<AddVehicleScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    plateNumber: '',
    color: '',
    type: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Vehicle type options
  const vehicleTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Truck',
    'Van',
    'Wagon',
    'Other',
  ];

  // Color options
  const colorOptions = [
    'Black',
    'White',
    'Silver',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Brown',
    'Other',
  ];

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Make validation
    if (!formData.make.trim()) {
      newErrors.make = 'Vehicle make is required';
    } else if (formData.make.trim().length < 2) {
      newErrors.make = 'Make must be at least 2 characters';
    }

    // Model validation
    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required';
    } else if (formData.model.trim().length < 2) {
      newErrors.model = 'Model must be at least 2 characters';
    }

    // Year validation
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    // Plate number validation
    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'Plate number is required';
    } else if (formData.plateNumber.trim().length < 2) {
      newErrors.plateNumber = 'Plate number must be at least 2 characters';
    }

    // Color validation
    if (!formData.color.trim()) {
      newErrors.color = 'Vehicle color is required';
    }

    // Type validation
    if (!formData.type.trim()) {
      newErrors.type = 'Vehicle type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const validateField = (field: keyof VehicleFormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'make':
        if (!value.trim()) {
          newErrors.make = 'Vehicle make is required';
        } else if (value.trim().length < 2) {
          newErrors.make = 'Make must be at least 2 characters';
        } else {
          delete newErrors.make;
        }
        break;
      case 'model':
        if (!value.trim()) {
          newErrors.model = 'Vehicle model is required';
        } else if (value.trim().length < 2) {
          newErrors.model = 'Model must be at least 2 characters';
        } else {
          delete newErrors.model;
        }
        break;
      case 'year':
        if (!value.trim()) {
          newErrors.year = 'Year is required';
        } else {
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1900 || year > currentYear + 1) {
            newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
          } else {
            delete newErrors.year;
          }
        }
        break;
      case 'plateNumber':
        if (!value.trim()) {
          newErrors.plateNumber = 'Plate number is required';
        } else if (value.trim().length < 2) {
          newErrors.plateNumber = 'Plate number must be at least 2 characters';
        } else {
          delete newErrors.plateNumber;
        }
        break;
      case 'color':
        if (!value.trim()) {
          newErrors.color = 'Vehicle color is required';
        } else {
          delete newErrors.color;
        }
        break;
      case 'type':
        if (!value.trim()) {
          newErrors.type = 'Vehicle type is required';
        } else {
          delete newErrors.type;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }

    // Real-time validation with debounce
    setTimeout(() => validateField(field, value), 300);
  };

  // Handle form submission
  const handleAddVehicle = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Mock vehicle creation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success!', 'Vehicle added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      setErrors({
        general: error.message || 'Failed to add vehicle. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title='Add Vehicle' />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <ThemedCard style={styles.formCard}>
            <ThemedText variant='h4' style={styles.formTitle}>
              Vehicle Information
            </ThemedText>

            {/* General Error */}
            {errors.general && (
              <HelperText
                text={errors.general}
                type='error'
                style={styles.generalError}
              />
            )}

            {/* Make Input */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                label='Make *'
                placeholder='e.g., Toyota, Honda, Ford'
                value={formData.make}
                onChangeText={value => handleInputChange('make', value)}
                autoCapitalize='words'
                returnKeyType='next'
                errorText={errors.make}
              />
              {errors.make && <HelperText text={errors.make} type='error' />}
            </View>

            {/* Model Input */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                label='Model *'
                placeholder='e.g., Camry, Civic, F-150'
                value={formData.model}
                onChangeText={value => handleInputChange('model', value)}
                autoCapitalize='words'
                returnKeyType='next'
                errorText={errors.model}
              />
              {errors.model && <HelperText text={errors.model} type='error' />}
            </View>

            {/* Year Input */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                label='Year *'
                placeholder='e.g., 2020'
                value={formData.year}
                onChangeText={value => handleInputChange('year', value)}
                keyboardType='numeric'
                maxLength={4}
                returnKeyType='next'
                errorText={errors.year}
              />
              {errors.year && <HelperText text={errors.year} type='error' />}
            </View>

            {/* Plate Number Input */}
            <View style={styles.inputContainer}>
              <ThemedTextInput
                label='Plate Number *'
                placeholder='e.g., ABC123'
                value={formData.plateNumber}
                onChangeText={value =>
                  handleInputChange('plateNumber', value.toUpperCase())
                }
                autoCapitalize='characters'
                returnKeyType='next'
                errorText={errors.plateNumber}
              />
              {errors.plateNumber && (
                <HelperText text={errors.plateNumber} type='error' />
              )}
            </View>

            {/* Color Selection */}
            <View style={styles.inputContainer}>
              <ThemedText variant='body' style={styles.sectionLabel}>
                Color *
              </ThemedText>
              <View style={styles.optionsGrid}>
                {colorOptions.map(color => (
                  <ThemedButton
                    key={color}
                    variant={formData.color === color ? 'primary' : 'outline'}
                    size='sm'
                    title={color}
                    onPress={() => handleInputChange('color', color)}
                    style={styles.optionButton}
                  />
                ))}
              </View>
              {errors.color && <HelperText text={errors.color} type='error' />}
            </View>

            {/* Type Selection */}
            <View style={styles.inputContainer}>
              <ThemedText variant='body' style={styles.sectionLabel}>
                Vehicle Type *
              </ThemedText>
              <View style={styles.optionsGrid}>
                {vehicleTypes.map(type => (
                  <ThemedButton
                    key={type}
                    variant={formData.type === type ? 'primary' : 'outline'}
                    size='sm'
                    title={type}
                    onPress={() => handleInputChange('type', type)}
                    style={styles.optionButton}
                  />
                ))}
              </View>
              {errors.type && <HelperText text={errors.type} type='error' />}
            </View>

            {/* Info Text */}
            <HelperText
              text='* Required fields. This information helps us provide better service recommendations.'
              type='default'
              style={styles.infoText}
            />
          </ThemedCard>

          {/* Add Button */}
          <View style={styles.buttonContainer}>
            <ThemedButton
              variant='primary'
              size='lg'
              title={isLoading ? 'Adding Vehicle...' : 'Add Vehicle'}
              onPress={handleAddVehicle}
              loading={isLoading}
              disabled={isLoading}
              style={styles.addButton}
            />
          </View>
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
  content: {
    flex: 1,
  },
  formCard: {
    margin: 16,
    marginBottom: 8,
  },
  formTitle: {
    marginBottom: 20,
  },
  generalError: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 12,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    minWidth: 80,
    marginBottom: 8,
  },
  infoText: {
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
  },
  addButton: {
    width: '100%',
  },
});

export default AddVehicleScreen;
