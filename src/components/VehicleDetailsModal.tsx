import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Fuel, MapPin, User, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface VehicleDetails {
  number: string;
  make: string;
  model: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  registrationDate: string;
  chassisNumber: string;
  engineNumber: string;
  ownerName: string;
  registeredAddress: string;
  color: string;
  category: string;
}

interface VehicleDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleNumber: string;
}

// Dummy API function - will be replaced with real API
const fetchVehicleDetails = async (vehicleNumber: string): Promise<VehicleDetails> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dummy data based on vehicle number
  return {
    number: vehicleNumber,
    make: "Maruti Suzuki",
    model: "Swift",
    year: 2020,
    fuelType: Math.random() > 0.5 ? 'Petrol' : 'Diesel',
    registrationDate: "2020-03-15",
    chassisNumber: "MA3ERLF2N00" + Math.floor(Math.random() * 100000),
    engineNumber: "K12M" + Math.floor(Math.random() * 1000000),
    ownerName: "John Doe",
    registeredAddress: "123 Main Street, Bangalore, Karnataka 560001",
    color: "White",
    category: "M1 - Motor Car"
  };
};

const VehicleDetailsModal = ({ open, setOpen, vehicleNumber }: VehicleDetailsModalProps) => {
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && vehicleNumber) {
      setLoading(true);
      fetchVehicleDetails(vehicleNumber)
        .then(setVehicleDetails)
        .finally(() => setLoading(false));
    }
  }, [open, vehicleNumber]);

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'Petrol': return 'bg-orange-500 text-white';
      case 'Diesel': return 'bg-blue-500 text-white';
      case 'CNG': return 'bg-green-500 text-white';
      case 'Electric': return 'bg-purple-500 text-white';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Vehicle Details - {vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading vehicle details...</span>
          </div>
        ) : vehicleDetails ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Make & Model</span>
                </div>
                <p className="text-lg font-semibold">{vehicleDetails.make} {vehicleDetails.model}</p>
                <p className="text-sm text-muted-foreground">Year: {vehicleDetails.year}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Fuel Type</span>
                </div>
                <Badge className={getFuelTypeColor(vehicleDetails.fuelType)}>
                  {vehicleDetails.fuelType}
                </Badge>
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Registration Details</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration Date:</span>
                  <span className="text-sm font-medium">{new Date(vehicleDetails.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Chassis Number:</span>
                  <span className="text-sm font-medium">{vehicleDetails.chassisNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Engine Number:</span>
                  <span className="text-sm font-medium">{vehicleDetails.engineNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <span className="text-sm font-medium">{vehicleDetails.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm font-medium">{vehicleDetails.category}</span>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Owner Information</span>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Owner Name:</span>
                  <span className="text-sm font-medium">{vehicleDetails.ownerName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Registered Address:</span>
                  <p className="text-sm font-medium">{vehicleDetails.registeredAddress}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load vehicle details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsModal;