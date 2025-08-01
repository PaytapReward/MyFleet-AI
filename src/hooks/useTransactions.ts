import { useMemo } from 'react';
import { Transaction, TransactionFilters, ProfitLossData } from '@/types/transaction';
import { generateMockTransactions } from '@/data/mockTransactions';
import { useVehicles } from '@/contexts/VehicleContext';
import { useManualTransactions } from '@/contexts/ManualTransactionContext';

export const useTransactions = (filters?: TransactionFilters) => {
  const { vehicles } = useVehicles();
  const { manualTransactions } = useManualTransactions();
  
  const allTransactions = useMemo(() => {
    // Only show manual transactions - remove mock data for production
    return [...manualTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [manualTransactions]);
  
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];
    
    if (!filters) return filtered;
    
    if (filters.vehicleId) {
      filtered = filtered.filter(t => t.vehicleId === filters.vehicleId);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate!);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate!);
    }
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }
    
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.vehicleNumber.toLowerCase().includes(searchLower) ||
        t.location?.toLowerCase().includes(searchLower) ||
        t.reference?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [allTransactions, filters]);
  
  const profitLossData = useMemo((): ProfitLossData => {
    const revenue = filteredTransactions
      .filter(t => t.category === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.category === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenseBreakdown = filteredTransactions
      .filter(t => t.category === 'expense')
      .reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfitLoss: revenue - expenses,
      transactions: filteredTransactions,
      expenseBreakdown
    };
  }, [filteredTransactions]);
  
  return {
    transactions: filteredTransactions,
    profitLossData,
    isLoading: false
  };
};