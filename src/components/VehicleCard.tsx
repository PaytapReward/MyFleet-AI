import { useState } from "react";
import { 
  CreditCard, 
  Link as LinkIcon, 
  User, 
  Wrench, 
  Shield, 
  AlertTriangle, 
  Plus,
  Car,
  ChevronDown,
  ChevronUp,
  Fuel,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AssignDriverModal from "./AssignDriverModal";
import VehicleDetailsModal from "./VehicleDetailsModal";
import FuelModal from "./FuelModal";
import FastagModal from "./FastagModal";
import DriverModal from "./DriverModal";
import { ServiceModal } from "./ServiceModal";
import { ChallanModal } from "./ChallanModal";
import { useDrivers } from "@/contexts/DriverContext";

interface VehicleCardProps {
  vehicle: {
    id: string;
    number: string;
    model: string;
    payTapBalance: number;
    fastTagLinked: boolean;
    driver: { id: string; name: string } | null;
    lastService: string;
    gpsLinked: boolean;
    challans: number;
    documents: {
      pollution: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
      registration: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
      insurance: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
      license: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
    };
  };
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const { getDriverById } = useDrivers();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showFastagModal, setShowFastagModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);

  // Get actual driver name from DriverContext
  const actualDriver = vehicle.driver ? getDriverById(vehicle.driver.id) : null;
  const driverName = actualDriver?.name || vehicle.driver?.name || null;

  // Get insurance status
  const insuranceStatus = vehicle.documents.insurance.status;
  const isInsuranceActive = insuranceStatus === 'uploaded';

  return (
    <Card className="w-full md:w-80 mobile-card md:flex-shrink-0 backdrop-blur-lg bg-card/95 border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden">
      {/* Apple-inspired Vehicle Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">{vehicle.number}</h3>
              <p className="text-sm text-muted-foreground font-medium">{vehicle.model}</p>
            </div>
          </div>
          {vehicle.challans > 0 && (
            <Badge 
              variant="destructive" 
              className="rounded-full px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-600 border-red-200/50"
            >
              {vehicle.challans} Fine{vehicle.challans > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        {/* Quick Stats Row - 3 Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* Fuel Balance */}
          <div 
            className="flex flex-col items-center p-4 rounded-2xl bg-background/50 border border-border/30 cursor-pointer hover:bg-background/80 transition-all duration-300"
            onClick={() => setShowFuelModal(true)}
          >
            <Fuel className="h-4 w-4 text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground font-medium mb-1">Fuel Balance</p>
            <p className="text-sm font-bold text-primary">₹{vehicle.payTapBalance}</p>
          </div>

          {/* Driver */}
          <div 
            className="flex flex-col items-center p-4 rounded-2xl bg-background/50 border border-border/30 cursor-pointer hover:bg-background/80 transition-all duration-300"
            onClick={() => setShowDriverModal(true)}
          >
            <UserCheck className="h-4 w-4 text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground font-medium mb-1">Driver</p>
            <p className={`text-sm font-bold ${driverName ? 'text-foreground' : 'text-muted-foreground'} truncate w-full text-center`}>
              {driverName || 'Unassigned'}
            </p>
          </div>

          {/* Fines Count */}
          <div 
            className="flex flex-col items-center p-4 rounded-2xl bg-background/50 border border-border/30 cursor-pointer hover:bg-background/80 transition-all duration-300"
            onClick={() => setShowChallanModal(true)}
          >
            <AlertTriangle className="h-4 w-4 text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground font-medium mb-1">Fines</p>
            <p className={`text-sm font-bold ${vehicle.challans > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {vehicle.challans}
            </p>
          </div>
        </div>

        {/* Expandable Details Section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20 hover:bg-background/50 transition-all duration-300">
              <span className="text-sm font-medium text-muted-foreground">More Details</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            {/* FASTag Status */}
            <div 
              className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20 cursor-pointer hover:bg-background/50 transition-all duration-300"
              onClick={() => setShowFastagModal(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LinkIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">FASTag</p>
                  <p className={`text-xs font-medium ${vehicle.fastTagLinked ? 'text-green-600' : 'text-red-600'}`}>
                    {vehicle.fastTagLinked ? 'Linked' : 'Not Linked'}
                  </p>
                </div>
              </div>
              <Button size="sm" variant={vehicle.fastTagLinked ? "secondary" : "default"} className="rounded-xl">
                {vehicle.fastTagLinked ? 'Manage' : 'Link'}
              </Button>
            </div>

            {/* Insurance Status */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Insurance</p>
                  <p className={`text-xs font-medium ${isInsuranceActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isInsuranceActive ? 'Active' : 'Inactive'}
                    {vehicle.documents.insurance.expiryDate && (
                      <span className="text-muted-foreground ml-1">
                        • Expires {new Date(vehicle.documents.insurance.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button size="sm" variant={isInsuranceActive ? "secondary" : "destructive"} className="rounded-xl">
                {isInsuranceActive ? 'View' : 'Renew'}
              </Button>
            </div>

            {/* Service Status */}
            <div 
              className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20 cursor-pointer hover:bg-background/50 transition-all duration-300"
              onClick={() => setShowServiceModal(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Service</p>
                  <p className="text-xs text-muted-foreground font-medium">Last: {vehicle.lastService}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="rounded-xl">
                Schedule
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* Driver Assignment Modal */}
      <AssignDriverModal
        open={showAssignDriverModal}
        setOpen={setShowAssignDriverModal}
        vehicleId={vehicle.id}
        vehicleNumber={vehicle.number}
        currentDriverId={vehicle.driver?.id}
      />

      {/* Driver Modal */}
      <DriverModal
        open={showDriverModal}
        setOpen={setShowDriverModal}
        vehicleId={vehicle.id}
        vehicleNumber={vehicle.number}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        open={showVehicleDetailsModal}
        setOpen={setShowVehicleDetailsModal}
        vehicleNumber={vehicle.number}
      />

      {/* Fuel Modal */}
      <FuelModal
        open={showFuelModal}
        setOpen={setShowFuelModal}
        vehicleNumber={vehicle.number}
        currentBalance={vehicle.payTapBalance}
      />

      {/* FASTag Modal */}
      <FastagModal
        open={showFastagModal}
        setOpen={setShowFastagModal}
        vehicleNumber={vehicle.number}
        isLinked={vehicle.fastTagLinked}
      />

      {/* Service Modal */}
      <ServiceModal
        open={showServiceModal}
        setOpen={setShowServiceModal}
        vehicle={{
          id: vehicle.id,
          number: vehicle.number,
          lastService: vehicle.lastService
        }}
      />

      {/* Challan Modal */}
      <ChallanModal
        open={showChallanModal}
        setOpen={setShowChallanModal}
        vehicleNumber={vehicle.number}
        challanCount={vehicle.challans}
      />
    </Card>
  );
};

export default VehicleCard;