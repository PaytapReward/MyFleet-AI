import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, Wallet, Receipt, Calculator, Shield, Clock, PieChart, Banknote } from 'lucide-react';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-accent/10"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-primary/15"></div>
        <div className="absolute top-40 right-60 w-20 h-20 rounded-full bg-accent/5"></div>
      </div>

      {/* Header with Logo and Login */}
      <header className="relative z-10 w-full p-6 lg:p-8 border-b border-border/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 lg:mr-4">
              <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-foreground">MyFleet AI</h1>
              <p className="text-muted-foreground text-xs lg:text-sm">Smart Fleet Payments</p>
            </div>
          </div>
          
          {/* Login Button */}
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="text-sm lg:text-base px-4 lg:px-6"
          >
            Login
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center lg:text-left px-6 lg:px-8 pb-8 lg:pb-12 flex-1 flex flex-col justify-center">

        {/* Main Headline */}
        <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Simplify Your
          <br />
          <span className="text-primary">Fleet Payments</span>
          <br />
          with Smart AI
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
          Join thousands of MSME fleet operators who've revolutionized their payment processing with automated billing, real-time expense tracking, and intelligent financial insights.
        </p>

        {/* CTA Button */}
        <div className="mb-12">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="text-lg px-8 py-6 h-auto font-semibold shadow-lg"
          >
            Start Free Trial
          </Button>
        </div>

        {/* Payment Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto lg:mx-0">
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Instant Payments</h3>
              <p className="text-muted-foreground text-sm">Process payments instantly with secure digital wallets and cards</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Receipt className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Smart Invoicing</h3>
              <p className="text-muted-foreground text-sm">Generate and send automated invoices with trip details</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Calculator className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Expense Tracking</h3>
              <p className="text-muted-foreground text-sm">Track fuel, maintenance, and operational costs automatically</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Secure Transactions</h3>
              <p className="text-muted-foreground text-sm">Bank-grade security with end-to-end encryption</p>
            </div>
          </div>
        </div>

        {/* Financial Analytics Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-12 border border-border/30">
          <div className="flex items-center justify-center mb-4">
            <PieChart className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-2xl font-bold text-foreground">Real-time Financial Analytics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Wallet className="h-6 w-6 text-primary mb-2" />
              <div className="text-sm text-muted-foreground">Digital Wallet</div>
            </div>
            <div className="flex flex-col items-center">
              <Banknote className="h-6 w-6 text-accent mb-2" />
              <div className="text-sm text-muted-foreground">Cash Management</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-6 w-6 text-primary mb-2" />
              <div className="text-sm text-muted-foreground">Real-time Updates</div>
            </div>
            <div className="flex flex-col items-center">
              <Receipt className="h-6 w-6 text-accent mb-2" />
              <div className="text-sm text-muted-foreground">Auto Reports</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center lg:justify-start space-x-6 text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">₹50Cr+</div>
            <div className="text-sm">Payments Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">5K+</div>
            <div className="text-sm">Active Fleet Operators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <div className="text-sm">Payment Success Rate</div>
          </div>
        </div>
        </div>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
  );
};

export default LandingPage;