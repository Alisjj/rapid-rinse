import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile } from './authService';
import { formatDocumentData } from './utils';

// Vehicle interface
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleType: 'car' | 'truck' | 'suv' | 'motorcycle' | 'other';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User preferences interface
export interface UserPreferences {
  notifications: {
    bookingReminders: boolean;
    promotions: boolean;
    statusUpdates: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  distanceUnit: 'km' | 'miles';
  autoLocation: boolean;
}

// Favorite business interface
export interface FavoriteBusiness {
  businessId: string;
  businessName: string;
  addedAt: Date;
}

// User service class
export class UserService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly VEHICLES_COLLECTION = 'vehicles';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static cache = new Map<string, { data: any; timestamp: number }>();

  // Get user profile with extended data
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Check cache first
      const cached = this.cache.get(`profile_${userId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const profile = formatDocumentData<UserProfile>({
        id: userDoc.id,
        ...userDoc.data(),
      });

      // Cache the result
      this.cache.set(`profile_${userId}`, {
        data: profile,
        timestamp: Date.now(),
      });

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.cache.delete(`profile_${userId}`);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  // Update user preferences
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        preferences: preferences,
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.cache.delete(`profile_${userId}`);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  // Vehicle management
  static async addVehicle(
    userId: string,
    vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      // If this is the first vehicle or marked as default, make it default
      const existingVehicles = await this.getUserVehicles(userId);
      const isDefault = vehicleData.isDefault || existingVehicles.length === 0;

      // If setting as default, update other vehicles
      if (isDefault && existingVehicles.length > 0) {
        await Promise.all(
          existingVehicles.map((vehicle) =>
            this.updateVehicle(vehicle.id, { isDefault: false })
          )
        );
      }

      const vehicle = {
        ...vehicleData,
        userId,
        isDefault,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const vehicleRef = await addDoc(
        collection(db, this.VEHICLES_COLLECTION),
        vehicle
      );

      // Clear cache
      this.cache.delete(`vehicles_${userId}`);

      return vehicleRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw new Error('Failed to add vehicle');
    }
  }

  // Get user vehicles
  static async getUserVehicles(userId: string): Promise<Vehicle[]> {
    try {
      // Check cache first
      const cached = this.cache.get(`vehicles_${userId}`);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const vehiclesRef = collection(db, this.VEHICLES_COLLECTION);
      const q = query(
        vehiclesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vehicles: Vehicle[] = [];

      querySnapshot.forEach((doc) => {
        vehicles.push(
          formatDocumentData<Vehicle>({
            id: doc.id,
            ...doc.data(),
          })
        );
      });

      // Cache the result
      this.cache.set(`vehicles_${userId}`, {
        data: vehicles,
        timestamp: Date.now(),
      });

      return vehicles;
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      throw new Error('Failed to fetch user vehicles');
    }
  }

  // Update vehicle
  static async updateVehicle(
    vehicleId: string,
    updates: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const vehicleRef = doc(db, this.VEHICLES_COLLECTION, vehicleId);

      // If setting as default, get the vehicle to find userId and update others
      if (updates.isDefault) {
        const vehicleDoc = await getDoc(vehicleRef);
        if (vehicleDoc.exists()) {
          const vehicleData = vehicleDoc.data() as Vehicle;
          const userVehicles = await this.getUserVehicles(vehicleData.userId);

          // Update other vehicles to not be default
          await Promise.all(
            userVehicles
              .filter((v) => v.id !== vehicleId)
              .map((vehicle) =>
                updateDoc(doc(db, this.VEHICLES_COLLECTION, vehicle.id), {
                  isDefault: false,
                  updatedAt: serverTimestamp(),
                })
              )
          );

          // Clear cache
          this.cache.delete(`vehicles_${vehicleData.userId}`);
        }
      }

      await updateDoc(vehicleRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw new Error('Failed to update vehicle');
    }
  }

  // Delete vehicle
  static async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      // Get vehicle data to clear cache
      const vehicleRef = doc(db, this.VEHICLES_COLLECTION, vehicleId);
      const vehicleDoc = await getDoc(vehicleRef);

      if (vehicleDoc.exists()) {
        const vehicleData = vehicleDoc.data() as Vehicle;

        await deleteDoc(vehicleRef);

        // If this was the default vehicle, make another one default
        if (vehicleData.isDefault) {
          const remainingVehicles = await this.getUserVehicles(
            vehicleData.userId
          );
          if (remainingVehicles.length > 0) {
            await this.updateVehicle(remainingVehicles[0].id, {
              isDefault: true,
            });
          }
        }

        // Clear cache
        this.cache.delete(`vehicles_${vehicleData.userId}`);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw new Error('Failed to delete vehicle');
    }
  }

  // Favorite businesses management
  static async addFavoriteBusiness(
    userId: string,
    businessId: string,
    businessName: string
  ): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const favorite: FavoriteBusiness = {
        businessId,
        businessName,
        addedAt: new Date(),
      };

      await updateDoc(userRef, {
        favoriteBusinesses: arrayUnion(favorite),
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.cache.delete(`profile_${userId}`);
    } catch (error) {
      console.error('Error adding favorite business:', error);
      throw new Error('Failed to add favorite business');
    }
  }

  // Remove favorite business
  static async removeFavoriteBusiness(
    userId: string,
    businessId: string
  ): Promise<void> {
    try {
      // First get the current favorites to find the exact object to remove
      const profile = await this.getUserProfile(userId);
      if (!profile?.favoriteBusinesses) return;

      const favoriteToRemove = profile.favoriteBusinesses.find(
        (fav: FavoriteBusiness) => fav.businessId === businessId
      );

      if (favoriteToRemove) {
        const userRef = doc(db, this.USERS_COLLECTION, userId);
        await updateDoc(userRef, {
          favoriteBusinesses: arrayRemove(favoriteToRemove),
          updatedAt: serverTimestamp(),
        });

        // Clear cache
        this.cache.delete(`profile_${userId}`);
      }
    } catch (error) {
      console.error('Error removing favorite business:', error);
      throw new Error('Failed to remove favorite business');
    }
  }

  // Get user's favorite businesses
  static async getFavoriteBusinesses(
    userId: string
  ): Promise<FavoriteBusiness[]> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.favoriteBusinesses || [];
    } catch (error) {
      console.error('Error fetching favorite businesses:', error);
      throw new Error('Failed to fetch favorite businesses');
    }
  }

  // Check if business is favorited
  static async isBusinessFavorited(
    userId: string,
    businessId: string
  ): Promise<boolean> {
    try {
      const favorites = await this.getFavoriteBusinesses(userId);
      return favorites.some((fav) => fav.businessId === businessId);
    } catch (error) {
      console.error('Error checking if business is favorited:', error);
      return false;
    }
  }

  // Get user statistics
  static async getUserStatistics(userId: string): Promise<{
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    favoriteBusinessesCount: number;
    vehiclesCount: number;
  }> {
    try {
      // This would typically aggregate data from bookings collection
      // For now, return placeholder data
      const profile = await this.getUserProfile(userId);
      const vehicles = await this.getUserVehicles(userId);

      return {
        totalBookings: 0, // Would query bookings collection
        completedBookings: 0,
        cancelledBookings: 0,
        favoriteBusinessesCount: profile?.favoriteBusinesses?.length || 0,
        vehiclesCount: vehicles.length,
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }
}
