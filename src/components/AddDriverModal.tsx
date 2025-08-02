import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, UserPlus } from 'lucide-react';

const AddDriverModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    fullName: '',
    licenseNumber: '',
    documentFile: null as File | null
  });
  const { createDriver } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.fullName || !formData.licenseNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await createDriver(formData);
      if (success) {
        toast({
          title: "Driver Added Successfully",
          description: "Driver account has been created and OTP sent to their phone",
        });
        setFormData({
          phone: '',
          fullName: '',
          licenseNumber: '',
          documentFile: null
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Failed to Add Driver",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create driver account",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({ ...prev, documentFile: file }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Driver
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                  <span className="text-sm text-muted-foreground font-medium">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    phone: e.target.value.replace(/\D/g, '').slice(0, 10) 
                  }))}
                  className="rounded-l-none"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter driver's full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-sm font-medium">
                License Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="licenseNumber"
                type="text"
                placeholder="e.g., DL14-20150012345"
                value={formData.licenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value.toUpperCase() }))}
                required
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">
                License Copy <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="document"
                  className="flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload license copy</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (max 5MB)</p>
                  </div>
                </label>
                {formData.documentFile && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <span className="text-green-600">✓</span> {formData.documentFile.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating Account...' : 'Create Driver Account'}
            </Button>
          </div>
        </form>

        <div className="bg-muted/50 p-3 rounded-lg border border-border/50 mt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> The driver will receive an OTP to verify their account and can then login using Driver Login option.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModal;