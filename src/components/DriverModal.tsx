import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Plus, Upload, FileText, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDrivers } from "@/contexts/DriverContext";
import { useAuth } from "@/contexts/AuthContext";
import { AddDriverFormData } from "@/types/driver";

interface DriverModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleId: string;
  vehicleNumber: string;
}

const DriverModal = ({ open, setOpen, vehicleId, vehicleNumber }: DriverModalProps) => {
  const { user } = useAuth();
  const { addDriver, getDriversByUser } = useDrivers();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AddDriverFormData>({
    name: "",
    licenseNumber: "",
    dateOfBirth: "",
    phone: ""
  });

  const userDrivers = user ? getDriversByUser(user.id) : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setLicenseFile(file);
    }
  };

  const handleCreateDriver = async () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // TODO: Handle file upload to Supabase storage if licenseFile exists
      let licenseUrl = "";
      if (licenseFile) {
        // Placeholder for file upload logic
        console.log("License file to upload:", licenseFile.name);
        // licenseUrl = await uploadLicenseFile(licenseFile);
      }

      // Create new driver
      const newDriver = addDriver({
        ...formData,
        licenseNumber: formData.licenseNumber || `DL${Date.now()}` // Generate if not provided
      });

      toast({
        title: "Driver Added Successfully",
        description: `${newDriver.name} has been added to your drivers list`,
      });

      // Reset form and close modal
      setFormData({ name: "", licenseNumber: "", dateOfBirth: "", phone: "" });
      setLicenseFile(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", licenseNumber: "", dateOfBirth: "", phone: "" });
    setLicenseFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Driver Management - {vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Drivers */}
          {userDrivers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {driver.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {driver.phone}
                              </span>
                            )}
                            {driver.licenseNumber && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {driver.licenseNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {driver.assignedVehicles.length > 0 
                          ? `Assigned to ${driver.assignedVehicles.length} vehicle(s)`
                          : "Available"
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Driver */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number (Optional)</Label>
                    <Input
                      id="license"
                      placeholder="e.g., DL1420110012345"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth (Optional)</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="license-upload">Upload Driving License (Optional)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <input
                      type="file"
                      id="license-upload"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="license-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {licenseFile ? licenseFile.name : "Click to upload license"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports JPG, PNG, PDF (Max 5MB)
                        </p>
                      </div>
                    </label>
                    
                    {licenseFile && (
                      <div className="mt-3 flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{licenseFile.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLicenseFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCreateDriver}
                  disabled={isLoading || !formData.name || !formData.phone}
                >
                  {isLoading ? "Adding Driver..." : "Add Driver"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverModal;
