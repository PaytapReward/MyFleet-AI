import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Plus, ArrowUpRight, Link2, CheckCircle2, XCircle } from "lucide-react";
import { useVehicles } from "@/contexts/VehicleContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface FastagDashboardModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FastagDashboardModal = ({ open, setOpen }: FastagDashboardModalProps) => {
  const { t } = useTranslation();
  const { vehicles } = useVehicles();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const linkedVehicles = vehicles.filter(vehicle => vehicle.fastTagLinked);
  const totalFastagBalance = linkedVehicles.reduce((sum, vehicle) => sum + vehicle.payTapBalance, 0);

  const handleAddMoney = async (vehicleId: string, vehicleNumber: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Money Added Successfully",
        description: `₹${amount} added to ${vehicleNumber} FASTag account`,
      });
      setAmount("");
      setSelectedVehicle(null);
      setIsLoading(false);
    }, 1500);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('fleet.fastagDashboard')}
          </DialogTitle>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('fleet.totalBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalFastagBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('fleet.linkedVehicles')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{linkedVehicles.length}</div>
              <p className="text-xs text-muted-foreground">of {vehicles.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-active" />
                <span className="text-sm font-medium">All Active</span>
              </div>
              <p className="text-xs text-muted-foreground">No issues found</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Vehicle List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">FASTag Accounts</h3>
          
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vehicles found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vehicle.number}</h4>
                          <Badge variant={vehicle.fastTagLinked ? "default" : "secondary"}>
                            {vehicle.fastTagLinked ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Linked
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Not Linked
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {vehicle.fastTagLinked ? (
                        <>
                          <div className="text-right">
                            <div className="text-lg font-semibold">₹{vehicle.payTapBalance.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Balance</p>
                          </div>
                          
                          {selectedVehicle === vehicle.id ? (
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-2 min-w-[200px]">
                                <div className="flex gap-1">
                                  {quickAmounts.map((quickAmount) => (
                                    <Button
                                      key={quickAmount}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 px-2"
                                      onClick={() => setAmount(quickAmount.toString())}
                                    >
                                      ₹{quickAmount}
                                    </Button>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddMoney(vehicle.id, vehicle.number)}
                                    disabled={isLoading}
                                    className="h-8"
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedVehicle(null)}
                                    className="h-8"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVehicle(vehicle.id)}
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                {t('fleet.addMoney')}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <ArrowUpRight className="h-3 w-3" />
                                {t('fleet.viewTransactions')}
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Link2 className="h-3 w-3" />
                          Link FASTag
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FastagDashboardModal;