import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phone: string;
  email?: string;
  fullName?: string;
  companyName?: string;
  panNumber?: string;
  isOnboarded: boolean;
  subscribed?: boolean;
  subscriptionTier?: string | null;
  subscriptionEnd?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (profileData: {
    fullName: string;
    email: string;
    companyName: string;
    vehicleNumber: string;
    panNumber: string;
  }) => Promise<boolean>;
  updateProfile: (profileData: {
    fullName: string;
    companyName: string;
    panNumber: string;
  }) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  startTrial: () => Promise<void>;
  setPaidSubscription: (tier: 'semiannual' | 'annual') => Promise<void>;
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
      try {
        const parsed: User = JSON.parse(storedUser);
        const normalized = validateAndNormalizeUser(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
          localStorage.setItem('myfleet_user', JSON.stringify(normalized));
        }
        setUser(normalized);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        setUser(null);
      }
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
            isOnboarded: userData.isOnboarded || false,
            subscribed: userData.subscribed ?? false,
            subscriptionTier: userData.subscriptionTier ?? null,
            subscriptionEnd: userData.subscriptionEnd ?? null
          };
          
          console.log(`Complete user object:`, completeUser);
          saveUser(validateAndNormalizeUser(completeUser));
        } catch (error) {
          console.error(`Error parsing user data for ${phone}:`, error);
          // If data is corrupted, treat as new user
          const newUser: User = {
            id: Date.now().toString(),
            phone,
            isOnboarded: false,
            subscribed: false,
            subscriptionTier: null,
            subscriptionEnd: null
          };
          saveUser(newUser);
        }
      } else {
        console.log(`No existing user found for ${phone}, creating new user`);
        // New user - create minimal profile
        const newUser: User = {
          id: Date.now().toString(),
          phone,
          isOnboarded: false,
          subscribed: false,
          subscriptionTier: null,
          subscriptionEnd: null
        };
        saveUser(newUser);
      }
      return true;
    }
    return false;
  };

  const completeOnboarding = async (profileData: {
    fullName: string;
    email: string;
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
        email: profileData.email,
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

  const updateProfile = async (profileData: {
    fullName: string;
    companyName: string;
    panNumber: string;
  }): Promise<boolean> => {
    try {
      if (!user) {
        console.error('No user found during profile update');
        return false;
      }
      
      const updatedUser: User = {
        ...user,
        fullName: profileData.fullName,
        companyName: profileData.companyName,
        panNumber: profileData.panNumber,
      };
      
      console.log(`Updating profile for user:`, updatedUser);
      
      // Save to phone-specific storage
      localStorage.setItem(`user_${user.phone}`, JSON.stringify(updatedUser));
      console.log(`Updated user data in user_${user.phone}`);
      
      // Save to current user storage
      saveUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('myfleet_user');
    setUser(null);
  };

  const isSubscriptionActive = (u: User) => {
    if (!u.subscribed) return false;
    if (!u.subscriptionEnd) return true;
    return new Date(u.subscriptionEnd) > new Date();
  };

  const validateAndNormalizeUser = (u: User): User => {
    const active = isSubscriptionActive(u);
    return {
      ...u,
      subscribed: active,
      subscriptionTier: active ? (u.subscriptionTier ?? null) : null,
      subscriptionEnd: active ? (u.subscriptionEnd ?? null) : null,
    };
  };

  const startTrial = async (): Promise<void> => {
    if (!user) throw new Error('No user');
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const updated: User = {
      ...user,
      subscribed: true,
      subscriptionTier: 'trial',
      subscriptionEnd: end.toISOString(),
    };
    localStorage.setItem(`user_${user.phone}`, JSON.stringify(updated));
    saveUser(updated);
  };

  const setPaidSubscription = async (tier: 'semiannual' | 'annual'): Promise<void> => {
    if (!user) throw new Error('No user');
    const end = new Date();
    end.setMonth(end.getMonth() + (tier === 'semiannual' ? 6 : 12));
    const updated: User = {
      ...user,
      subscribed: true,
      subscriptionTier: tier,
      subscriptionEnd: end.toISOString(),
    };
    localStorage.setItem(`user_${user.phone}`, JSON.stringify(updated));
    saveUser(updated);
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
      updateProfile,
      sendOTP,
      startTrial,
      setPaidSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};