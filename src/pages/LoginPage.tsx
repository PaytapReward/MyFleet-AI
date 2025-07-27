import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Shield } from 'lucide-react';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, login } = useAuth();
  const { toast } = useToast();

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
      const success = await login(phone, otp);
      if (!success) {
        toast({
          title: "Invalid OTP",
          description: "Please enter the correct OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MyFleet AI</h1>
          <p className="text-muted-foreground mt-2">Smart Fleet Management</p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === 'phone' ? 'Login to Your Account' : 'Verify OTP'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                      <span className="text-sm text-muted-foreground">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSendOTP}
                  disabled={isLoading || !phone}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
                <div className="flex items-center text-xs text-muted-foreground mt-4">
                  <Shield className="h-4 w-4 mr-2" />
                  Your data is protected with end-to-end encryption
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to +91 {phone}
                  </p>
                </div>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={isLoading || !otp}
                  className="w-full"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setStep('phone')}
                  className="w-full"
                >
                  Change Number
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    Resend OTP
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-4">
                  For demo purposes, use OTP: <strong>123456</strong>
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