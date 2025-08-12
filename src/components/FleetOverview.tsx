import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles } from "@/contexts/VehicleContext";
import { useProfitLoss } from "@/hooks/useProfitLoss";
import { PnLPeriod } from "@/types/vehicle";

const FleetOverview = () => {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [selectedPeriod, setSelectedPeriod] = useState<PnLPeriod>('today');
  
  // Calculate fleet statistics
  const totalVehicles = vehicles.length;
  const totalPayTapBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.payTapBalance, 0);
  const totalChallans = vehicles.reduce((sum, vehicle) => sum + vehicle.challans, 0);
  
  // Calculate P&L for selected period
  const { netPnL, isProfit } = useProfitLoss(vehicles, selectedPeriod);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Fleet Overview</h2>
        <Select value={selectedPeriod} onValueChange={(value: PnLPeriod) => setSelectedPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
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
          <CardTitle className="text-xs lg:text-sm font-medium">Fuel Balance</CardTitle>
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

      <Card 
        className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => navigate('/profit-loss')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">Statement</CardTitle>
          {isProfit ? (
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-status-active" />
          ) : (
            <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-status-urgent" />
          )}
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className={`text-lg lg:text-2xl font-bold ${
            isProfit ? 'text-status-active' : 'text-status-urgent'
          }`}>
            ₹{Math.abs(netPnL).toLocaleString()}
          </div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} {isProfit ? 'profit' : 'loss'}
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default FleetOverview;
