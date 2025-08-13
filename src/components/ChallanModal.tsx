import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CreditCard, MapPin, Calendar, IndianRupee, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Challan {
  id: string;
  challanNumber: string;
  amount: number;
  issueDate: string;
  location: string;
  violation: string;
  status: 'pending' | 'paid' | 'disputed';
  dueDate: string;
  vehicleNumber: string;
}

interface ChallanModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleNumber: string;
  challanCount: number;
}

export const ChallanModal: React.FC<ChallanModalProps> = ({ 
  open, 
  setOpen, 
  vehicleNumber, 
  challanCount 
}) => {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [payingChallan, setPayingChallan] = useState<string | null>(null);

  // Mock challans data - replace with actual API call
  const mockChallans: Challan[] = [
    {
      id: '1',
      challanNumber: 'CH001234567',
      amount: 1500,
      issueDate: '2024-01-15',
      location: 'MG Road, Bangalore',
      violation: 'Over Speeding',
      status: 'pending',
      dueDate: '2024-02-15',
      vehicleNumber: vehicleNumber
    },
    {
      id: '2',
      challanNumber: 'CH001234568',
      amount: 500,
      issueDate: '2024-01-20',
      location: 'Brigade Road, Bangalore',
      violation: 'Improper Parking',
      status: 'pending',
      dueDate: '2024-02-20',
      vehicleNumber: vehicleNumber
    }
  ];

  const fetchChallans = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data by vehicle number and take only the count
      const vehicleChallans = mockChallans
        .filter(challan => challan.vehicleNumber === vehicleNumber)
        .slice(0, challanCount);
      
      setChallans(vehicleChallans);
    } catch (error) {
      toast.error('Failed to fetch challans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChallans();
    }
  }, [open, vehicleNumber]);

  const handlePayChallan = async (challanId: string, amount: number) => {
    setPayingChallan(challanId);
    
    try {
      // Simulate payment API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update challan status
      setChallans(prev => prev.map(challan => 
        challan.id === challanId 
          ? { ...challan, status: 'paid' as const }
          : challan
      ));
      
      toast.success(`Payment of ₹${amount} successful!`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPayingChallan(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-status-active text-white';
      case 'disputed':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-status-urgent text-white';
    }
  };

  const totalPending = challans
    .filter(challan => challan.status === 'pending')
    .reduce((sum, challan) => sum + challan.amount, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <AlertTriangle className="h-5 w-5 text-status-urgent" />
            Challans - {vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Summary Card */}
          {challans.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-status-urgent">
                      {challans.filter(c => c.status === 'pending').length}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      ₹{totalPending.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading challans...</p>
              </div>
            </div>
          )}

          {/* No Challans */}
          {!isLoading && challans.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No Challans Found</p>
              <p className="text-sm text-muted-foreground">
                Great! This vehicle has no pending challans.
              </p>
            </div>
          )}

          {/* Challans List */}
          {!isLoading && challans.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Challan Details</h3>
              
              {challans.map((challan, index) => (
                <Card key={challan.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            {challan.challanNumber}
                          </p>
                          <Badge className={`text-xs ${getStatusColor(challan.status)}`}>
                            {challan.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-primary">
                          ₹{challan.amount.toLocaleString()}
                        </p>
                      </div>

                      <Separator />

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Violation:</span>
                          <span className="font-medium">{challan.violation}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{challan.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Issue Date:</span>
                          <span className="font-medium">{formatDate(challan.issueDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium text-status-urgent">
                            {formatDate(challan.dueDate)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {challan.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handlePayChallan(challan.id, challan.amount)}
                            disabled={payingChallan === challan.id}
                            className="flex-1"
                          >
                            {payingChallan === challan.id ? (
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-3 w-3" />
                                Pay ₹{challan.amount}
                              </div>
                            )}
                          </Button>
                          
                          <Button size="sm" variant="outline" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pay All Button */}
          {!isLoading && challans.filter(c => c.status === 'pending').length > 1 && (
            <Card className="border-primary">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Pay All Pending Challans</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Total: ₹{totalPending.toLocaleString()}
                    </p>
                  </div>
                  <Button className="w-full sm:w-auto">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Pay All (₹{totalPending.toLocaleString()})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};