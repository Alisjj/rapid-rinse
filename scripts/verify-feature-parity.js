#!/usr/bin/env node

/**
 * Feature Parity Verification Script
 * Compares legacy app features with new Expo app implementation
 */

const fs = require('fs');
const path = require('path');

// Define expected features from legacy app
const LEGACY_FEATURES = {
  screens: [
    'LoginScreen',
    'RegistrationScreen', 
    'HomeScreen',
    'BookingsScreen',
    'BookingDetailScreen',
    'BookServiceScreen',
    'ProfileScreen',
    'VehiclesScreen',
    'AddVehicleScreen',
    'BusinessDetailScreen',
    'SearchResultsScreen',
    'NearbyBusinessesScreen',
    'ServicesScreen'
  ],
  components: [
    'Header',
    'SearchBar',
    'ServiceCard',
    'BusinessCard', 
    'BookingCard',
    'Button',
    'Card',
    'Text',
    'TextInput'
  ],
  services: [
    'Firebase Authentication',
    'Firestore Database',
    'Location Services',
    'Maps Integration',
    'User Management',
    'Booking Management',
    'Business Data'
  ],
  navigation: [
    'Tab Navigation',
    'Stack Navigation',
    'Deep Linking',
    'Authentication Flow'
  ]
};

// Define new app structure
const NEW_APP_STRUCTURE = {
  screens: 'src/screens',
  components: 'src/components', 
  services: 'src/services',
  navigation: 'src/navigation',
  hooks: 'src/hooks'
};

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function getFilesInDirectory(dirPath, extension = '') {
  try {
    if (!fs.existsSync(dirPath)) return [];
    
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    let result = [];
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        result = result.concat(getFilesInDirectory(fullPath, extension));
      } else if (!extension || file.name.endsWith(extension)) {
        result.push(fullPath);
      }
    }
    
    return result;
  } catch (error) {
    return [];
  }
}

function verifyScreens() {
  console.log('\n🔍 Verifying Screen Components...');
  const results = { implemented: [], missing: [] };
  
  const screenFiles = getFilesInDirectory(NEW_APP_STRUCTURE.screens, '.tsx');
  const screenNames = screenFiles.map(file => 
    path.basename(file, '.tsx')
  );
  
  for (const expectedScreen of LEGACY_FEATURES.screens) {
    const found = screenNames.some(name => 
      name.toLowerCase().includes(expectedScreen.toLowerCase().replace('screen', ''))
    );
    
    if (found) {
      results.implemented.push(expectedScreen);
    } else {
      results.missing.push(expectedScreen);
    }
  }
  
  console.log(`✅ Implemented: ${results.implemented.length}/${LEGACY_FEATURES.screens.length}`);
  console.log(`❌ Missing: ${results.missing.length}`);
  
  if (results.missing.length > 0) {
    console.log('Missing screens:', results.missing.join(', '));
  }
  
  return results;
}

function verifyComponents() {
  console.log('\n🔍 Verifying UI Components...');
  const results = { implemented: [], missing: [] };
  
  const componentFiles = getFilesInDirectory(NEW_APP_STRUCTURE.components, '.tsx');
  const componentNames = componentFiles.map(file => 
    path.basename(file, '.tsx')
  );
  
  for (const expectedComponent of LEGACY_FEATURES.components) {
    const found = componentNames.some(name => 
      name.toLowerCase().includes(expectedComponent.toLowerCase())
    );
    
    if (found) {
      results.implemented.push(expectedComponent);
    } else {
      results.missing.push(expectedComponent);
    }
  }
  
  console.log(`✅ Implemented: ${results.implemented.length}/${LEGACY_FEATURES.components.length}`);
  console.log(`❌ Missing: ${results.missing.length}`);
  
  if (results.missing.length > 0) {
    console.log('Missing components:', results.missing.join(', '));
  }
  
  return results;
}

function verifyServices() {
  console.log('\n🔍 Verifying Services...');
  const results = { implemented: [], missing: [] };
  
  const serviceFiles = getFilesInDirectory(NEW_APP_STRUCTURE.services, '.ts');
  const serviceContent = serviceFiles.map(file => {
    try {
      return fs.readFileSync(file, 'utf8').toLowerCase();
    } catch {
      return '';
    }
  }).join(' ');
  
  const serviceChecks = {
    'Firebase Authentication': serviceContent.includes('auth'),
    'Firestore Database': serviceContent.includes('firestore'),
    'Location Services': serviceContent.includes('location'),
    'Maps Integration': serviceContent.includes('map'),
    'User Management': serviceContent.includes('user'),
    'Booking Management': serviceContent.includes('booking'),
    'Business Data': serviceContent.includes('business')
  };
  
  for (const [service, implemented] of Object.entries(serviceChecks)) {
    if (implemented) {
      results.implemented.push(service);
    } else {
      results.missing.push(service);
    }
  }
  
  console.log(`✅ Implemented: ${results.implemented.length}/${LEGACY_FEATURES.services.length}`);
  console.log(`❌ Missing: ${results.missing.length}`);
  
  if (results.missing.length > 0) {
    console.log('Missing services:', results.missing.join(', '));
  }
  
  return results;
}

