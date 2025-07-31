import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { DriverProvider } from "@/contexts/DriverContext";
import { ManualTransactionProvider } from "@/contexts/ManualTransactionContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import ProfitLossPage from "./pages/ProfitLossPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

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
    return <LoginPage />;
  }

  // Logged in but not onboarded
  if (!user.isOnboarded) {
    return <OnboardingPage />;
  }

  // Fully authenticated and onboarded
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profit-loss" element={<ProfitLossPage />} />
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
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ManualTransactionProvider>
        </VehicleProvider>
      </DriverProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
