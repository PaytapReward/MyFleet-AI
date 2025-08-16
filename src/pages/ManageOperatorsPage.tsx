import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, Search, Users, UserCheck, Phone, Calendar, Edit, Trash2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDrivers } from "@/contexts/DriverContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import DriverModal from "@/components/DriverModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageOperatorsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { drivers, removeDriver, isLoading } = useDrivers();
  const { vehicles } = useVehicles();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDriver, setDeleteDriver] = useState<string | null>(null);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDriver = (driverId: string) => {
    removeDriver(driverId);
    setDeleteDriver(null);
    toast.success("Driver removed successfully");
  };

  const getAssignedVehicles = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver || !driver.assignedVehicles?.length) return [];
    
    return vehicles.filter(v => driver.assignedVehicles.includes(v.id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading operators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t("nav.manageOperators")}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your fleet operators and vehicle assignments
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Operator
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 space-y-6">
        {/* Search and Stats */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">{drivers.length}</span>
                <span className="text-muted-foreground">Total Operators</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Drivers List */}
        {filteredDrivers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No operators found" : "No operators yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Add your first operator to get started with fleet management"
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Operator
                </Button>
              )}
            </CardContent>
          </Card>
        ) : isMobile ? (
          // Mobile Card View
          <div className="space-y-4">
            {filteredDrivers.map((driver) => {
              const assignedVehicles = getAssignedVehicles(driver.id);
              return (
                <Card key={driver.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          License: {driver.licenseNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteDriver(driver.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {driver.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {driver.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      DOB: {new Date(driver.dateOfBirth).toLocaleDateString()}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Assigned Vehicles:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assignedVehicles.length > 0 ? (
                          assignedVehicles.map((vehicle) => (
                            <Badge key={vehicle.id} variant="secondary">
                              {vehicle.number}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No vehicles assigned</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Desktop Table View
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Assigned Vehicles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => {
                  const assignedVehicles = getAssignedVehicles(driver.id);
                  return (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.licenseNumber}</TableCell>
                      <TableCell>{driver.phone || "—"}</TableCell>
                      <TableCell>
                        {new Date(driver.dateOfBirth).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignedVehicles.length > 0 ? (
                            assignedVehicles.map((vehicle) => (
                              <Badge key={vehicle.id} variant="secondary" className="text-xs">
                                {vehicle.number}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No vehicles
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDriver(driver.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Add Driver Modal */}
      <DriverModal
        open={showAddModal}
        setOpen={setShowAddModal}
        vehicleId=""
        vehicleNumber=""
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDriver} onOpenChange={() => setDeleteDriver(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Operator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this operator? This action cannot be undone.
              The operator will be unassigned from all vehicles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDriver && handleDeleteDriver(deleteDriver)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}