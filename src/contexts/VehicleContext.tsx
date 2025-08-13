import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, AddVehicleFormData } from '@/types/vehicle';
import { useAuth } from './AuthContext';
import { fetchVehicleDetails } from '@/services/vehicleApi';

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedVehicles = localStorage.getItem(`vehicles_${user.id}`);
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
    } else {
      setVehicles([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save vehicles to localStorage whenever vehicles change
  useEffect(() => {
    if (user && vehicles.length > 0) {
      localStorage.setItem(`vehicles_${user.id}`, JSON.stringify(vehicles));
    }
  }, [vehicles, user]);

  const addVehicle = async (vehicleData: AddVehicleFormData) => {
    if (!user) return;

    // Fetch vehicle details from API
    const apiResponse = await fetchVehicleDetails(vehicleData.number);
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to fetch vehicle details');
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      number: vehicleData.number,
      model: apiResponse.model,
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
  };

  const removeVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
  };

  const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
      )
    );
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