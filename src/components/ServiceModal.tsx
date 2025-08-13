import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Wrench, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicle: {
    id: string;
    number: string;
    lastService: string;
  };
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ open, setOpen, vehicle }) => {
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScheduleService = async () => {
    if (!nextServiceDate) {
      toast.error('Please select a service date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Service scheduled successfully!');
      setOpen(false);
      setNextServiceDate('');
      setServiceType('');
    } catch (error) {
      toast.error('Failed to schedule service');
    } finally {
      setIsSubmitting(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wrench className="h-5 w-5 text-primary" />
            Service Schedule - {vehicle.number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Current Service Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Last Service
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base font-medium text-foreground">
                {vehicle.lastService}
              </p>
            </CardContent>
          </Card>

          {/* Schedule New Service */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Schedule Next Service
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceDate" className="text-xs sm:text-sm">
                  Next Service Date *
                </Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={nextServiceDate}
                  onChange={(e) => setNextServiceDate(e.target.value)}
                  className="text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-xs sm:text-sm">
                  Service Type (Optional)
                </Label>
                <Input
                  id="serviceType"
                  type="text"
                  placeholder="e.g., Oil Change, Full Service, etc."
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="text-sm"
                />
              </div>

              {nextServiceDate && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Scheduled for: <span className="font-medium text-foreground">
                      {formatDate(nextServiceDate)}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleService}
              disabled={!nextServiceDate || isSubmitting}
              className="flex-1 text-sm"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-3 w-3" />
                  Schedule Service
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};