const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAriYhHldO265hKtlNIOidMGGUP6e3Ym3Y',
  authDomain: 'rapidrinse-a4cc9.firebaseapp.com',
  projectId: 'rapidrinse-a4cc9',
  storageBucket: 'rapidrinse-a4cc9.firebasestorage.app',
  messagingSenderId: '56716556651',
  appId: '1:56716556651:web:2feef65fa6fc281eb1742e',
  measurementId: 'G-WJW67EQ15Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data - Lagos businesses
const lagosBusinesses = [
  {
    ownerId: 'admin1',
    name: 'Sparkle Car Wash',
    description: 'Professional car washing services with eco-friendly products',
    address: '123 Main St, Lagos, Nigeria',
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
    },
    phone: '+2348012345678',
    email: 'info@sparklecarwash.com',
    imageUrl: 'https://example.com/sparkle.jpg',
    images: [],
    rating: 4.5,
    reviewCount: 12,
    services: [
      {
        id: 'wash1',
        name: 'Exterior Wash',
        description: 'Complete exterior cleaning',
        price: 2500,
        duration: 30,
        category: 'wash',
      },
      {
        id: 'wash2',
        name: 'Interior Cleaning',
        description: 'Deep interior cleaning',
        price: 3500,
        duration: 45,
        category: 'cleaning',
      },
      {
        id: 'wash3',
        name: 'Full Service',
        description: 'Exterior and interior cleaning',
        price: 5500,
        duration: 60,
        category: 'full',
      },
    ],
    operatingHours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '14:00', isOpen: true },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    ownerId: 'admin2',
    name: 'Elite Auto Detail',
    description: 'Premium detailing services for luxury vehicles',
    address: '456 Victoria Island, Lagos, Nigeria',
    location: {
      latitude: 6.4281,
      longitude: 3.4219,
    },
    phone: '+2348098765432',
    email: 'contact@eliteautodetail.com',
    imageUrl: 'https://example.com/elite.jpg',
    images: [],
    rating: 4.8,
    reviewCount: 8,
    services: [
      {
        id: 'detail1',
        name: 'Basic Detail',
        description: 'Exterior wash and interior vacuum',
        price: 8000,
        duration: 90,
        category: 'detail',
      },
      {
        id: 'detail2',
        name: 'Full Detail',
        description: 'Complete interior and exterior detailing',
        price: 15000,
        duration: 180,
        category: 'detail',
      },
      {
        id: 'detail3',
        name: 'Ceramic Coating',
        description: 'Professional ceramic coating protection',
        price: 25000,
        duration: 240,
        category: 'protection',
      },
    ],
    operatingHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '10:00', close: '15:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    ownerId: 'admin3',
    name: 'Quick Clean Car Wash',
    description: 'Fast and affordable car washing services',
    address: '789 Ikeja, Lagos, Nigeria',
    location: {
      latitude: 6.6018,
      longitude: 3.3515,
    },
    phone: '+2348055566677',
    email: 'hello@quickcleancars.com',
    imageUrl: 'https://example.com/quick.jpg',
    images: [],
    rating: 4.2,
    reviewCount: 25,
    services: [
      {
        id: 'quick1',
        name: 'Quick Wash',
        description: 'Fast exterior wash',
        price: 1500,
        duration: 15,
        category: 'wash',
      },
      {
        id: 'quick2',
        name: 'Express Clean',
        description: 'Quick interior and exterior',
        price: 3000,
        duration: 30,
        category: 'express',
      },
    ],
    operatingHours: {
      monday: { open: '07:00', close: '19:00', isOpen: true },
      tuesday: { open: '07:00', close: '19:00', isOpen: true },
      wednesday: { open: '07:00', close: '19:00', isOpen: true },
      thursday: { open: '07:00', close: '19:00', isOpen: true },
      friday: { open: '07:00', close: '19:00', isOpen: true },
      saturday: { open: '08:00', close: '18:00', isOpen: true },
      sunday: { open: '09:00', close: '16:00', isOpen: true },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Abuja businesses near Nile University and Lifecamp
const abujaBusinesses = [
  {
    ownerId: 'admin4',
    name: 'Nile Shine Car Wash',
    description: 'Convenient car washing near Nile University campus',
    address: 'Plot 1, Nile University Road, Abuja, Nigeria',
    location: {
      latitude: 9.0765,
      longitude: 7.3986,
    },
    phone: '+2348034567890',
    email: 'info@nileshine.com',
    imageUrl: 'https://example.com/nile.jpg',
    images: [],
    rating: 4.3,
    reviewCount: 15,
    services: [
      {
        id: 'nile1',
        name: 'Student Special Wash',
        description: 'Affordable wash for students',
        price: 2000,
        duration: 25,
        category: 'wash',
      },
      {
        id: 'nile2',
        name: 'Premium Detail',
        description: 'Full detailing service',
        price: 12000,
        duration: 120,
        category: 'detail',
      },
    ],
    operatingHours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '14:00', isOpen: true },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    ownerId: 'admin5',
    name: 'Lifecamp Auto Spa',
    description: 'Professional car care services in Lifecamp area',
    address: 'Lifecamp Junction, Abuja, Nigeria',
    location: {
      latitude: 9.076,
      longitude: 7.401,
    },
    phone: '+2348024681357',
    email: 'contact@lifecampautospa.com',
    imageUrl: 'https://example.com/lifecamp.jpg',
    images: [],
    rating: 4.6,
    reviewCount: 20,
    services: [
      {
        id: 'life1',
        name: 'Basic Wash',
        description: 'Exterior wash and dry',
        price: 3000,
        duration: 30,
        category: 'wash',
      },
      {
        id: 'life2',
        name: 'Interior Deep Clean',
        description: 'Complete interior cleaning',
        price: 5000,
        duration: 60,
        category: 'cleaning',
      },
      {
        id: 'life3',
        name: 'Executive Package',
        description: 'Full service with wax protection',
        price: 8000,
        duration: 90,
        category: 'full',
      },
    ],
    operatingHours: {
      monday: { open: '07:00', close: '19:00', isOpen: true },
      tuesday: { open: '07:00', close: '19:00', isOpen: true },
      wednesday: { open: '07:00', close: '19:00', isOpen: true },
      thursday: { open: '07:00', close: '19:00', isOpen: true },
      friday: { open: '07:00', close: '19:00', isOpen: true },
      saturday: { open: '08:00', close: '17:00', isOpen: true },
      sunday: { open: '09:00', close: '15:00', isOpen: true },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    ownerId: 'admin6',
    name: 'Abuja Car Care Center',
    description:
      'Comprehensive auto detailing and maintenance near Nile University',
    address: 'Behind Nile University, Jabi, Abuja, Nigeria',
    location: {
      latitude: 9.078,
      longitude: 7.4,
    },
    phone: '+2348091234567',
    email: 'info@abujacarcare.com',
    imageUrl: 'https://example.com/abuja.jpg',
    images: [],
    rating: 4.4,
    reviewCount: 18,
    services: [
      {
        id: 'abuja1',
        name: 'Standard Wash',
        description: 'Complete exterior cleaning',
        price: 3500,
        duration: 35,
        category: 'wash',
      },
      {
        id: 'abuja2',
        name: 'Deluxe Interior',
        description: 'Premium interior detailing',
        price: 7000,
        duration: 75,
        category: 'cleaning',
      },
      {
        id: 'abuja3',
        name: 'Ultimate Detail',
        description: 'Full ceramic coating package',
        price: 20000,
        duration: 180,
        category: 'detail',
      },
    ],
    operatingHours: {
      monday: { open: '08:30', close: '17:30', isOpen: true },
      tuesday: { open: '08:30', close: '17:30', isOpen: true },
      wednesday: { open: '08:30', close: '17:30', isOpen: true },
      thursday: { open: '08:30', close: '17:30', isOpen: true },
      friday: { open: '08:30', close: '17:30', isOpen: true },
      saturday: { open: '09:00', close: '16:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    ownerId: 'admin7',
    name: 'Campus Quick Wash',
    description: 'Fast car washing for busy students and staff',
    address: 'Nile University Gate, Abuja, Nigeria',
    location: {
      latitude: 9.0755,
      longitude: 7.399,
    },
    phone: '+2348067890123',
    email: 'wash@campusquick.com',
    imageUrl: 'https://example.com/campus.jpg',
    images: [],
    rating: 4.1,
    reviewCount: 30,
    services: [
      {
        id: 'campus1',
        name: 'Quick Exterior',
        description: 'Fast exterior wash only',
        price: 1500,
        duration: 15,
        category: 'wash',
      },
      {
        id: 'campus2',
        name: 'Combo Clean',
        description: 'Exterior and basic interior',
        price: 2500,
        duration: 25,
        category: 'express',
      },
    ],
    operatingHours: {
      monday: { open: '06:00', close: '20:00', isOpen: true },
      tuesday: { open: '06:00', close: '20:00', isOpen: true },
      wednesday: { open: '06:00', close: '20:00', isOpen: true },
      thursday: { open: '06:00', close: '20:00', isOpen: true },
      friday: { open: '06:00', close: '20:00', isOpen: true },
      saturday: { open: '07:00', close: '19:00', isOpen: true },
      sunday: { open: '08:00', close: '18:00', isOpen: true },
    },
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Combine all businesses
const sampleBusinesses = [...lagosBusinesses, ...abujaBusinesses];

async function populateFirestore() {
  console.log('🚀 Starting Firestore population...');

  try {
    // Add businesses
    for (const business of sampleBusinesses) {
      const businessRef = await addDoc(collection(db, 'businesses'), business);
      console.log(
        `✅ Added business: ${business.name} (ID: ${businessRef.id})`
      );

      // Services are embedded in the business document
      console.log(`   └─ Business has ${business.services.length} services`);
    }

    console.log('🎉 Firestore population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
  }
}

// Run the population script
populateFirestore();
