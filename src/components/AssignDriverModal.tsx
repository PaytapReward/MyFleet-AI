import { useState } from "react";
import { User, Plus, Calendar, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDrivers } from "@/contexts/DriverContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AddDriverFormData } from "@/types/driver";

interface AssignDriverModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleId: string;
  vehicleNumber: string;
  currentDriverId?: string;
}

const AssignDriverModal = ({ open, setOpen, vehicleId, vehicleNumber, currentDriverId }: AssignDriverModalProps) => {
  const { user } = useAuth();
  const { drivers, addDriver, getDriversByUser, assignDriverToVehicle: assignDriverToVehicleInContext, unassignDriverFromVehicle: unassignDriverFromVehicleInContext } = useDrivers();
  const { assignDriverToVehicle, unassignDriverFromVehicle } = useVehicles();
  const { toast } = useToast();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddDriverFormData>({
    name: "",
    licenseNumber: "",
    dateOfBirth: "",
    phone: ""
  });

  const userDrivers = user ? getDriversByUser(user.id) : [];
  const availableDrivers = userDrivers.filter(driver => 
    driver.id !== currentDriverId && !driver.assignedVehicles.includes(vehicleId)
  );

  const handleAssignExisting = async (driverId: string) => {
    try {
      setIsLoading(true);
      
      // Unassign current driver from driver context if exists
      if (currentDriverId) {
        unassignDriverFromVehicleInContext(currentDriverId, vehicleId);
      }
      
      // Assign new driver in both contexts
      assignDriverToVehicle(vehicleId, driverId);
      assignDriverToVehicleInContext(driverId, vehicleId);
      
      const selectedDriver = drivers.find(d => d.id === driverId);
      toast({
        title: "Driver Assigned",
        description: `${selectedDriver?.name} has been assigned to ${vehicleNumber}`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAndAssign = async () => {
    if (!formData.name || !formData.licenseNumber || !formData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create new driver
      const newDriver = await addDriver(formData);
      
      // Unassign current driver if exists
      if (currentDriverId) {
        unassignDriverFromVehicleInContext(currentDriverId, vehicleId);
      }
      
      // Assign new driver to vehicle in both contexts
      assignDriverToVehicle(vehicleId, newDriver.id);
      assignDriverToVehicleInContext(newDriver.id, vehicleId);

      toast({
        title: "Driver Created & Assigned",
        description: `${newDriver.name} has been created and assigned to ${vehicleNumber}`,
      });

      // Reset form and close modal
      setFormData({ name: "", licenseNumber: "", dateOfBirth: "", phone: "" });
      setShowCreateForm(false);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create and assign driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!currentDriverId) return;
    
    try {
      setIsLoading(true);
      unassignDriverFromVehicle(vehicleId, currentDriverId);
      unassignDriverFromVehicleInContext(currentDriverId, vehicleId);
      
      toast({
        title: "Driver Unassigned",
        description: `Driver has been unassigned from ${vehicleNumber}`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unassign driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {currentDriverId ? 'Change Driver' : 'Assign Driver'}
          </DialogTitle>
          <DialogDescription>
            {currentDriverId ? `Change the driver for ${vehicleNumber}` : `Assign a driver to ${vehicleNumber}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateForm ? (
            <>
              {/* Current Driver Info */}
              {currentDriverId && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Currently Assigned</p>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={handleUnassign}
                      disabled={isLoading}
                    >
                      Unassign
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {drivers.find(d => d.id === currentDriverId)?.name || 'Unknown Driver'}
                  </p>
                </div>
              )}

              {/* Available Drivers */}
              {availableDrivers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Available Drivers</p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {availableDrivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {driver.licenseNumber}
                            </Badge>
                            {driver.phone && (
                              <Badge variant="outline" className="text-xs">
                                <Phone className="h-3 w-3 mr-1" />
                                {driver.phone}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignExisting(driver.id)}
                          disabled={isLoading}
                        >
                          Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create New Driver Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Driver
              </Button>
            </>
          ) : (
            /* Create New Driver Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create New Driver</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Back
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Driver Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter driver's full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">Driving License Number *</Label>
                  <Input
                    id="license"
                    placeholder="e.g., DL1420110012345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCreateAndAssign}
                disabled={isLoading || !formData.name || !formData.licenseNumber || !formData.dateOfBirth}
              >
                {isLoading ? "Creating..." : "Create & Assign Driver"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverModal;