/**
 * Test script to verify authentication flow
 * This script tests the authentication protection and Firebase integration
 */

const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Firebase config (you would normally import this from your config file)
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Firebase initialized');

    // Test data
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';

    console.log('📝 Testing user registration...');

    // Test registration
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      testEmail,
      testPassword
    );
    const user = userCredential.user;

    console.log('✅ User registered successfully:', user.uid);

    // Test profile creation
    const userProfile = {
      id: user.uid,
      email: testEmail,
      fullName: testName,
      phoneNumber: '+1234567890',
      preferences: {
        notifications: true,
        theme: 'system',
        language: 'en',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✅ User profile created in Firestore');

    // Test login
    console.log('🔐 Testing user login...');
    await signOut(auth); // Sign out first
    const loginResult = await signInWithEmailAndPassword(
      auth,
      testEmail,
      testPassword
    );
    console.log('✅ User logged in successfully:', loginResult.user.uid);

    // Test profile retrieval
    console.log('📖 Testing profile retrieval...');
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      console.log('✅ User profile retrieved:', profile.fullName);
    } else {
      throw new Error('Profile not found');
    }

    // Test logout
    console.log('🚪 Testing logout...');
    await signOut(auth);
    console.log('✅ User logged out successfully');

    console.log('\n🎉 All authentication tests passed!');
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testAuthFlow();
}

module.exports = { testAuthFlow };
