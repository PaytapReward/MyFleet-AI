export type TripStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type TripType = 'local' | 'intercity' | 'corporate' | 'airport';

export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isFrequent?: boolean;
}

export interface TripEarnings {
  totalFare: number;
  baseFare: number;
  extraCharges: number;
  tolls: number;
  fuel: number;
  driverPay: number;
  netProfit: number;
}

export interface Trip {
  id: string;
  tripNumber: string;
  status: TripStatus;
  type: TripType;
  
  // Locations
  pickup: Location;
  destination: Location;
  
  // Assignment
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  
  // Passenger
  passenger: Passenger;
  
  // Timing
  scheduledStartTime: string;
  actualStartTime?: string;
  estimatedEndTime?: string;
  actualEndTime?: string;
  
  // Trip Details
  distance?: number; // in km
  duration?: number; // in minutes
  
  // Financial
  earnings: TripEarnings;
  
  // Corporate
  corporateAccountId?: string;
  corporateAccountName?: string;
  
  // Tracking
  currentLocation?: Location;
  eta?: number; // in minutes
  
  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTripFormData {
  pickup: Location;
  destination: Location;
  scheduledStartTime: string;
  passenger: Passenger;
  type: TripType;
  corporateAccountId?: string;
  baseFare: number;
  notes?: string;
}

export interface TripFilters {
  status?: TripStatus[];
  type?: TripType[];
  dateRange?: {
    start: string;
    end: string;
  };
  vehicleId?: string;
  driverId?: string;
  corporateAccountId?: string;
}

export interface TripAnalytics {
  totalTrips: number;
  activeTrips: number;
  completedToday: number;
  todaysEarnings: number;
  todaysProfit: number;
  profitPercentage: number;
  averageDistance: number;
  averageDuration: number;
  topDestinations: Array<{ destination: string; count: number; earnings: number }>;
  driverPerformance: Array<{ driverId: string; driverName: string; trips: number; earnings: number }>;
}