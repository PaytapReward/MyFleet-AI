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
    { value: "corporate", label: "Corporate", icon: User },
    { value: "airport", label: "Airport", icon: Clock },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Create New Trip
          </DialogTitle>
          <DialogDescription>
            Fill in the trip details to create a new booking and assign a vehicle with driver.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Trip Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {tripTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <Button
                                key={type.value}
                                type="button"
                                variant={field.value === type.value ? "default" : "outline"}
                                className="h-auto p-4 flex flex-col gap-2"
                                onClick={() => field.onChange(type.value)}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="text-sm">{type.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Route Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="pickup.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pickup location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pickup.landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Near Metro Station" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="destination.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter destination location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination.landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Main Gate" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle and Driver Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle & Driver Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Vehicle</FormLabel>
                        <Select onValueChange={handleVehicleChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{vehicle.number}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">{vehicle.model}</span>
                                  {vehicle.driver && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      {vehicle.driver.name}
                                    </Badge>
                                  )}
                                </div>
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
                        <FormLabel>Select Driver</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a driver" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDrivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{driver.name}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">{driver.licenseNumber}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedVehicle && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-medium">{selectedVehicle.number}</span>
                        <span className="text-muted-foreground">{selectedVehicle.model}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Balance: ₹{selectedVehicle.payTapBalance.toLocaleString()}</span>
                      </div>
                      {selectedVehicle.fastTagLinked && (
                        <Badge variant="secondary" className="text-xs">FASTag Linked</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Passenger and Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Passenger & Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="passenger.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passenger Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter passenger name" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passenger.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledStartTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Start Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP p")
                                ) : (
                                  <span>Pick date and time</span>
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
                        <FormLabel>Base Fare (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter base fare"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any special instructions or notes"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Trip..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};