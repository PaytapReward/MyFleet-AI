import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
    vehicleNumber: string;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to transform Supabase user + profile to our User type
  const transformToUser = (supabaseUser: SupabaseUser, profile?: any): User => {
    return {
      id: supabaseUser.id,
      phone: profile?.phone || supabaseUser.phone || '',
      email: supabaseUser.email || profile?.email || '',
      fullName: profile?.full_name || '',
      companyName: profile?.company_name || '',
      panNumber: profile?.pan_number || '',
      isOnboarded: profile?.is_onboarded || false,
      subscribed: profile?.subscribed || false,
      subscriptionTier: profile?.subscription_tier,
      subscriptionEnd: profile?.subscription_end,
    };
  };

  // Load user profile from Supabase
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const userData = transformToUser(supabaseUser, profile);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
      return null;
    }
  };

  // Migrate from localStorage if needed
  const migrateFromLocalStorage = async (supabaseUser: SupabaseUser) => {
    try {
      const existingData = localStorage.getItem('myfleet_user');
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        
        // Create or update profile with migrated data
        const { error } = await supabase
          .from('profiles')
          .upsert({
            user_id: supabaseUser.id,
            phone: parsedData.phone || supabaseUser.phone || '',
            full_name: parsedData.fullName || '',
            email: supabaseUser.email || parsedData.email || '',
            company_name: parsedData.companyName || '',
            pan_number: parsedData.panNumber || '',
            is_onboarded: parsedData.isOnboarded || false,
            subscribed: parsedData.subscribed || false,
            subscription_tier: parsedData.subscriptionTier,
            subscription_end: parsedData.subscriptionEnd,
          });

        if (error) {
          console.error('Error migrating user data:', error);
        } else {
          // Clear old localStorage data after successful migration
          localStorage.removeItem('myfleet_user');
          toast.success('Account data migrated successfully');
        }
      }
    } catch (error) {
      console.error('Error during migration:', error);
    }
  };

  // Send OTP to phone number
  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success(`OTP sent to ${phone}`);
      return true;
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with phone and OTP
  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        // Migrate localStorage data if this is first Supabase login
        await migrateFromLocalStorage(data.user);
        
        // Load or create user profile
        await loadUserProfile(data.user);
        toast.success('Login successful!');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      setSession(null);
    }
  };

  // Complete onboarding
  const completeOnboarding = async (profileData: {
    fullName: string;
    email: string;
    vehicleNumber: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user || !session?.user) {
        toast.error('No user found. Please login again.');
        return false;
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          full_name: profileData.fullName,
          email: profileData.email,
          is_onboarded: true,
          phone: user.phone,
        });
      
      if (error) {
        toast.error('Failed to complete setup');
        return false;
      }
      
      const updatedUser = {
        ...user,
        fullName: profileData.fullName,
        email: profileData.email,
        isOnboarded: true,
      };
      
      setUser(updatedUser);
      toast.success('Profile setup completed successfully!');
      
      return true;
    } catch (error) {
      toast.error('Failed to complete setup. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData: {
    fullName: string;
    companyName: string;
    panNumber: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user || !session?.user) {
        toast.error('No user found. Please login again.');
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
        toast.error('Failed to update profile');
        return false;
      }
      
      const updatedUser = { 
        ...user, 
        fullName: profileData.fullName,
        companyName: profileData.companyName,
        panNumber: profileData.panNumber,
      };
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      
      return true;
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start trial subscription
  const startTrial = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user || !session?.user) {
        throw new Error('No user found. Please login again.');
      }
      
      const end = new Date();
      end.setDate(end.getDate() + 30);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscribed: true,
          subscription_tier: 'trial',
          subscription_end: end.toISOString(),
        })
        .eq('user_id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      const updatedUser = {
        ...user,
        subscribed: true,
        subscriptionTier: 'trial',
        subscriptionEnd: end.toISOString(),
      };
      
      setUser(updatedUser);
      toast.success('Trial started successfully!');
    } catch (error) {
      toast.error('Failed to start trial. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set paid subscription
  const setPaidSubscription = async (tier: 'semiannual' | 'annual'): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user || !session?.user) {
        throw new Error('No user found. Please login again.');
      }
      
      const end = new Date();
      end.setMonth(end.getMonth() + (tier === 'semiannual' ? 6 : 12));
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscribed: true,
          subscription_tier: tier,
          subscription_end: end.toISOString(),
        })
        .eq('user_id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      const updatedUser = {
        ...user,
        subscribed: true,
        subscriptionTier: tier,
        subscriptionEnd: end.toISOString(),
      };
      
      setUser(updatedUser);
      toast.success('Subscription activated successfully!');
    } catch (error) {
      toast.error('Failed to activate subscription. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer data loading to prevent deadlocks
          setTimeout(async () => {
            await loadUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        setTimeout(async () => {
          await loadUserProfile(session.user);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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