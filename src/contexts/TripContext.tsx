import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trip, CreateTripFormData, TripFilters, TripAnalytics, TripStatus } from '@/types/trip';
import { useAuth } from './AuthContext';

interface TripContextType {
  trips: Trip[];
  analytics: TripAnalytics;
  isLoading: boolean;
  createTrip: (tripData: CreateTripFormData) => Promise<Trip>;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  getFilteredTrips: (filters: TripFilters) => Trip[];
  refreshAnalytics: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [analytics, setAnalytics] = useState<TripAnalytics>({
    totalTrips: 0,
    activeTrips: 0,
    completedToday: 0,
    todaysEarnings: 0,
    todaysProfit: 0,
    profitPercentage: 0,
    averageDistance: 0,
    averageDuration: 0,
    topDestinations: [],
    driverPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load trips from localStorage on mount
  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  // Save trips to localStorage whenever trips change
  useEffect(() => {
    if (user && trips.length > 0) {
      localStorage.setItem(`trips_${user.id}`, JSON.stringify(trips));
    }
  }, [trips, user]);

  // Recalculate analytics whenever trips change
  useEffect(() => {
    calculateAnalytics();
  }, [trips]);

  const loadTrips = () => {
    setIsLoading(true);
    try {
      const savedTrips = localStorage.getItem(`trips_${user?.id}`);
      if (savedTrips) {
        setTrips(JSON.parse(savedTrips));
      } else {
        // Generate some mock data for demonstration
        generateMockTrips();
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      generateMockTrips();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockTrips = () => {
    const mockTrips: Trip[] = [
      {
        id: '1',
        tripNumber: 'TRP001',
        status: 'active',
        type: 'local',
        pickup: { address: 'Koramangala 5th Block, Bangalore' },
        destination: { address: 'Brigade Road, Bangalore' },
        vehicleId: 'v1',
        vehicleNumber: 'KA01AB1234',
        driverId: 'd1',
        driverName: 'Ravi Kumar',
        passenger: {
          id: 'p1',
          name: 'Anish Sharma',
          phone: '+91 98765 43210'
        },
        scheduledStartTime: new Date().toISOString(),
        actualStartTime: new Date().toISOString(),
        estimatedEndTime: new Date(Date.now() + 30 * 60000).toISOString(),
        distance: 12,
        duration: 25,
        earnings: {
          totalFare: 280,
          baseFare: 240,
          extraCharges: 40,
          tolls: 20,
          fuel: 60,
          driverPay: 140,
          netProfit: 60
        },
        eta: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.id || ''
      },
      {
        id: '2',
        tripNumber: 'TRP002',
        status: 'completed',
        type: 'airport',
        pickup: { address: 'Whitefield, Bangalore' },
        destination: { address: 'Kempegowda International Airport, Bangalore' },
        vehicleId: 'v2',
        vehicleNumber: 'KA01CD5678',
        driverId: 'd2',
        driverName: 'Suresh Reddy',
        passenger: {
          id: 'p2',
          name: 'Priya Nair',
          phone: '+91 87654 32109'
        },
        scheduledStartTime: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        actualStartTime: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        actualEndTime: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        distance: 45,
        duration: 75,
        earnings: {
          totalFare: 850,
          baseFare: 750,
          extraCharges: 100,
          tolls: 80,
          fuel: 200,
          driverPay: 400,
          netProfit: 170
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        userId: user?.id || ''
      }
    ];
    setTrips(mockTrips);
  };

  const calculateAnalytics = () => {
    const today = new Date().toDateString();
    const completedToday = trips.filter(trip => 
      trip.status === 'completed' && 
      new Date(trip.actualEndTime || trip.createdAt).toDateString() === today
    );
    
    const activeTrips = trips.filter(trip => trip.status === 'active');
    
    const todaysEarnings = completedToday.reduce((sum, trip) => sum + trip.earnings.totalFare, 0);
    const todaysProfit = completedToday.reduce((sum, trip) => sum + trip.earnings.netProfit, 0);
    const profitPercentage = todaysEarnings > 0 ? (todaysProfit / todaysEarnings) * 100 : 0;
    
    const completedTrips = trips.filter(trip => trip.status === 'completed');
    const averageDistance = completedTrips.length > 0 
      ? completedTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0) / completedTrips.length 
      : 0;
    
    const averageDuration = completedTrips.length > 0
      ? completedTrips.reduce((sum, trip) => sum + (trip.duration || 0), 0) / completedTrips.length
      : 0;

    const destinationMap = new Map<string, { count: number; earnings: number }>();
    completedTrips.forEach(trip => {
      const dest = trip.destination.address;
      const existing = destinationMap.get(dest) || { count: 0, earnings: 0 };
      destinationMap.set(dest, {
        count: existing.count + 1,
        earnings: existing.earnings + trip.earnings.netProfit
      });
    });

    const topDestinations = Array.from(destinationMap.entries())
      .map(([destination, data]) => ({ destination, ...data }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);

    const driverMap = new Map<string, { trips: number; earnings: number }>();
    completedTrips.forEach(trip => {
      const driver = trip.driverId;
      const existing = driverMap.get(driver) || { trips: 0, earnings: 0 };
      driverMap.set(driver, {
        trips: existing.trips + 1,
        earnings: existing.earnings + trip.earnings.netProfit
      });
    });

    const driverPerformance = Array.from(driverMap.entries())
      .map(([driverId, data]) => {
        const trip = trips.find(t => t.driverId === driverId);
        return {
          driverId,
          driverName: trip?.driverName || 'Unknown',
          ...data
        };
      })
      .sort((a, b) => b.earnings - a.earnings);

    setAnalytics({
      totalTrips: trips.length,
      activeTrips: activeTrips.length,
      completedToday: completedToday.length,
      todaysEarnings,
      todaysProfit,
      profitPercentage,
      averageDistance,
      averageDuration,
      topDestinations,
      driverPerformance
    });
  };

  const createTrip = async (tripData: CreateTripFormData): Promise<Trip> => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      tripNumber: `TRP${(trips.length + 1).toString().padStart(3, '0')}`,
      status: 'pending',
      type: tripData.type,
      pickup: tripData.pickup,
      destination: tripData.destination,
      vehicleId: '',
      vehicleNumber: '',
      driverId: '',
      driverName: '',
      passenger: tripData.passenger,
      scheduledStartTime: tripData.scheduledStartTime,
      distance: 0,
      duration: 0,
      earnings: {
        totalFare: tripData.baseFare,
        baseFare: tripData.baseFare,
        extraCharges: 0,
        tolls: 0,
        fuel: 0,
        driverPay: 0,
        netProfit: 0
      },
      corporateAccountId: tripData.corporateAccountId,
      notes: tripData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || ''
    };

    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, status, updatedAt: new Date().toISOString() }
        : trip
    ));
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
        : trip
    ));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  };

  const getFilteredTrips = (filters: TripFilters): Trip[] => {
    return trips.filter(trip => {
      if (filters.status && !filters.status.includes(trip.status)) return false;
      if (filters.type && !filters.type.includes(trip.type)) return false;
      if (filters.vehicleId && trip.vehicleId !== filters.vehicleId) return false;
      if (filters.driverId && trip.driverId !== filters.driverId) return false;
      if (filters.corporateAccountId && trip.corporateAccountId !== filters.corporateAccountId) return false;
      
      if (filters.dateRange) {
        const tripDate = new Date(trip.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (tripDate < startDate || tripDate > endDate) return false;
      }
      
      return true;
    });
  };

  const refreshAnalytics = () => {
    calculateAnalytics();
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        analytics,
        isLoading,
        createTrip,
        updateTripStatus,
        updateTrip,
        deleteTrip,
        getFilteredTrips,
        refreshAnalytics
      }}
    >
      {children}
    </TripContext.Provider>
  );
};