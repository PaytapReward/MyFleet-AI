import React, { createContext, useContext, useState, useEffect } from 'react';
import { Driver, AddDriverFormData } from '@/types/driver';
import { useAuth } from './AuthContext';

interface DriverContextType {
  drivers: Driver[];
  addDriver: (driverData: AddDriverFormData) => Driver;
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
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load drivers from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedDrivers = localStorage.getItem(`drivers_${user.id}`);
      if (storedDrivers) {
        setDrivers(JSON.parse(storedDrivers));
      }
    } else {
      setDrivers([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save drivers to localStorage whenever drivers change
  useEffect(() => {
    if (user && drivers.length >= 0) {
      localStorage.setItem(`drivers_${user.id}`, JSON.stringify(drivers));
    }
  }, [drivers, user]);

  const addDriver = (driverData: AddDriverFormData): Driver => {
    if (!user) throw new Error('User must be logged in to add driver');

    const newDriver: Driver = {
      id: Date.now().toString(),
      name: driverData.name,
      licenseNumber: driverData.licenseNumber,
      dateOfBirth: driverData.dateOfBirth,
      phone: driverData.phone,
      userId: user.id,
      createdAt: new Date().toISOString(),
      assignedVehicles: []
    };

    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const updateDriver = (driverId: string, updates: Partial<Driver>) => {
    setDrivers(prev =>
      prev.map(driver =>
        driver.id === driverId ? { ...driver, ...updates } : driver
      )
    );
  };

  const removeDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId));
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