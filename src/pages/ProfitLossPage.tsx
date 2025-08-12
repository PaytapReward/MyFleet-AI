import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { AddTransactionHero } from '@/components/AddTransactionHero';
import { TransactionFilters } from '@/components/TransactionFilters';
import { ProfitLossSummary } from '@/components/ProfitLossSummary';
import { TransactionTable } from '@/components/TransactionTable';
import { TransactionListMobile } from '@/components/TransactionListMobile';
import { MobileFilterBar } from '@/components/MobileFilterBar';
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
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Bar */}
        <div className="md:hidden">
          <MobileFilterBar initialFilters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block">
          <TransactionFilters 
            onFiltersChange={setFilters}
            initialFilters={filters}
          />
        </div>
        
        {/* Add Transaction Hero */}
        <AddTransactionHero />
        
        {/* Summary Cards */}
        <ProfitLossSummary data={profitLossData} />
        
        {/* Mobile Transaction List */}
        <div className="md:hidden">
          <TransactionListMobile 
            transactions={profitLossData.transactions}
            isLoading={isLoading}
          />
        </div>
        
        {/* Desktop Transaction Table */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TransactionTable 
            transactions={profitLossData.transactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitLossPage;