import { useState } from "react";
import { 
  CreditCard, 
  Link as LinkIcon, 
  User, 
  Wrench, 
  MapPin, 
  AlertTriangle, 
  Plus,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AssignDriverModal from "./AssignDriverModal";
import VehicleDetailsModal from "./VehicleDetailsModal";
import FuelModal from "./FuelModal";
import FastagModal from "./FastagModal";
import DriverModal from "./DriverModal";
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
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showFastagModal, setShowFastagModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  // Get actual driver name from DriverContext
  const actualDriver = vehicle.driver ? getDriverById(vehicle.driver.id) : null;
  const driverName = actualDriver?.name || vehicle.driver?.name || null;


  return (
    <Card className="w-full md:w-80 mobile-card md:flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/30 touch-target">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{vehicle.number}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.model}</p>
          </div>
          <div className="flex items-center gap-2">
            {vehicle.challans > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {vehicle.challans} Challan{vehicle.challans > 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-primary/10"
              onClick={() => setShowVehicleDetailsModal(true)}
            >
              <Car className="h-6 w-6 text-primary" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="md:space-y-4">
        {/* Mobile: 3x2 grid of squares */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          <AspectRatio ratio={1}>
            <div 
              className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => setShowFuelModal(true)}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Fuel</p>
              </div>
              <p className="text-lg font-semibold text-primary">₹{vehicle.payTapBalance}</p>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1}>
            <div 
              className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => setShowFastagModal(true)}
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">FASTag</p>
              </div>
              <p className={`text-sm ${vehicle.fastTagLinked ? 'text-status-active' : 'text-status-urgent'}`}>
                {vehicle.fastTagLinked ? 'Linked' : 'Not Linked'}
              </p>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1}>
            <div 
              className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => setShowDriverModal(true)}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Driver</p>
              </div>
              <p className="text-sm text-foreground">{driverName || 'Not Assigned'}</p>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1}>
            <div className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Service</p>
              </div>
              <p className="text-sm text-foreground">{vehicle.lastService}</p>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1}>
            <div className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">GPS</p>
              </div>
              <p className={`text-sm ${vehicle.gpsLinked ? 'text-status-active' : 'text-status-urgent'}`}>
                {vehicle.gpsLinked ? 'Active' : 'Not Linked'}
              </p>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1}>
            <div className="p-3 bg-muted rounded-lg h-full flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Challans</p>
              </div>
              <p className={`text-sm ${vehicle.challans > 0 ? 'text-status-urgent' : 'text-muted-foreground'}`}>
                {vehicle.challans}
              </p>
            </div>
          </AspectRatio>
        </div>

        {/* Desktop/Tablet: keep existing layout */}
        <div className="hidden md:block space-y-4">
          {/* PayTap Tag */}
          <div 
            className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => setShowFuelModal(true)}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Fuel Balance</p>
                <p className="text-lg font-semibold text-primary">₹{vehicle.payTapBalance}</p>
              </div>
            </div>
            <Button size="sm" variant="default">
              <Plus className="h-3 w-3 mr-1" />
              Add Money
            </Button>
          </div>

          {/* FASTag */}
          <div 
            className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => setShowFastagModal(true)}
          >
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">FASTag</p>
                <p className={`text-sm ${vehicle.fastTagLinked ? 'text-status-active' : 'text-status-urgent'}`}>
                  {vehicle.fastTagLinked ? 'Linked' : 'Not Linked'}
                </p>
              </div>
            </div>
            <Button size="sm" variant={vehicle.fastTagLinked ? "secondary" : "warning"}>
              {vehicle.fastTagLinked ? 'Add Balance' : 'Link'}
            </Button>
          </div>

          {/* Driver Assignment */}
          <div 
            className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => setShowDriverModal(true)}
          >
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Driver</p>
                <p className="text-sm text-foreground">{driverName || 'Not Assigned'}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowDriverModal(true);
              }}
            >
              {driverName ? 'Manage' : 'Add Driver'}
            </Button>
          </div>

          {/* Maintenance */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Last Service</p>
                <p className="text-sm text-foreground">{vehicle.lastService}</p>
              </div>
            </div>
            <Button size="sm" variant="secondary">
              Schedule Next
            </Button>
          </div>

          {/* GPS Device */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">GPS Device</p>
                <p className={`text-sm ${vehicle.gpsLinked ? 'text-status-active' : 'text-status-urgent'}`}>
                  {vehicle.gpsLinked ? 'Active' : 'Not Linked'}
                </p>
              </div>
            </div>
            <Button size="sm" variant={vehicle.gpsLinked ? "secondary" : "destructive"}>
              {vehicle.gpsLinked ? 'Track' : 'Add GPS'}
            </Button>
          </div>
        </div>
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
    </Card>
  );
};

export default VehicleCard;