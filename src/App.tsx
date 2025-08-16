import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { DriverProvider } from "@/contexts/DriverContext";
import { ManualTransactionProvider } from "@/contexts/ManualTransactionContext";
import { TripProvider } from "@/contexts/TripContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import ProfitLossPage from "./pages/ProfitLossPage";
import TripManagerPage from "./pages/TripManagerPage";
import SupportPage from "./pages/SupportPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import NotFound from "./pages/NotFound";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const isActiveSub = user?.subscribed && (!user?.subscriptionEnd || new Date(user.subscriptionEnd) > new Date());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-foreground rounded"></div>
          </div>
          <p className="text-muted-foreground">Loading MyFleet AI...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  // Logged in but not onboarded
  if (!user.isOnboarded) {
    return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
      <Route path="*" element={<OnboardingPage />} />
    </Routes>
    );
  }

  // Subscription gate for onboarded users without active plan
  if (!isActiveSub) {
    return (
      <Routes>
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<SubscriptionPage />} />
      </Routes>
    );
  }

  // Fully authenticated, onboarded, and subscribed
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profit-loss" element={<ProfitLossPage />} />
        <Route path="/trip-manager" element={<TripManagerPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
      <Route path="/login" element={<Index />} /> {/* Redirect authenticated users to dashboard */}
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DriverProvider>
        <VehicleProvider>
          <ManualTransactionProvider>
            <TripProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </TripProvider>
        </ManualTransactionProvider>
      </VehicleProvider>
      </DriverProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
