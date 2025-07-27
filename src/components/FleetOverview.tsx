import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicles } from "@/contexts/VehicleContext";

const FleetOverview = () => {
  const { vehicles } = useVehicles();
  
  // Calculate fleet statistics
  const totalVehicles = vehicles.length;
  const totalPayTapBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.payTapBalance, 0);
  const totalChallans = vehicles.reduce((sum, vehicle) => sum + vehicle.challans, 0);
  
  // Calculate document compliance rate
  const totalDocuments = vehicles.length * 4; // 4 documents per vehicle
  const activeDocuments = vehicles.reduce((count, vehicle) => {
    return count + 
      (vehicle.documents.pollution.status === 'uploaded' ? 1 : 0) +
      (vehicle.documents.registration.status === 'uploaded' ? 1 : 0) +
      (vehicle.documents.insurance.status === 'uploaded' ? 1 : 0) +
      (vehicle.documents.license.status === 'uploaded' ? 1 : 0);
  }, 0);
  
  const complianceRate = totalDocuments > 0 ? Math.round((activeDocuments / totalDocuments) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">Total Vehicles</CardTitle>
          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">{totalVehicles}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Active fleet size</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">PayTap Balance</CardTitle>
          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-status-active" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">₹{totalPayTapBalance.toLocaleString()}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Total across fleet</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">Pending Challans</CardTitle>
          <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4 text-status-urgent" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-status-urgent">{totalChallans}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">Documents</CardTitle>
          <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-status-active" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-status-pending">{complianceRate}%</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Compliance rate</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetOverview;