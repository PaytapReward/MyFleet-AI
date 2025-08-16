import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Car, User, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTrips } from "@/contexts/TripContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useDrivers } from "@/contexts/DriverContext";
import { TripType } from "@/types/trip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const createTripSchema = z.object({
  pickup: z.object({
    address: z.string().min(1, "Pickup address is required"),
    landmark: z.string().optional(),
  }),
  destination: z.object({
    address: z.string().min(1, "Destination address is required"),
    landmark: z.string().optional(),
  }),
  scheduledStartTime: z.date({
    required_error: "Scheduled start time is required",
  }),
  type: z.enum(["local", "intercity", "corporate", "airport"] as const),
  vehicleId: z.string().min(1, "Vehicle selection is required"),
  driverId: z.string().min(1, "Driver selection is required"),
  passenger: z.object({
    name: z.string().min(1, "Passenger name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
  }),
  baseFare: z.number().min(1, "Base fare must be greater than 0"),
  corporateAccountId: z.string().optional(),
  notes: z.string().optional(),
});

type CreateTripFormData = z.infer<typeof createTripSchema>;

interface CreateTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTripModal = ({ open, onOpenChange }: CreateTripModalProps) => {
  const { createTrip } = useTrips();
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      pickup: { address: "", landmark: "" },
      destination: { address: "", landmark: "" },
      scheduledStartTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      type: "local",
      passenger: { name: "", phone: "", email: "" },
      baseFare: 0,
      notes: "",
    },
  });

  const selectedVehicleId = form.watch("vehicleId");
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Filter available drivers (not assigned to other vehicles or assigned to selected vehicle)
  const availableDrivers = drivers.filter(driver => 
    !driver.assignedVehicles.length || 
    (selectedVehicleId && driver.assignedVehicles.includes(selectedVehicleId))
  );

  // Auto-suggest driver when vehicle is selected
  const handleVehicleChange = (vehicleId: string) => {
    form.setValue("vehicleId", vehicleId);
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle?.driver) {
      form.setValue("driverId", vehicle.driver.id);
    } else {
      // Find drivers assigned to this vehicle
      const assignedDriver = drivers.find(d => d.assignedVehicles.includes(vehicleId));
      if (assignedDriver) {
        form.setValue("driverId", assignedDriver.id);
      }
    }
  };

  const onSubmit = async (data: CreateTripFormData) => {
    try {
      setIsSubmitting(true);
      
      const selectedDriver = drivers.find(d => d.id === data.driverId);
      const selectedVehicle = vehicles.find(v => v.id === data.vehicleId);
      
      if (!selectedDriver || !selectedVehicle) {
        throw new Error("Selected driver or vehicle not found");
      }

      const tripData = {
        pickup: {
          address: data.pickup.address,
          landmark: data.pickup.landmark,
        },
        destination: {
          address: data.destination.address,
          landmark: data.destination.landmark,
        },
        scheduledStartTime: data.scheduledStartTime.toISOString(),
        type: data.type,
        passenger: {
          id: crypto.randomUUID(),
          name: data.passenger.name,
          phone: data.passenger.phone,
          email: data.passenger.email || undefined,
        },
        baseFare: data.baseFare,
        corporateAccountId: data.corporateAccountId,
        notes: data.notes,
      };

      await createTrip(tripData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tripTypes = [
    { value: "local", label: "Local", icon: Car },
    { value: "intercity", label: "Intercity", icon: MapPin },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car className="h-5 w-5" />
            Create New Trip
          </DialogTitle>
          <DialogDescription>
            Quick booking form for your next trip
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Trip Type - Simplified */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Trip Type</h3>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-3">
                        {tripTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <Button
                              key={type.value}
                              type="button"
                              variant={field.value === type.value ? "default" : "outline"}
                              className="flex-1 h-12"
                              onClick={() => field.onChange(type.value)}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {type.label}
                            </Button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Route - Simplified */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Route</h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="pickup.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">From</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Pickup location..." {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    const { latitude, longitude } = position.coords;
                                    field.onChange(`Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
                                  },
                                  (error) => {
                                    console.error("Error getting location:", error);
                                    alert("Unable to get current location. Please enter manually.");
                                  }
                                );
                              }
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">To</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Destination location..." {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => {
                              const destination = prompt("Enter destination address:");
                              if (destination) {
                                field.onChange(destination);
                              }
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vehicle & Driver - Simplified */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Assignment</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Vehicle</FormLabel>
                      <Select onValueChange={handleVehicleChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              <span className="font-medium">{vehicle.number}</span>
                              <span className="text-muted-foreground ml-1">• {vehicle.model}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Driver</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select driver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDrivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Passenger Details - Simplified */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Passenger</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="passenger.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Passenger name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passenger.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Trip Details - Simplified */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="scheduledStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Start Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM dd, HH:mm")
                              ) : (
                                <span>Pick time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baseFare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Fare (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Base fare"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes - Optional */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Special instructions..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};