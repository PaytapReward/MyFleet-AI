import DashboardHeader from "@/components/DashboardHeader";
import FleetOverview from "@/components/FleetOverview";
import VehicleCard from "@/components/VehicleCard";
import AddVehicleModal from "@/components/AddVehicleModal";
import { useVehicles } from "@/contexts/VehicleContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const { vehicles, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-primary-foreground rounded"></div>
              </div>
              <p className="text-muted-foreground">Loading your fleet...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Fleet Overview Stats */}
        <FleetOverview />
        
        {/* Vehicle Cards Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Fleet</h2>
              <p className="text-sm text-muted-foreground">Manage up to 25 vehicles ({vehicles.length}/25)</p>
            </div>
            <AddVehicleModal />
          </div>
          
          {/* Horizontal Scrolling Vehicle Cards */}
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide mobile-scroll">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="w-80 flex-shrink-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center min-h-[400px] bg-muted/30">
                <div className="text-center p-6">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Vehicles Yet</h3>
                  <p className="text-sm text-muted-foreground">Click "Add Vehicle" to get started</p>
                </div>
              </div>
            )}
            
            {/* Add Vehicle Card - Always show if under limit */}
            {vehicles.length < 25 && vehicles.length > 0 && (
              <div className="w-80 flex-shrink-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center min-h-[400px] bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-center p-6">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Add New Vehicle</h3>
                  <p className="text-sm text-muted-foreground">Expand your fleet management</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium text-foreground mb-2">Bulk Actions</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage multiple vehicles at once</p>
            <Button variant="outline" className="w-full">View All Challans</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium text-foreground mb-2">Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">Track fleet performance</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium text-foreground mb-2">Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Need help with your fleet?</p>
            <Button variant="outline" className="w-full">Contact Support</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
