import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useVehicles } from "@/contexts/VehicleContext";
import { useToast } from "@/hooks/use-toast";
import { AddVehicleFormData } from "@/types/vehicle";

const AddVehicleModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddVehicleFormData>({
    number: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { addVehicle, vehicles } = useVehicles();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.number.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Vehicle number is required"
        });
        return;
      }


      // Check for duplicate vehicle number
      const isDuplicate = vehicles.some(vehicle => 
        vehicle.number.toLowerCase() === formData.number.toLowerCase()
      );

      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Vehicle number already exists"
        });
        return;
      }

      // Check vehicle limit
      if (vehicles.length >= 25) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Maximum 25 vehicles allowed"
        });
        return;
      }

      await addVehicle(formData);
      
      toast({
        title: "Success",
        description: "Vehicle added successfully"
      });

      // Reset form and close modal
      setFormData({ number: "" });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add vehicle"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Vehicle Number</Label>
            <Input
              id="number"
              placeholder="e.g., KA 03 NC 6479"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              className="uppercase"
            />
            <p className="text-sm text-muted-foreground">
              Vehicle details will be fetched automatically from the registry
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Fetching Details..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;