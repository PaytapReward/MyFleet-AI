import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useManualTransactions } from '@/contexts/ManualTransactionContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { useToast } from '@/hooks/use-toast';

interface SimpleTransactionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  type: 'income' | 'expense';
}

const formSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

export const SimpleTransactionModal = ({ 
  isOpen: externalOpen, 
  onClose: externalOnClose, 
  type
}: SimpleTransactionModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { addManualTransaction } = useManualTransactions();
  const { vehicles } = useVehicles();
  const { toast } = useToast();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnClose ? (value: boolean) => {
    if (!value) externalOnClose();
  } : setInternalOpen;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: ''
    }
  });
  
  const onSubmit = (data: FormData) => {
    // Use first vehicle as default, or create a general vehicle entry
    const defaultVehicle = vehicles[0] || { id: 'general', number: 'General' };
    
    addManualTransaction({
      vehicleId: defaultVehicle.id,
      vehicleNumber: defaultVehicle.number,
      type: type === 'income' ? 'manual_income' : 'manual_expense',
      amount: data.amount,
      description: data.description,
      date: new Date().toISOString().split('T')[0],
      category: type,
      paymentMethod: 'cash', // Default payment method
      isManual: true
    });
    
    toast({
      title: `${type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `₹${data.amount.toLocaleString()} has been recorded.`
    });
    
    form.reset();
    setOpen(false);
  };

  const titleText = type === 'income' ? 'Add Income' : 'Add Expense';
  const buttonText = type === 'income' ? 'Add Income' : 'Add Expense';
  const placeholderText = type === 'income' 
    ? 'Trip earnings, bonus payment, etc.' 
    : 'Fuel, maintenance, parking, etc.';
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {titleText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {titleText}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What was this for?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholderText}
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className={type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};