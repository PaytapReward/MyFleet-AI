import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, CreditCard, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicles } from "@/contexts/VehicleContext";
import { useProfitLoss } from "@/hooks/useProfitLoss";
import { PnLPeriod } from "@/types/vehicle";
import { useTranslation } from "react-i18next";
import FastagDashboardModal from "./FastagDashboardModal";

const FleetOverview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehicles } = useVehicles();
  const [selectedPeriod, setSelectedPeriod] = useState<PnLPeriod>('today');
  const [showFastagModal, setShowFastagModal] = useState(false);
  
  // Calculate fleet statistics
  const totalVehicles = vehicles.length;
  const totalAccountBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.payTapBalance, 0);
  const totalChallans = vehicles.reduce((sum, vehicle) => sum + vehicle.challans, 0);
  const linkedFastagVehicles = vehicles.filter(vehicle => vehicle.fastTagLinked).length;
  const totalFastagBalance = vehicles.filter(vehicle => vehicle.fastTagLinked).reduce((sum, vehicle) => sum + vehicle.payTapBalance, 0);
  
  // Calculate P&L for selected period
  const { netPnL, isProfit } = useProfitLoss(vehicles, selectedPeriod);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t('fleet.overview')}</h2>
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
      
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.totalVehicles')}</CardTitle>
          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">{totalVehicles}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Active fleet size</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.accountBalance')}</CardTitle>
          <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-status-active" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">₹{totalAccountBalance.toLocaleString()}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Total across fleet</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.pendingChallans')}</CardTitle>
          <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4 text-status-urgent" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-status-urgent">{totalChallans}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card 
        className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => setShowFastagModal(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.fastagDashboard')}</CardTitle>
          <CreditCard className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">₹{totalFastagBalance.toLocaleString()}</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">{linkedFastagVehicles} of {totalVehicles} linked</p>
        </CardContent>
      </Card>

      <Card 
        className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => navigate('/profit-loss')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.statement')}</CardTitle>
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
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} {t(isProfit ? 'fleet.profit' : 'fleet.loss')}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate('/trip-manager')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6 lg:pb-2">
          <CardTitle className="text-xs lg:text-sm font-medium">{t('fleet.tripManager')}</CardTitle>
          <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
          <div className="text-lg lg:text-2xl font-bold text-foreground">0</div>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Active trips</p>
        </CardContent>
      </Card>
      </div>

      <FastagDashboardModal 
        open={showFastagModal} 
        setOpen={setShowFastagModal} 
      />
    </div>
  );
};

export default FleetOverview;
