import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, AddVehicleFormData } from '@/types/vehicle';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicleData: AddVehicleFormData) => Promise<boolean>;
  removeVehicle: (vehicleId: string) => Promise<boolean>;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => Promise<boolean>;
  assignDriverToVehicle: (vehicleId: string, driverId: string) => Promise<boolean>;
  unassignDriverFromVehicle: (vehicleId: string, driverId: string) => Promise<boolean>;
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles from Supabase when user changes
  useEffect(() => {
    const loadVehicles = async () => {
      if (!user) {
        setVehicles([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading vehicles:', error);
          setVehicles([]);
        } else {
          // Transform Supabase data to Vehicle type
          const transformedVehicles: Vehicle[] = data.map(vehicle => ({
            id: vehicle.id,
            number: vehicle.number,
            model: vehicle.model || "Not specified",
            payTapBalance: 0,
            fastTagLinked: false,
            driver: null,
            lastService: "Not scheduled",
            gpsLinked: false,
            challans: 0,
            documents: {
              pollution: { status: 'missing' as const },
              registration: { status: 'missing' as const },
              insurance: { status: 'missing' as const },
              license: { status: 'missing' as const }
            },
            financialData: [],
            userId: user.id
          }));
          setVehicles(transformedVehicles);
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

  const addVehicle = async (vehicleData: AddVehicleFormData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          user_id: user.id,
          number: vehicleData.number,
          model: vehicleData.model
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vehicle:', error);
        return false;
      }

      const newVehicle: Vehicle = {
        id: data.id,
        number: data.number,
        model: data.model || "Not specified",
        payTapBalance: 0,
        fastTagLinked: vehicleData.payTapActivationCode ? true : false,
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
      return true;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      return false;
    }
  };

  const removeVehicle = async (vehicleId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) {
        console.error('Error removing vehicle:', error);
        return false;
      }

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      return true;
    } catch (error) {
      console.error('Error removing vehicle:', error);
      return false;
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          number: updates.number,
          model: updates.model
        })
        .eq('id', vehicleId);

      if (error) {
        console.error('Error updating vehicle:', error);
        return false;
      }

      setVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return false;
    }
  };

  const assignDriverToVehicle = async (vehicleId: string, driverId: string): Promise<boolean> => {
    try {
      // Update driver's assigned vehicles
      const { data: currentDriver, error: driverError } = await supabase
        .from('drivers')
        .select('assigned_vehicles')
        .eq('id', driverId)
        .single();

      if (driverError) {
        console.error('Error fetching driver:', driverError);
        return false;
      }

      const updatedVehicles = [...(currentDriver.assigned_vehicles || []), vehicleId];

      const { error: updateError } = await supabase
        .from('drivers')
        .update({ assigned_vehicles: updatedVehicles })
        .eq('id', driverId);

      if (updateError) {
        console.error('Error assigning driver:', updateError);
        return false;
      }

      setVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === vehicleId 
            ? { ...vehicle, driver: { id: driverId, name: 'Assigned' } }
            : vehicle
        )
      );
      return true;
    } catch (error) {
      console.error('Error assigning driver:', error);
      return false;
    }
  };

  const unassignDriverFromVehicle = async (vehicleId: string, driverId: string): Promise<boolean> => {
    try {
      // Update driver's assigned vehicles
      const { data: currentDriver, error: driverError } = await supabase
        .from('drivers')
        .select('assigned_vehicles')
        .eq('id', driverId)
        .single();

      if (driverError) {
        console.error('Error fetching driver:', driverError);
        return false;
      }

      const updatedVehicles = (currentDriver.assigned_vehicles || []).filter((id: string) => id !== vehicleId);

      const { error: updateError } = await supabase
        .from('drivers')
        .update({ assigned_vehicles: updatedVehicles })
        .eq('id', driverId);

      if (updateError) {
        console.error('Error unassigning driver:', updateError);
        return false;
      }

      setVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === vehicleId ? { ...vehicle, driver: null } : vehicle
        )
      );
      return true;
    } catch (error) {
      console.error('Error unassigning driver:', error);
      return false;
    }
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