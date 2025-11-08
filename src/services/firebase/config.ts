// Mock Firebase configuration for development
// This allows the app to run without Firebase setup

// Mock Firebase App
export const app = {
  name: '[DEFAULT]',
  options: {},
} as any;

// Mock Auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    // Call with null user immediately
    setTimeout(() => callback(null), 0);
    return () => {}; // unsubscribe function
  },
} as any;

// Mock Firestore
export const db = {} as any;

// Mock Storage
export const storage = {} as any;

// Firebase config (for reference)
export const firebaseConfig = {
  apiKey: 'AIzaSyAriYhHldO265hKtlNIOidMGGUP6e3Ym3Y',
  authDomain: 'rapidrinse-a4cc9.firebaseapp.com',
  projectId: 'rapidrinse-a4cc9',
  storageBucket: 'rapidrinse-a4cc9.firebasestorage.app',
  messagingSenderId: '56716556651',
  appId: '1:56716556651:web:2feef65fa6fc281eb1742e',
  measurementId: 'G-WJW67EQ15Y',
};

export const firestoreAvailable = false;

console.log('🎭 Using mock Firebase (no backend required)');
console.log('💡 To use real Firebase, update src/services/firebase/config.ts');
