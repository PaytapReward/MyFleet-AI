import { useState } from "react";
import { 
  CreditCard, 
  Link as LinkIcon, 
  User, 
  Wrench, 
  MapPin, 
  AlertTriangle, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AssignDriverModal from "./AssignDriverModal";
import VehicleDetailsModal from "./VehicleDetailsModal";
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
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);

  // Get actual driver name from DriverContext
  const actualDriver = vehicle.driver ? getDriverById(vehicle.driver.id) : null;
  const driverName = actualDriver?.name || vehicle.driver?.name || null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-status-active text-white';
      case 'expired': return 'bg-status-urgent text-white';
      case 'missing': return 'bg-status-pending text-white';
      default: return 'bg-status-neutral text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <CheckCircle className="h-3 w-3" />;
      case 'expired': return <XCircle className="h-3 w-3" />;
      case 'missing': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="w-80 mobile-card flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/30 touch-target">
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
              <Car className="h-3.5 w-3.5 text-primary" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* PayTap Tag */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
            onClick={() => setShowDriverModal(true)}
          >
            {driverName ? 'Change' : 'Assign'}
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
          <Button size="sm" variant={vehicle.gpsLinked ? "success" : "warning"}>
            {vehicle.gpsLinked ? 'Track' : 'Add GPS'}
          </Button>
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Documents</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs">Pollution</span>
              <Badge className={`text-xs ${getStatusColor(vehicle.documents.pollution.status)}`}>
                {getStatusIcon(vehicle.documents.pollution.status)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs">Registration</span>
              <Badge className={`text-xs ${getStatusColor(vehicle.documents.registration.status)}`}>
                {getStatusIcon(vehicle.documents.registration.status)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs">Insurance</span>
              <Badge className={`text-xs ${getStatusColor(vehicle.documents.insurance.status)}`}>
                {getStatusIcon(vehicle.documents.insurance.status)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs">License</span>
              <Badge className={`text-xs ${getStatusColor(vehicle.documents.license.status)}`}>
                {getStatusIcon(vehicle.documents.license.status)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Driver Assignment Modal */}
      <AssignDriverModal
        open={showDriverModal}
        setOpen={setShowDriverModal}
        vehicleId={vehicle.id}
        vehicleNumber={vehicle.number}
        currentDriverId={vehicle.driver?.id}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        open={showVehicleDetailsModal}
        setOpen={setShowVehicleDetailsModal}
        vehicleNumber={vehicle.number}
      />
    </Card>
  );
};

export default VehicleCard;