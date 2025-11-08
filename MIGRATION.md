# Migration Guide: Legacy to Enhanced Expo App

This guide will help you migrate from the legacy React Native Firebase app to the new enhanced Expo implementation.

## 🎯 Overview

The new enhanced Expo app provides significant improvements over the legacy version:

- **Modern Architecture**: TypeScript-first with improved type safety
- **Enhanced UI/UX**: Modern design system with better accessibility
- **Better Performance**: Optimized components and state management
- **Improved DX**: Better development tools, testing, and workflows
- **Future-Proof**: Built with latest React Native and Expo SDK

## 📋 Pre-Migration Checklist

Before starting the migration, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed (`npm install -g @expo/cli`)
- [ ] Git repository backed up
- [ ] Firebase project credentials ready
- [ ] Development environment set up

## 🚀 Quick Start Migration

### Step 1: Navigate to New App

```bash
# From legacy directory
cd ..

# Install dependencies
npm install

# Start development server
npm start
```

### Step 2: Environment Configuration

1. **Copy Environment Variables**:

   ```bash
   # Copy from legacy app
   cp legacy/.env .env.example

   # Create your environment file
   cp .env.example .env
   ```

2. **Update Firebase Configuration**:
   - Copy Firebase config from `legacy/src/firebase/config.js`
   - Update `src/services/firebase/config.ts` with your credentials

### Step 3: Data Migration

The new app is compatible with existing Firebase data structures. No database migration is required.

## 📱 Feature Mapping

### Screens Migration

| Legacy Screen          | New Enhanced Screen      | Location                                          |
| ---------------------- | ------------------------ | ------------------------------------------------- |
| `LoginScreen`          | `LoginScreen`            | `src/screens/auth/LoginScreen.tsx`                |
| `RegistrationScreen`   | `RegistrationScreen`     | `src/screens/auth/RegistrationScreen.tsx`         |
| `HomeScreen`           | `HomeScreen`             | `src/screens/home/HomeScreen.tsx`                 |
| `BookingsScreen`       | `BookingsListScreen`     | `src/screens/booking/BookingsListScreen.tsx`      |
| `BookingDetailScreen`  | `BookingDetailScreen`    | `src/screens/booking/BookingDetailScreen.tsx`     |
| `BookServiceScreen`    | `BookServiceScreen`      | `src/screens/booking/BookServiceScreen.tsx`       |
| `ProfileScreen`        | `ProfileScreen`          | `src/screens/profile/ProfileScreen.tsx`           |
| `VehiclesScreen`       | `VehiclesListScreen`     | `src/screens/profile/VehiclesListScreen.tsx`      |
| `AddVehicleScreen`     | `AddVehicleScreen`       | `src/screens/profile/AddVehicleScreen.tsx`        |
| `BusinessDetailScreen` | `BusinessDetailScreen`   | `src/screens/business/BusinessDetailScreen.tsx`   |
| `SearchResultsScreen`  | `SearchResultsScreen`    | `src/screens/business/SearchResultsScreen.tsx`    |
| `NearByScreen`         | `NearbyBusinessesScreen` | `src/screens/business/NearbyBusinessesScreen.tsx` |
| `ServicesScreen`       | `ServicesScreen`         | `src/screens/business/ServicesScreen.tsx`         |

### Components Migration

| Legacy Component | New Enhanced Component | Location                                   |
| ---------------- | ---------------------- | ------------------------------------------ |
| `Header`         | `Header`               | `src/components/navigation/Header.tsx`     |
| `SearchBar`      | `SearchBar`            | `src/components/ui/SearchBar.tsx`          |
| `ServiceCard`    | `ServiceCard`          | `src/components/business/ServiceCard.tsx`  |
| `BusinessCard`   | `BusinessCard`         | `src/components/business/BusinessCard.tsx` |
| `BookingCard`    | `BookingCard`          | `src/components/business/BookingCard.tsx`  |
| `Button`         | `ThemedButton`         | `src/components/ui/ThemedButton.tsx`       |
| `Card`           | `ThemedCard`           | `src/components/ui/ThemedCard.tsx`         |
| `Text`           | `ThemedText`           | `src/components/ui/ThemedText.tsx`         |

### Services Migration

| Legacy Service | New Enhanced Service                               | Location                                   |
| -------------- | -------------------------------------------------- | ------------------------------------------ |
| Firebase Auth  | `authService`                                      | `src/services/firebase/authService.ts`     |
| Firestore      | `businessService`, `bookingService`, `userService` | `src/services/firebase/`                   |
| Location       | `locationService`                                  | `src/services/location/locationService.ts` |
| Maps           | `mapService`                                       | `src/services/location/mapService.ts`      |

## 🔧 Configuration Migration

### 1. Firebase Configuration

**Legacy** (`legacy/src/firebase/config.js`):

```javascript
const firebaseConfig = {
  // your config
};
```

**New** (`src/services/firebase/config.ts`):

```typescript
const firebaseConfig = {
  // your config
};
```

### 2. Navigation Configuration

The new app uses React Navigation 7.x with TypeScript. Navigation structure is similar but with enhanced type safety.

### 3. Styling Migration

**Legacy**: Individual StyleSheet objects
**New**: Design system with theme tokens

```typescript
// New theming approach
import { useTheme } from '../theme';

const { colors, spacing, typography } = useTheme();
```

## 🧪 Testing Migration

The new app includes comprehensive testing setup:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📦 Dependencies Migration

### Removed Dependencies

- `react-native-keyboard-aware-scroll-view` (replaced with built-in KeyboardAvoidingView)
- `base-64` (using built-in encoding)
- `url-parse` (using built-in URL APIs)

### Updated Dependencies

- `expo`: 51.0.38 (latest)
- `firebase`: 12.5.0 (updated)
- `@react-navigation/native`: 7.1.19 (updated)
- `react-native-maps`: 1.26.18 (updated)

### New Dependencies

- TypeScript support packages
- Testing framework (Jest + React Native Testing Library)
- Code quality tools (ESLint, Prettier, Husky)

## 🎨 UI/UX Improvements

### Design System

- Consistent color palette and typography
- Spacing and sizing tokens
- Component variants and states
- Accessibility improvements

### Enhanced Components

- Loading states and animations
- Error handling and validation
- Responsive design
- Better touch targets

## 🔍 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   ```bash
   # Ensure .env file exists and is properly formatted
   cp .env.example .env
   ```

2. **Firebase Connection Issues**

   ```bash
   # Verify Firebase configuration in src/services/firebase/config.ts
   ```

3. **TypeScript Errors**

   ```bash
   # Run type checking
   npm run type-check
   ```

4. **Build Issues**
   ```bash
   # Clear cache and reinstall
   npm run clean
   npm install
   ```

### Getting Help

- 📖 **Documentation**: Check `README.md` in root directory
- 🐛 **Issues**: Report issues in the project repository
- 💬 **Community**: Join our development community

## ✅ Post-Migration Checklist

After migration, verify:

- [ ] App starts without errors
- [ ] Authentication works (login/register)
- [ ] Firebase connection established
- [ ] All screens accessible
- [ ] Core features functional
- [ ] Tests passing
- [ ] Build successful

## 🚀 Next Steps

1. **Customize**: Adapt the app to your specific needs
2. **Test**: Run comprehensive testing
3. **Deploy**: Use Expo's build and deployment tools
4. **Monitor**: Set up analytics and error tracking

## 📞 Support

Need help with migration?

- **Documentation**: Check the enhanced app's README
- **Issues**: Create an issue in the repository
- **Community**: Join our developer community

---

**🎉 Welcome to the enhanced Expo app! Enjoy the improved development experience!**
