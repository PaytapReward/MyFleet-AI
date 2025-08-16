import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, AddVehicleFormData } from '@/types/vehicle';
import { useAuth } from './AuthContext';
import { fetchVehicleDetails } from '@/services/vehicleApi';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicleData: AddVehicleFormData) => Promise<void>;
  removeVehicle: (vehicleId: string) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  assignDriverToVehicle: (vehicleId: string, driverId: string) => void;
  unassignDriverFromVehicle: (vehicleId: string, driverId: string) => void;
  isLoading: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadVehicles();
    } else {
      setVehicles([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadVehicles = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // First, try to migrate from localStorage if it exists
      await migrateFromLocalStorage();
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform Supabase data to Vehicle interface
      const transformedVehicles: Vehicle[] = data?.map(vehicle => ({
        id: vehicle.id,
        number: vehicle.number,
        model: vehicle.model || 'Unknown',
        payTapBalance: 0,
        fastTagLinked: false,
        driver: null,
        lastService: "Not scheduled",
        gpsLinked: false,
        challans: 0,
        documents: {
          pollution: { status: 'missing' },
          registration: { status: 'missing' },
          insurance: { status: 'missing' },
          license: { status: 'missing' }
        },
        financialData: [],
        userId: user.id
      })) || [];
      
      setVehicles(transformedVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast({
        title: "Error loading vehicles",
        description: "Failed to load your vehicles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const migrateFromLocalStorage = async () => {
    if (!user) return;
    
    const localKey = `vehicles_${user.id}`;
    const storedVehicles = localStorage.getItem(localKey);
    
    if (storedVehicles) {
      try {
        const localVehicles: Vehicle[] = JSON.parse(storedVehicles);
        
        // Check if we already have vehicles in Supabase
        const { data: existingVehicles } = await supabase
          .from('vehicles')
          .select('id')
          .eq('user_id', user.id);
        
        if (!existingVehicles?.length && localVehicles.length > 0) {
          // Migrate vehicles to Supabase
          const vehiclesToInsert = localVehicles.map(vehicle => ({
            id: vehicle.id,
            number: vehicle.number,
            model: vehicle.model,
            user_id: user.id
          }));
          
          const { error } = await supabase
            .from('vehicles')
            .insert(vehiclesToInsert);
          
          if (!error) {
            localStorage.removeItem(localKey);
            toast({
              title: "Data migrated",
              description: "Your vehicles have been migrated to the cloud.",
            });
          }
        }
      } catch (error) {
        console.error('Error migrating vehicles:', error);
      }
    }
  };

  const addVehicle = async (vehicleData: AddVehicleFormData) => {
    if (!user) return;

    try {
      // Fetch vehicle details from API
      const apiResponse = await fetchVehicleDetails(vehicleData.number);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to fetch vehicle details');
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          number: vehicleData.number,
          model: apiResponse.model,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newVehicle: Vehicle = {
        id: data.id,
        number: data.number,
        model: data.model || 'Unknown',
        payTapBalance: 0,
        fastTagLinked: false,
        driver: null,
        lastService: "Not scheduled",
        gpsLinked: false,
        challans: 0,
        documents: {
          pollution: { status: 'missing' },
          registration: { status: 'missing' },
          insurance: { status: 'missing' },
          license: { status: 'missing' }
        },
        financialData: [],
        userId: user.id
      };

      setVehicles(prev => [...prev, newVehicle]);
      
      toast({
        title: "Vehicle added successfully",
        description: `${vehicleData.number} has been added to your fleet.`,
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error adding vehicle",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeVehicle = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      
      toast({
        title: "Vehicle removed",
        description: "Vehicle has been removed from your fleet.",
      });
    } catch (error) {
      console.error('Error removing vehicle:', error);
      toast({
        title: "Error removing vehicle",
        description: "Failed to remove vehicle. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          number: updates.number,
          model: updates.model
        })
        .eq('id', vehicleId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
        )
      );
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error updating vehicle",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive"
      });
    }
  };

  const assignDriverToVehicle = (vehicleId: string, driverId: string) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId 
          ? { ...vehicle, driver: { id: driverId, name: 'Assigned' } }
          : vehicle
      )
    );
  };

  const unassignDriverFromVehicle = (vehicleId: string, driverId: string) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, driver: null } : vehicle
      )
    );
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        removeVehicle,
        updateVehicle,
        assignDriverToVehicle,
        unassignDriverFromVehicle,
        isLoading
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};