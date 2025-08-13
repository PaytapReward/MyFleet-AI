import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Plus, History, ArrowUpDown, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FastagModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleNumber: string;
  isLinked: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  location?: string;
  balance: number;
}

// Mock transactions - Replace with API call
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "debit",
    amount: 85,
    description: "Toll Payment",
    location: "NH-44 Toll Plaza",
    balance: 1415
  },
  {
    id: "2",
    date: "2024-01-12",
    type: "credit",
    amount: 2000,
    description: "FASTag Recharge - Online",
    balance: 1500
  },
  {
    id: "3",
    date: "2024-01-10",
    type: "debit",
    amount: 120,
    description: "Toll Payment",
    location: "Mumbai-Pune Expressway",
    balance: 1620
  }
];

const FastagModal = ({ open, setOpen, vehicleNumber, isLinked }: FastagModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fastagBalance] = useState(1415); // Mock balance - Replace with API
  const { toast } = useToast();

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Money Added Successfully",
        description: `₹${amount} has been added to your FASTag account`,
      });
      
      setAmount("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkFastag = () => {
    toast({
      title: "Link FASTag",
      description: "Please visit the nearest toll booth or bank to link your FASTag",
    });
  };

  if (!isLinked) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              FASTag - {vehicleNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">FASTag Not Linked</h3>
                  <p className="text-muted-foreground mb-4">
                    Link your FASTag to enable seamless toll payments and track transactions.
                  </p>
                  <Button onClick={handleLinkFastag} className="w-full">
                    Link FASTag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            FASTag Account - {vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{fastagBalance}</div>
              <p className="text-muted-foreground mt-1">Available for toll payments</p>
              <Badge variant="secondary" className="mt-2 bg-status-active text-status-active-foreground">
                FASTag Active
              </Badge>
            </CardContent>
          </Card>

          {/* Add Money Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddMoney} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Money"}
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                {[200, 500, 1000, 2000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' 
                          ? 'bg-status-active/20' 
                          : 'bg-status-urgent/20'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowUpDown className="h-4 w-4 text-status-active rotate-180" />
                        ) : (
                          <MapPin className="h-4 w-4 text-status-urgent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.location && (
                          <p className="text-sm text-muted-foreground">{transaction.location}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-status-active' : 'text-status-urgent'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Balance: ₹{transaction.balance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FastagModal;