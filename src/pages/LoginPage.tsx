import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Truck } from 'lucide-react';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, verifyOTP } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendOTP(phone);
      if (success) {
        setStep('otp');
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOTP(phone, otp);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to MyFleet AI!",
        });
        // Navigate to home page after successful login
        navigate('/');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your OTP and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-primary/5 via-background to-accent/5 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mr-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MyFleet AI</h1>
              <p className="text-muted-foreground text-sm">Smart Fleet Management</p>
            </div>
          </div>
        </div>

        <Card className="w-full border-primary/20 shadow-xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {step === 'phone' ? 'Welcome Back' : 'Verify Your Identity'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {step === 'phone' 
                ? 'Login to access your fleet dashboard' 
                : 'Enter the verification code sent to your phone'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                      <span className="text-sm text-muted-foreground font-medium">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none text-base"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSendOTP}
                  disabled={isLoading || !phone}
                  className="w-full h-11 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                </Button>
                <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secured with Supabase authentication</span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Code sent to +91 {phone}
                  </p>
                </div>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={isLoading || !otp}
                  className="w-full h-11 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    ← Change Phone Number
                  </Button>
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="text-sm h-auto p-0"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;