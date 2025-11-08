# Rapid Rinse - New Expo App

A modern React Native application built with Expo and TypeScript for car wash and cleaning services.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn start
   ```

3. Run on specific platforms:
   ```bash
   yarn ios     # Run on iOS simulator
   yarn android # Run on Android emulator
   yarn web     # Run on web browser
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── forms/          # Form components
│   ├── navigation/     # Navigation components
│   └── business/       # Business-specific components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home screens
│   ├── booking/       # Booking screens
│   ├── profile/       # Profile screens
│   └── business/      # Business screens
├── services/          # API and external services
│   ├── api/          # REST API services
│   ├── firebase/     # Firebase services
│   └── location/     # Location services
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants
└── theme/            # Theme configuration
```

## 🛠️ Development

### Code Quality

- **ESLint**: Code linting with Expo and Prettier configurations
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better developer experience
- **Husky**: Git hooks for pre-commit checks

### Scripts

- `yarn start` - Start Expo development server
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn web` - Run on web browser
- `yarn test` - Run tests with Jest
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues automatically
- `yarn type-check` - Run TypeScript type checking
- `yarn format` - Format code with Prettier

### Git Hooks

Pre-commit hooks are configured to run:

- ESLint checks
- TypeScript type checking

## 🏗️ Architecture

This project follows a modular architecture with:

- **Component-based structure**: Organized by feature and reusability
- **Service layer**: Separated API calls and external service integrations
- **Custom hooks**: Reusable stateful logic
- **TypeScript**: Full type safety throughout the application
- **Theme system**: Consistent styling and design tokens

## 📱 Platform Support

- **iOS**: Native iOS app
- **Android**: Native Android app
- **Web**: Progressive Web App (PWA)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations.

### Build Configuration

- `app.json`: Expo configuration
- `babel.config.js`: Babel configuration with path aliases
- `tsconfig.json`: TypeScript configuration with path mapping

## 📚 Legacy Application

The previous React Native Firebase app has been **deprecated and archived** in the `legacy/` directory.

### ⚠️ Important Notes

- **Status**: Deprecated (as of November 6, 2025)
- **End of Life**: January 1, 2026
- **Support**: Critical security fixes only until December 31, 2025

### 📖 Documentation

- **Migration Guide**: See `MIGRATION.md` for upgrading from legacy app
- **Deprecation Summary**: See `LEGACY_DEPRECATION_SUMMARY.md` for complete deprecation details
- **Legacy Documentation**: See `legacy/README.md`, `legacy/DEPRECATED.md`, and `legacy/ARCHIVE.md`

### 🚀 Why Migrate?

This enhanced version provides:

- ✨ Modern TypeScript architecture
- 🎨 Enhanced UI components and design system
- 🔧 Improved developer experience
- 📱 Better cross-platform compatibility
- 🧪 Comprehensive testing framework
- 🚀 Latest Expo SDK and React Native features

**New projects should use this enhanced version. Existing legacy users should migrate as soon as possible.**

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write TypeScript with proper type definitions
3. Add tests for new features
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
