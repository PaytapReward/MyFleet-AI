import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, History, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FuelModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleNumber: string;
  currentBalance: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balance: number;
}

// Mock transactions - Replace with API call
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "debit",
    amount: 1250,
    description: "Fuel Purchase - Petrol Pump",
    balance: 2750
  },
  {
    id: "2", 
    date: "2024-01-10",
    type: "credit",
    amount: 5000,
    description: "Money Added - Online",
    balance: 4000
  },
  {
    id: "3",
    date: "2024-01-08",
    type: "debit",
    amount: 800,
    description: "Fuel Purchase - Highway Pump",
    balance: 1800
  }
];

const FuelModal = ({ open, setOpen, vehicleNumber, currentBalance }: FuelModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        description: `₹${amount} has been added to your fuel account`,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Fuel Account - {vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{currentBalance}</div>
              <p className="text-muted-foreground mt-1">Available for fuel purchases</p>
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
                {[500, 1000, 2000, 5000].map((quickAmount) => (
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
                        <ArrowUpDown className={`h-4 w-4 ${
                          transaction.type === 'credit' 
                            ? 'text-status-active rotate-180' 
                            : 'text-status-urgent'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
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

export default FuelModal;