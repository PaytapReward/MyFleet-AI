import React, { createContext, useContext, useState, useEffect } from 'react';
import { AddVehicleFormData, Vehicle as AppVehicle } from '@/types/vehicle';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DBVehicle {
  id: string;
  user_id: string;
  number: string;
  model?: string;
  created_at: string;
  updated_at: string;
}

// Adapter function to convert DB vehicle to App vehicle
const adaptDBVehicleToAppVehicle = (dbVehicle: DBVehicle): AppVehicle => ({
  id: dbVehicle.id,
  number: dbVehicle.number,
  model: dbVehicle.model || 'Not specified',
  payTapBalance: 0, // Default values for missing properties
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
  userId: dbVehicle.user_id
});

interface VehicleContextType {
  vehicles: AppVehicle[];
  addVehicle: (vehicleData: AddVehicleFormData) => Promise<boolean>;
  removeVehicle: (vehicleId: string) => Promise<boolean>;
  updateVehicle: (vehicleId: string, updates: Partial<AppVehicle>) => Promise<boolean>;
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
  const [vehicles, setVehicles] = useState<AppVehicle[]>([]);
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
    try {
      if (!user) return;

      const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles?user_id=eq.${user.id}&select=*&order=created_at.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: DBVehicle[] = await response.json();
        const adaptedVehicles = data.map(adaptDBVehicleToAppVehicle);
        setVehicles(adaptedVehicles || []);
      } else {
        console.error('Error loading vehicles:', await response.text());
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: AddVehicleFormData): Promise<boolean> => {
    try {
      if (!user) {
        console.error('No authenticated user');
        return false;
      }

      // Check for duplicate vehicle number
      const checkResponse = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles?user_id=eq.${user.id}&number=eq.${vehicleData.number}&select=id`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (checkResponse.ok) {
        const existing = await checkResponse.json();
        if (existing && existing.length > 0) {
          throw new Error('Vehicle with this number already exists');
        }
      }

      const response = await fetch('https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          number: vehicleData.number,
          model: vehicleData.model
        })
      });

      if (!response.ok) {
        console.error('Error adding vehicle:', await response.text());
        return false;
      }

      const data: DBVehicle[] = await response.json();
      if (data && data.length > 0) {
        const adaptedVehicle = adaptDBVehicleToAppVehicle(data[0]);
        setVehicles(prev => [adaptedVehicle, ...prev]);
      }
      return true;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      return false;
    }
  };

  const removeVehicle = async (vehicleId: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles?id=eq.${vehicleId}&user_id=eq.${user?.id}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Error removing vehicle:', await response.text());
        return false;
      }

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      return true;
    } catch (error) {
      console.error('Error removing vehicle:', error);
      return false;
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<AppVehicle>): Promise<boolean> => {
    try {
      const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles?id=eq.${vehicleId}&user_id=eq.${user?.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          number: updates.number,
          model: updates.model
        })
      });

      if (!response.ok) {
        console.error('Error updating vehicle:', await response.text());
        return false;
      }

      const data: DBVehicle[] = await response.json();
      if (data && data.length > 0) {
        const adaptedVehicle = adaptDBVehicleToAppVehicle(data[0]);
        setVehicles(prev =>
          prev.map(vehicle =>
            vehicle.id === vehicleId ? { ...vehicle, ...adaptedVehicle } : vehicle
          )
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return false;
    }
  };

  // Legacy methods for backward compatibility
  const assignDriverToVehicle = async (vehicleId: string, driverId: string) => {
    // This would need to be implemented with a proper driver assignment system
    console.log('Driver assignment not yet implemented with Supabase');
  };

  const unassignDriverFromVehicle = async (vehicleId: string, driverId: string) => {
    // This would need to be implemented with a proper driver assignment system
    console.log('Driver unassignment not yet implemented with Supabase');
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        removeVehicle,
        updateVehicle,
        isLoading,
        assignDriverToVehicle,
        unassignDriverFromVehicle
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};