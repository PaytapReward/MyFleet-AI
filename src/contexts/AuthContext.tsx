import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  phone: string;
  fullName?: string;
  companyName?: string;
  panNumber?: string;
  isOnboarded: boolean;
  role?: 'owner' | 'driver';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (phone: string, otp: string, role?: 'owner' | 'driver') => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (profileData: {
    fullName: string;
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
  createDriver: (driverData: {
    phone: string;
    fullName: string;
    licenseNumber: string;
    documentFile?: File;
  }) => Promise<boolean>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Demo mode configuration
  const DEMO_MODE = true;
  const DEMO_OTP = "123456";

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return null;
      }

      if (profile) {
        return {
          id: supabaseUser.id,
          phone: profile.phone,
          fullName: profile.full_name,
          companyName: profile.company_name,
          panNumber: profile.pan_number,
          isOnboarded: profile.is_onboarded || false,
          role: profile.role || 'owner'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    if (DEMO_MODE) {
      // In demo mode, always return success without actually sending OTP
      console.log(`Demo mode: OTP would be sent to ${phone}. Use demo OTP: ${DEMO_OTP}`);
      return true;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) {
        console.error('OTP sending error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('OTP sending error:', error);
      return false;
    }
  };

  const login = async (phone: string, otp: string, role: 'owner' | 'driver' = 'owner'): Promise<boolean> => {
    if (DEMO_MODE) {
      // In demo mode, verify against demo OTP
      if (otp !== DEMO_OTP) {
        console.log('Demo mode: Invalid OTP. Use demo OTP:', DEMO_OTP);
        return false;
      }

      // Generate consistent UUID-like demo user ID based on phone and role
      const phoneDigits = phone.replace(/\D/g, '');
      const baseId = phoneDigits.padEnd(12, '0').slice(0, 12);
      const rolePrefix = role === 'owner' ? '1' : '2';
      const demoUserId = `${rolePrefix}${baseId}-0000-4000-8000-000000000000`;

      const demoUser: User = {
        id: demoUserId,
        phone: phone,
        fullName: role === 'owner' ? 'Demo Fleet Owner' : 'Demo Driver',
        companyName: role === 'owner' ? 'Demo Transport Co.' : undefined,
        panNumber: role === 'owner' ? 'DEMO1234P' : undefined,
        isOnboarded: true,
        role: role
      };

      // Create demo session
      const demoSession = {
        user: {
          id: demoUserId,
          phone: phone,
        }
      } as Session;

      setUser(demoUser);
      setSession(demoSession);
      console.log('Demo mode: Login successful for', role, 'with ID:', demoUserId);
      return true;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        // For drivers, check if they exist in drivers table
        if (role === 'driver') {
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          if (driverError || !driverData) {
            console.error('Driver not found or not authorized');
            await supabase.auth.signOut();
            return false;
          }
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const completeOnboarding = async (profileData: {
    fullName: string;
    companyName: string;
    vehicleNumber: string;
    panNumber: string;
  }): Promise<boolean> => {
    try {
      if (!session?.user) {
        console.error('No authenticated user found during onboarding');
        return false;
      }
      
      // Update or create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          phone: session.user.phone || '',
          full_name: profileData.fullName,
          company_name: profileData.companyName,
          pan_number: profileData.panNumber,
          is_onboarded: true,
          role: 'owner'
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        return false;
      }

      // Create initial vehicle
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          user_id: session.user.id,
          number: profileData.vehicleNumber,
          model: "Not specified"
        });

      if (vehicleError) {
        console.error('Vehicle creation error:', vehicleError);
        return false;
      }

      // Reload user data
      const updatedUser = await fetchUserProfile(session.user);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
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
      if (!session?.user) {
        console.error('No authenticated user found during profile update');
        return false;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullName,
          company_name: profileData.companyName,
          pan_number: profileData.panNumber,
        })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Profile update error:', error);
        return false;
      }

      // Reload user data
      const updatedUser = await fetchUserProfile(session.user);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const createDriver = async (driverData: {
    phone: string;
    fullName: string;
    licenseNumber: string;
    documentFile?: File;
  }): Promise<boolean> => {
    try {
      if (!session?.user) {
        console.error('No authenticated user found');
        return false;
      }

      // Send OTP to driver's phone to create their account
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: driverData.phone,
      });

      if (otpError) {
        console.error('Error sending OTP to driver:', otpError);
        return false;
      }

      console.log('OTP sent to driver. They need to verify to complete registration.');
      
      return true;
    } catch (error) {
      console.error('Create driver error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Load user profile with a delay to avoid deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            const userProfile = await fetchUserProfile(session.user);
            setUser(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user).then((userProfile) => {
          if (!mounted) return;
          setUser(userProfile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isDemoMode: DEMO_MODE,
      login,
      logout,
      completeOnboarding,
      updateProfile,
      sendOTP,
      createDriver
    }}>
      {children}
    </AuthContext.Provider>
  );
};