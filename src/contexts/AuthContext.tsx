import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  phone: string;
  full_name: string;
  company_name?: string;
  pan_number?: string;
  is_onboarded: boolean;
  role: 'owner' | 'driver';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile loading to prevent deadlocks
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/profiles?user_id=eq.${userId}&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const profiles = await response.json();
        if (profiles && profiles.length > 0) {
          setProfile(profiles[0]);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        return false;
      }

        // Check if profile exists, if not, user needs onboarding
        if (data.user) {
          try {
            const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/profiles?user_id=eq.${data.user.id}&select=*`, {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const profiles = await response.json();
              if (!profiles || profiles.length === 0) {
                // Create minimal profile
                const createResponse = await fetch('https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/profiles', {
                  method: 'POST',
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                  },
                  body: JSON.stringify({
                    user_id: data.user.id,
                    phone,
                    full_name: '',
                    is_onboarded: false,
                    role: 'owner'
                  })
                });
                
                if (!createResponse.ok) {
                  console.error('Error creating profile:', await createResponse.text());
                }
              }
            }
          } catch (error) {
            console.error('Error checking/creating profile:', error);
          }
        }

      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
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
      if (!user) {
        console.error('No user found during onboarding');
        return false;
      }

      // Update profile using REST API
      const profileResponse = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/profiles?user_id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name: profileData.fullName,
          company_name: profileData.companyName,
          pan_number: profileData.panNumber,
          is_onboarded: true,
        })
      });

      if (!profileResponse.ok) {
        console.error('Error updating profile:', await profileResponse.text());
        return false;
      }

      // Create initial vehicle using REST API
      const vehicleResponse = await fetch('https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/vehicles', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user.id,
          number: profileData.vehicleNumber,
          model: 'Not specified'
        })
      });

      if (!vehicleResponse.ok) {
        console.error('Error creating vehicle:', await vehicleResponse.text());
        return false;
      }

      // Reload profile
      await loadUserProfile(user.id);
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

      const response = await fetch(`https://dffjovobqzrdfwmpkhzd.supabase.co/rest/v1/profiles?user_id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmpvdm9icXpyZGZ3bXBraHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQ3NDUsImV4cCI6MjA2OTU0MDc0NX0.bc5dFkEhWZC6zIJ-yFl5429jFc7dLnlRGQa8RtDQnPg',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name: profileData.fullName,
          company_name: profileData.companyName,
          pan_number: profileData.panNumber,
        })
      });

      if (!response.ok) {
        console.error('Error updating profile:', await response.text());
        return false;
      }

      // Reload profile
      await loadUserProfile(user.id);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Force page reload for clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Legacy login method for backward compatibility
  const login = async (phone: string, otp: string): Promise<boolean> => {
    return verifyOTP(phone, otp);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isLoading,
      sendOTP,
      verifyOTP,
      logout,
      completeOnboarding,
      updateProfile,
      // Legacy method for backward compatibility
      login
    } as any}>
      {children}
    </AuthContext.Provider>
  );
};