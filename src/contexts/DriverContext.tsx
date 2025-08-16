import React, { createContext, useContext, useState, useEffect } from 'react';
import { Driver, AddDriverFormData } from '@/types/driver';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriverContextType {
  drivers: Driver[];
  addDriver: (driverData: AddDriverFormData) => Promise<Driver>;
  updateDriver: (driverId: string, updates: Partial<Driver>) => void;
  removeDriver: (driverId: string) => void;
  getDriversByUser: (userId: string) => Driver[];
  assignDriverToVehicle: (driverId: string, vehicleId: string) => void;
  unassignDriverFromVehicle: (driverId: string, vehicleId: string) => void;
  getDriverById: (driverId: string) => Driver | undefined;
  isLoading: boolean;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const useDrivers = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDrivers must be used within a DriverProvider');
  }
  return context;
};

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load drivers from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadDrivers();
    } else {
      setDrivers([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadDrivers = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // First, try to migrate from localStorage
      await migrateFromLocalStorage();
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      // Transform Supabase data to Driver interface
      const transformedDrivers: Driver[] = data?.map(driver => ({
        id: driver.id,
        name: driver.full_name,
        licenseNumber: driver.license_number,
        dateOfBirth: '', // Not stored in Supabase schema
        phone: '', // Not stored in Supabase schema  
        userId: driver.user_id,
        createdAt: driver.created_at,
        assignedVehicles: driver.assigned_vehicles || []
      })) || [];
      
      setDrivers(transformedDrivers);
    } catch (error) {
      console.error('Error loading drivers:', error);
      toast({
        title: "Error loading drivers",
        description: "Failed to load your drivers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const migrateFromLocalStorage = async () => {
    if (!user) return;
    
    const localKey = `drivers_${user.id}`;
    const storedDrivers = localStorage.getItem(localKey);
    
    if (storedDrivers) {
      try {
        const localDrivers: Driver[] = JSON.parse(storedDrivers);
        
        // Check if we already have drivers in Supabase
        const { data: existingDrivers } = await supabase
          .from('drivers')
          .select('id')
          .eq('owner_id', user.id);
        
        if (!existingDrivers?.length && localDrivers.length > 0) {
          // Migrate drivers to Supabase
          const driversToInsert = localDrivers.map(driver => ({
            full_name: driver.name,
            license_number: driver.licenseNumber,
            assigned_vehicles: driver.assignedVehicles,
            owner_id: user.id,
            user_id: user.id,
            profile_id: user.id
          }));
          
          const { error } = await supabase
            .from('drivers')
            .insert(driversToInsert);
          
          if (!error) {
            localStorage.removeItem(localKey);
            toast({
              title: "Data migrated",
              description: "Your drivers have been migrated to the cloud.",
            });
          }
        }
      } catch (error) {
        console.error('Error migrating drivers:', error);
      }
    }
  };

  const addDriver = async (driverData: AddDriverFormData): Promise<Driver> => {
    if (!user) throw new Error('User must be logged in to add driver');

    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert({
          full_name: driverData.name,
          license_number: driverData.licenseNumber,
          assigned_vehicles: [],
          owner_id: user.id,
          user_id: user.id,
          profile_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newDriver: Driver = {
        id: data.id,
        name: data.full_name,
        licenseNumber: data.license_number,
        dateOfBirth: driverData.dateOfBirth,
        phone: driverData.phone,
        userId: data.user_id,
        createdAt: data.created_at,
        assignedVehicles: data.assigned_vehicles || []
      };

      setDrivers(prev => [...prev, newDriver]);
      
      toast({
        title: "Driver added successfully",
        description: `${driverData.name} has been added to your drivers.`,
      });
      
      return newDriver;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error adding driver",
        description: "Failed to add driver. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateDriver = async (driverId: string, updates: Partial<Driver>) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({
          full_name: updates.name,
          license_number: updates.licenseNumber,
          assigned_vehicles: updates.assignedVehicles
        })
        .eq('id', driverId)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      setDrivers(prev =>
        prev.map(driver =>
          driver.id === driverId ? { ...driver, ...updates } : driver
        )
      );
    } catch (error) {
      console.error('Error updating driver:', error);
      toast({
        title: "Error updating driver",
        description: "Failed to update driver. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeDriver = async (driverId: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', driverId)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      setDrivers(prev => prev.filter(driver => driver.id !== driverId));
      
      toast({
        title: "Driver removed",
        description: "Driver has been removed from your list.",
      });
    } catch (error) {
      console.error('Error removing driver:', error);
      toast({
        title: "Error removing driver",
        description: "Failed to remove driver. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDriversByUser = (userId: string) => {
    return drivers.filter(driver => driver.userId === userId);
  };

  const assignDriverToVehicle = (driverId: string, vehicleId: string) => {
    setDrivers(prev =>
      prev.map(driver =>
        driver.id === driverId
          ? { ...driver, assignedVehicles: [...driver.assignedVehicles.filter(id => id !== vehicleId), vehicleId] }
          : driver
      )
    );
  };

  const unassignDriverFromVehicle = (driverId: string, vehicleId: string) => {
    setDrivers(prev =>
      prev.map(driver =>
        driver.id === driverId
          ? { ...driver, assignedVehicles: driver.assignedVehicles.filter(id => id !== vehicleId) }
          : driver
      )
    );
  };

  const getDriverById = (driverId: string) => {
    return drivers.find(driver => driver.id === driverId);
  };

  return (
    <DriverContext.Provider
      value={{
        drivers,
        addDriver,
        updateDriver,
        removeDriver,
        getDriversByUser,
        assignDriverToVehicle,
        unassignDriverFromVehicle,
        getDriverById,
        isLoading
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};