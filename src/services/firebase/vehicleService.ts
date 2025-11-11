import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { VehicleInfo } from '@/types';

export interface Vehicle extends VehicleInfo {
  userId: string;
  type?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleData {
  userId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  type?: string;
  isDefault?: boolean;
}

export class VehicleService {
  private static readonly COLLECTION_NAME = 'vehicles';

  // Create a new vehicle
  static async createVehicle(vehicleData: CreateVehicleData): Promise<string> {
    try {
      console.log('Creating vehicle:', vehicleData);

      // If this is set as default, unset other default vehicles for this user
      if (vehicleData.isDefault) {
        await this.unsetDefaultVehicles(vehicleData.userId);
      }

      const vehicle = {
        ...vehicleData,
        isDefault: vehicleData.isDefault ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const vehicleRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        vehicle
      );

      console.log('Vehicle created with ID:', vehicleRef.id);
      return vehicleRef.id;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to create vehicle');
    }
  }

  // Get all vehicles for a user
  static async getUserVehicles(userId: string): Promise<Vehicle[]> {
    try {
      console.log('Fetching vehicles for user:', userId);

      const vehiclesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        vehiclesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vehicles: Vehicle[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        vehicles.push({
          id: doc.id,
          userId: data.userId,
          make: data.make,
          model: data.model,
          year: data.year,
          plateNumber: data.plateNumber,
          color: data.color,
          type: data.type,
          isDefault: data.isDefault || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      console.log('Found', vehicles.length, 'vehicles');
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch vehicles');
    }
  }

  // Get a specific vehicle by ID
  static async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    try {
      const vehicleRef = doc(db, this.COLLECTION_NAME, vehicleId);
      const vehicleDoc = await getDoc(vehicleRef);

      if (!vehicleDoc.exists()) {
        return null;
      }

      const data = vehicleDoc.data();
      return {
        id: vehicleDoc.id,
        userId: data.userId,
        make: data.make,
        model: data.model,
        year: data.year,
        plateNumber: data.plateNumber,
        color: data.color,
        type: data.type,
        isDefault: data.isDefault || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch vehicle');
    }
  }

  // Update a vehicle
  static async updateVehicle(
    vehicleId: string,
    updates: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const vehicleRef = doc(db, this.COLLECTION_NAME, vehicleId);

      // If setting as default, unset other defaults for this user
      if (updates.isDefault) {
        const vehicle = await this.getVehicleById(vehicleId);
        if (vehicle) {
          await this.unsetDefaultVehicles(vehicle.userId);
        }
      }

      await updateDoc(vehicleRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      console.log('Vehicle updated:', vehicleId);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to update vehicle');
    }
  }

  // Delete a vehicle
  static async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const vehicleRef = doc(db, this.COLLECTION_NAME, vehicleId);
      await deleteDoc(vehicleRef);
      console.log('Vehicle deleted:', vehicleId);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to delete vehicle');
    }
  }

  // Set a vehicle as default
  static async setDefaultVehicle(
    vehicleId: string,
    userId: string
  ): Promise<void> {
    try {
      // Unset all default vehicles for this user
      await this.unsetDefaultVehicles(userId);

      // Set this vehicle as default
      const vehicleRef = doc(db, this.COLLECTION_NAME, vehicleId);
      await updateDoc(vehicleRef, {
        isDefault: true,
        updatedAt: serverTimestamp(),
      });

      console.log('Vehicle set as default:', vehicleId);
    } catch (error) {
      console.error('Error setting default vehicle:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to set default vehicle');
    }
  }

  // Unset all default vehicles for a user
  private static async unsetDefaultVehicles(userId: string): Promise<void> {
    try {
      const vehicles = await this.getUserVehicles(userId);
      const defaultVehicles = vehicles.filter(v => v.isDefault);

      await Promise.all(
        defaultVehicles.map(vehicle =>
          updateDoc(doc(db, this.COLLECTION_NAME, vehicle.id), {
            isDefault: false,
            updatedAt: serverTimestamp(),
          })
        )
      );
    } catch (error) {
      console.error('Error unsetting default vehicles:', error);
    }
  }

  // Get default vehicle for a user
  static async getDefaultVehicle(userId: string): Promise<Vehicle | null> {
    try {
      const vehicles = await this.getUserVehicles(userId);
      return vehicles.find(v => v.isDefault) || null;
    } catch (error) {
      console.error('Error fetching default vehicle:', error);
      return null;
    }
  }
}
