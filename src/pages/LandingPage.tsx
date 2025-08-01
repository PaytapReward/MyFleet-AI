import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, TrendingUp, Users, Smartphone, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-white/15"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white/25"></div>
      </div>

      {/* Header with Logo and Login */}
      <header className="relative z-10 w-full p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 lg:mr-4 backdrop-blur-sm">
              <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-white">MyFleet AI</h1>
              <p className="text-white/80 text-xs lg:text-sm">Smart Fleet Management</p>
            </div>
          </div>
          
          {/* Login Button */}
          <Button
            onClick={() => navigate('/login')}
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white text-sm lg:text-base px-4 lg:px-6"
          >
            Login
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center lg:text-left px-6 lg:px-8 pb-8 lg:pb-12 flex-1 flex flex-col justify-center">

        {/* Main Headline */}
        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Streamline Your
          <br />
          <span className="text-accent-foreground">Fleet Operations</span>
          <br />
          with Smart AI
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto lg:mx-0">
          Join thousands of MSME fleet operators who've transformed their business with intelligent tracking, automated reporting, and data-driven insights.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto lg:mx-0">
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

        {/* CTA Button */}
        <div className="mb-12">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto font-semibold"
          >
            Get Started Now
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center lg:justify-start space-x-6 text-white/70">
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
  );
};

export default LandingPage;