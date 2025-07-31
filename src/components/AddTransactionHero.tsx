import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddTransactionModal } from '@/components/AddTransactionModal';

export const AddTransactionHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedType, setPreSelectedType] = useState<'manual_income' | 'manual_expense' | undefined>();

  const handleAddIncome = () => {
    setPreSelectedType('manual_income');
    setModalOpen(true);
  };

  const handleAddExpense = () => {
    setPreSelectedType('manual_expense');
    setModalOpen(true);
  };

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Quick Add Transaction</h2>
            <p className="text-muted-foreground">
              Add income or expenses to track your fleet's financial performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="success"
              onClick={handleAddIncome}
              className="h-16 text-lg flex flex-col gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <TrendingUp className="h-5 w-5" />
              </div>
              Add Income
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              onClick={handleAddExpense}
              className="h-16 text-lg flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <TrendingDown className="h-5 w-5" />
              </div>
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddTransactionModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPreSelectedType(undefined);
        }}
        preSelectedType={preSelectedType}
      />
    </>
  );
};