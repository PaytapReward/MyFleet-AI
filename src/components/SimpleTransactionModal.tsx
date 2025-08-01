import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, IndianRupee, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useManualTransactions } from '@/contexts/ManualTransactionContext';
import { useVehicles } from '@/contexts/VehicleContext';
import { useToast } from '@/hooks/use-toast';
import { TransactionType } from '@/types/transaction';

interface SimpleTransactionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  type: 'income' | 'expense';
}

// Income categories for vehicle owners
const incomeCategories: { value: TransactionType; label: string }[] = [
  { value: 'revenue', label: 'Trip Earnings/Revenue' },
  { value: 'manual_income', label: 'Booking Commission' },
  { value: 'add_money', label: 'Daily/Weekly Bonus' },
  { value: 'manual_income', label: 'Fuel Reimbursement' },
  { value: 'manual_income', label: 'Other Income' },
];

// Expense categories for vehicle owners
const expenseCategories: { value: TransactionType; label: string }[] = [
  { value: 'fuel', label: 'Fuel' },
  { value: 'maintenance', label: 'Maintenance & Repair' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'parking', label: 'Parking Fees' },
  { value: 'toll', label: 'Toll/FASTag Charges' },
  { value: 'fasttag', label: 'FASTag Recharge' },
  { value: 'permit', label: 'Vehicle Documents (License, Registration, etc.)' },
  { value: 'fine', label: 'Fines & Penalties' },
  { value: 'manual_expense', label: 'Other Expenses' },
];

const formSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  attachment: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const SimpleTransactionModal = ({ 
  isOpen: externalOpen, 
  onClose: externalOnClose, 
  type
}: SimpleTransactionModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
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
      vehicleId: '',
      category: '',
      description: '',
    }
  });
  
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  
  const onSubmit = (data: FormData) => {
    const selectedVehicle = vehicles.find(v => v.id === data.vehicleId) || { id: 'general', number: 'General' };
    const selectedCategory = categories.find(c => c.value === data.category);
    
    addManualTransaction({
      vehicleId: selectedVehicle.id,
      vehicleNumber: selectedVehicle.number,
      type: data.category as TransactionType,
      amount: data.amount,
      description: data.description,
      date: new Date().toISOString().split('T')[0],
      category: type,
      paymentMethod: 'cash',
      isManual: true,
      reference: attachedFile ? `attachment-${attachedFile.name}` : undefined,
    });
    
    toast({
      title: `${type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `₹${data.amount.toLocaleString()} for ${selectedCategory?.label} has been recorded.`
    });
    
    form.reset();
    setAttachedFile(null);
    setOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 5MB.',
          variant: 'destructive'
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a JPEG, PNG, or PDF file.',
          variant: 'destructive'
        });
        return;
      }
      
      setAttachedFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    // Reset the file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const titleText = type === 'income' ? 'Add Income' : 'Add Expense';
  const buttonText = type === 'income' ? 'Add Income' : 'Add Expense';
  
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
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
                  <FormLabel>Amount (₹) *</FormLabel>
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

            {/* Vehicle Selection */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General (Not vehicle-specific)</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.number} - {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${type} category`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about this transaction..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Attachment */}
            <div className="space-y-2">
              <FormLabel>Attachment (Optional)</FormLabel>
              <div className="flex flex-col gap-2">
                {!attachedFile && (
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-input" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> receipt or bill
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
                
                {attachedFile && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeAttachment}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload receipts, bills, or other supporting documents for this transaction.
              </p>
            </div>
            
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