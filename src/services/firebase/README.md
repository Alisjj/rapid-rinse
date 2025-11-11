# Firebase Configuration

This directory contains the Firebase configuration and initialization for the RapidRinse application.

## Setup

### 1. Firebase Project

The app is configured to use the Firebase project: `rapidrinse-a4cc9`

### 2. Environment Variables

Firebase credentials are stored in environment variables for security. The configuration supports multiple sources:

1. `.env` file (for local development)
2. `app.json` extra field (for Expo builds)
3. Hardcoded fallbacks (for quick development)

### 3. Configuration Files

#### Web/Expo

- Configuration is loaded from environment variables or `app.json`
- See `.env.example` for required variables

#### iOS

- `GoogleService-Info.plist` in the root directory
- Automatically linked via `app.json`

#### Android

- `google-services.json` in the root directory
- Automatically linked via `app.json`

## Usage

### Importing Firebase Services

```typescript
import { auth, db, storage } from '@/services/firebase/config';
```

### Using Firebase Services

```typescript
// Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase/config';

const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Firestore
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const getBusinesses = async () => {
  const snapshot = await getDocs(collection(db, 'businesses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/services/firebase/config';

const uploadImage = async (uri: string, path: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};
```

## Features

### Offline Persistence

Firestore is configured with offline persistence enabled, allowing the app to work offline and sync when connectivity is restored.

### Automatic Initialization

Firebase is automatically initialized when the app starts via the import in `app/_layout.tsx`. No manual initialization is required.

### Error Handling

The configuration includes comprehensive error handling and logging to help diagnose initialization issues.

## Security

- Never commit `.env` files with real credentials to version control
- Use environment-specific Firebase projects (dev, staging, production)
- Ensure Firestore security rules are properly configured
- Use Firebase App Check in production to prevent abuse

## Troubleshooting

### Firebase not initializing

Check the console logs for error messages. Common issues:

- Invalid API key or project ID
- Network connectivity issues
- Missing configuration files for iOS/Android

### Offline persistence errors

If you see persistence errors, try:

1. Clear app data/cache
2. Reinstall the app
3. Check that the device has sufficient storage

### Platform-specific issues

#### iOS

- Ensure `GoogleService-Info.plist` is in the root directory
- Run `npx expo prebuild` to regenerate native projects
- Check that the bundle identifier matches Firebase console

#### Android

- Ensure `google-services.json` is in the root directory
- Run `npx expo prebuild` to regenerate native projects
- Check that the package name matches Firebase console
