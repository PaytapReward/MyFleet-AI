import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Building2, Car, CreditCard } from 'lucide-react';

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    vehicleNumber: '',
    panNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { completeOnboarding } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.vehicleNumber.trim()) {
      toast({
        title: "Vehicle Number Required",
        description: "Please enter your primary vehicle number",
        variant: "destructive"
      });
      return;
    }

    if (!formData.panNumber.trim() || formData.panNumber.length !== 10) {
      toast({
        title: "Valid PAN Required",
        description: "Please enter a valid 10-character PAN number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await completeOnboarding(formData);
      if (success) {
        toast({
          title: "Welcome to MyFleet AI!",
          description: "Your account has been set up successfully",
        });
      } else {
        throw new Error('Onboarding failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Help us set up your fleet management account</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Company Name (Optional)
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            {/* Primary Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Primary Vehicle Number *
              </Label>
              <Input
                id="vehicleNumber"
                type="text"
                placeholder="KA 01 AB 1234"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
              />
            </div>

            {/* PAN Number */}
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                PAN Card Number *
              </Label>
              <Input
                id="panNumber"
                type="text"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  panNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
                }))}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Required for compliance and tax purposes
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>

            <div className="text-xs text-muted-foreground text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;