import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phone: string;
  fullName?: string;
  companyName?: string;
  panNumber?: string;
  isOnboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (profileData: {
    fullName: string;
    companyName: string;
    vehicleNumber: string;
    panNumber: string;
  }) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user storage - in real app, this would be secure storage
  const loadUser = () => {
    const storedUser = localStorage.getItem('myfleet_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  };

  const saveUser = (userData: User) => {
    localStorage.setItem('myfleet_user', JSON.stringify(userData));
    setUser(userData);
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    // Mock OTP sending - in real app, this would call backend API
    console.log(`Sending OTP to ${phone}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Mock OTP verification - in real app, this would call backend API
    if (otp === '123456') {
      console.log(`Attempting login for phone: ${phone}`);
      
      // Check if user exists (mock check)
      const existingUserData = localStorage.getItem(`user_${phone}`);
      console.log(`Existing user data for ${phone}:`, existingUserData);
      
      if (existingUserData) {
        try {
          const userData = JSON.parse(existingUserData);
          console.log(`Parsed user data:`, userData);
          
          // Ensure the user object has all required properties
          const completeUser: User = {
            id: userData.id || Date.now().toString(),
            phone: userData.phone || phone,
            fullName: userData.fullName,
            companyName: userData.companyName,
            panNumber: userData.panNumber,
            isOnboarded: userData.isOnboarded || false
          };
          
          console.log(`Complete user object:`, completeUser);
          saveUser(completeUser);
        } catch (error) {
          console.error(`Error parsing user data for ${phone}:`, error);
          // If data is corrupted, treat as new user
          const newUser: User = {
            id: Date.now().toString(),
            phone,
            isOnboarded: false
          };
          saveUser(newUser);
        }
      } else {
        console.log(`No existing user found for ${phone}, creating new user`);
        // New user - create minimal profile
        const newUser: User = {
          id: Date.now().toString(),
          phone,
          isOnboarded: false
        };
        saveUser(newUser);
      }
      return true;
    }
    return false;
  };

  const completeOnboarding = async (profileData: {
    fullName: string;
    companyName: string;
    vehicleNumber: string;
    panNumber: string;
  }): Promise<boolean> => {
    try {
      if (!user) {
        console.error('No user found during onboarding');
        return false;
      }
      
      const updatedUser: User = {
        ...user,
        fullName: profileData.fullName,
        companyName: profileData.companyName,
        panNumber: profileData.panNumber,
        isOnboarded: true
      };
      
      console.log(`Completing onboarding for user:`, updatedUser);
      
      // Save to phone-specific storage
      localStorage.setItem(`user_${user.phone}`, JSON.stringify(updatedUser));
      console.log(`Saved user data to user_${user.phone}`);
      
      // Save to current user storage
      saveUser(updatedUser);
      
      // Create initial vehicle from onboarding data
      const initialVehicle = {
        id: Date.now().toString(),
        number: profileData.vehicleNumber,
        model: "Not specified",
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
        userId: user.id
      };
      
      // Save initial vehicle to localStorage
      localStorage.setItem(`vehicles_${user.id}`, JSON.stringify([initialVehicle]));
      console.log(`Saved initial vehicle for user ${user.id}:`, initialVehicle);
      
      return true;
    } catch (error) {
      console.error('Onboarding failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('myfleet_user');
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      completeOnboarding,
      sendOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};