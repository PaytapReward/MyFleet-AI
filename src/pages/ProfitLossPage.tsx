import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { AddTransactionHero } from '@/components/AddTransactionHero';
import { TransactionFilters } from '@/components/TransactionFilters';
import { ProfitLossSummary } from '@/components/ProfitLossSummary';
import { TransactionTable } from '@/components/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionFilters as ITransactionFilters } from '@/types/transaction';
import { useNavigate } from 'react-router-dom';

const ProfitLossPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ITransactionFilters>({});
  const { profitLossData, isLoading } = useTransactions(filters);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
              <p className="text-muted-foreground">
                Comprehensive financial overview and transaction details
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <TransactionFilters 
          onFiltersChange={setFilters}
          initialFilters={filters}
        />
        
        {/* Add Transaction Hero */}
        <AddTransactionHero />
        
        {/* Summary Cards */}
        <ProfitLossSummary data={profitLossData} />
        
        {/* Transaction Table */}
        <TransactionTable 
          transactions={profitLossData.transactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfitLossPage;