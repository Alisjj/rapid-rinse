import { describe, it, expect } from '@jest/globals';

describe('Firebase Configuration', () => {
  it('should export firebase configuration', () => {
    const { firebaseConfig } = require('../config');

    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.apiKey).toBeDefined();
    expect(firebaseConfig.projectId).toBe('rapidrinse-a4cc9');
    expect(firebaseConfig.authDomain).toBe('rapidrinse-a4cc9.firebaseapp.com');
  });

  it('should export firebase instances', () => {
    const { app, auth, db, storage } = require('../config');

    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
  });

  it('should indicate firestore is available', () => {
    const { firestoreAvailable } = require('../config');

    expect(firestoreAvailable).toBe(true);
  });
});