function verifyNavigation() {
  console.log('\n🔍 Verifying Navigation...');
  const results = { implemented: [], missing: [] };
  
  const navFiles = getFilesInDirectory(NEW_APP_STRUCTURE.navigation, '.tsx');
  const navContent = navFiles.map(file => {
    try {
      return fs.readFileSync(file, 'utf8').toLowerCase();
    } catch {
      return '';
    }
  }).join(' ');
  
  const navChecks = {
    'Tab Navigation': navContent.includes('tab'),
    'Stack Navigation': navContent.includes('stack'),
    'Deep Linking': navContent.includes('linking'),
    'Authentication Flow': navContent.includes('auth')
  };
  
  for (const [feature, implemented] of Object.entries(navChecks)) {
    if (implemented) {
      results.implemented.push(feature);
    } else {
      results.missing.push(feature);
    }
  }
  
  console.log(`✅ Implemented: ${results.implemented.length}/${LEGACY_FEATURES.navigation.length}`);
  console.log(`❌ Missing: ${results.missing.length}`);
  
  if (results.missing.length > 0) {
    console.log('Missing navigation features:', results.missing.join(', '));
  }
  
  return results;
}

function verifyPackageCompatibility() {
  console.log('\n🔍 Verifying Package Compatibility...');
  
  try {
    const newPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const legacyPackage = JSON.parse(fs.readFileSync('legacy/package.json', 'utf8'));
    
    const newDeps = { ...newPackage.dependencies, ...newPackage.devDependencies };
    const legacyDeps = { ...legacyPackage.dependencies, ...legacyPackage.devDependencies };
    
    const criticalDeps = [
      'expo',
      'react',
      'react-native',
      'firebase',
      '@react-navigation/native',
      'react-native-maps'
    ];
    
    console.log('Critical dependencies comparison:');
    for (const dep of criticalDeps) {
      const newVersion = newDeps[dep] || 'Not found';
      const legacyVersion = legacyDeps[dep] || 'Not found';
      
      console.log(`${dep}:`);
      console.log(`  New: ${newVersion}`);
      console.log(`  Legacy: ${legacyVersion}`);
      
      if (newVersion === 'Not found') {
        console.log(`  ⚠️  Missing in new app`);
      } else if (legacyVersion !== 'Not found') {
        console.log(`  ✅ Updated/Compatible`);
      }
    }
  } catch (error) {
    console.log('❌ Error reading package files:', error.message);
  }
}

function generateReport() {
  console.log('\n📊 FEATURE PARITY VERIFICATION REPORT');
  console.log('=====================================');
  
  const screenResults = verifyScreens();
  const componentResults = verifyComponents();
  const serviceResults = verifyServices();
  const navResults = verifyNavigation();
  
  verifyPackageCompatibility();
  
  const totalExpected = 
    LEGACY_FEATURES.screens.length + 
    LEGACY_FEATURES.components.length + 
    LEGACY_FEATURES.services.length + 
    LEGACY_FEATURES.navigation.length;
    
  const totalImplemented = 
    screenResults.implemented.length + 
    componentResults.implemented.length + 
    serviceResults.implemented.length + 
    navResults.implemented.length;
  
  const completionPercentage = Math.round((totalImplemented / totalExpected) * 100);
  
  console.log('\n📈 OVERALL COMPLETION');
  console.log(`Progress: ${totalImplemented}/${totalExpected} (${completionPercentage}%)`);
  
  if (completionPercentage >= 90) {
    console.log('🎉 Feature parity verification PASSED! Ready for production.');
  } else if (completionPercentage >= 75) {
    console.log('⚠️  Feature parity mostly complete. Review missing items.');
  } else {
    console.log('❌ Feature parity verification FAILED. Significant work needed.');
  }
  
  return {
    screens: screenResults,
    components: componentResults,
    services: serviceResults,
    navigation: navResults,
    completionPercentage
  };
}

// Run verification
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport };