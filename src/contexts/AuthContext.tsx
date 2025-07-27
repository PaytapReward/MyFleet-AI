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
  completeOnboarding: (userData: Partial<User>) => Promise<void>;
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
    if (otp === '12345') {
      // Check if user exists (mock check)
      const existingUser = localStorage.getItem(`user_${phone}`);
      
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        saveUser(userData);
      } else {
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

  const completeOnboarding = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      isOnboarded: true
    };
    
    // Save to phone-specific storage too
    localStorage.setItem(`user_${user.phone}`, JSON.stringify(updatedUser));
    saveUser(updatedUser);
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