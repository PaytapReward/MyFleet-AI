import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { User, Car, Mail } from 'lucide-react';

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    vehicleNumber: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
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

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address",
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


    if (!termsAccepted) {
      toast({
        title: "Terms Acceptance Required",
        description: "Please accept the Privacy Policy and Terms & Conditions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await completeOnboarding(formData);
      toast({
        title: "Welcome to MyFleet AI!",
        description: "Your account has been set up successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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


            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 mt-6">
              <Checkbox 
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label 
                htmlFor="terms" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                I agree to the{' '}
                <Link 
                  to="/privacy-policy" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link 
                  to="/terms-conditions" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </Link>
                {' '}of MyFleet AI
              </Label>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !termsAccepted}
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