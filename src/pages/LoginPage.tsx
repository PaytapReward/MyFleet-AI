import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Shield, Truck, TrendingUp, Users, MapPin, CheckCircle } from 'lucide-react';

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
    <div className="h-screen bg-background">
      {/* Split Screen Layout */}
      <div className="lg:grid lg:grid-cols-5 h-screen">
        {/* Hero Section - Left Side */}
        <div className="lg:col-span-3 bg-gradient-to-br from-primary via-primary-glow to-accent p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-white/15"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white/25"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MyFleet AI</h1>
                <p className="text-white/80 text-sm">Smart Fleet Management</p>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Streamline Your
              <br />
              <span className="text-accent-foreground">Fleet Operations</span>
              <br />
              with Smart AI
            </h2>

            {/* Subheadline */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of MSME fleet operators who've transformed their business with intelligent tracking, automated reporting, and data-driven insights.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Real-time Analytics</h3>
                  <p className="text-white/80 text-sm">Track fleet performance and profitability in real-time</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Driver Management</h3>
                  <p className="text-white/80 text-sm">Assign, track, and manage your drivers efficiently</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Mobile First</h3>
                  <p className="text-white/80 text-sm">Manage your fleet from anywhere, anytime</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Automated Reports</h3>
                  <p className="text-white/80 text-sm">Generate P&L statements and compliance reports instantly</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-white/70">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm">Fleet Operators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm">Vehicles Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">₹2Cr+</div>
                <div className="text-sm">Revenue Managed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form - Right Side */}
        <div className="lg:col-span-2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <Card className="w-full border-border/50 shadow-lg">
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
                      <span>Secured with end-to-end encryption</span>
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
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground text-center">
                        <strong>Demo Access:</strong> Use verification code <span className="font-mono font-bold">123456</span>
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;