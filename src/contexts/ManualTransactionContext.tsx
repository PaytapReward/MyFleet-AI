import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '@/types/transaction';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ManualTransactionContextType {
  manualTransactions: Transaction[];
  addManualTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  removeManualTransaction: (id: string) => Promise<void>;
  updateManualTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
}

const ManualTransactionContext = createContext<ManualTransactionContextType | undefined>(undefined);

export const useManualTransactions = () => {
  const context = useContext(ManualTransactionContext);
  if (!context) {
    throw new Error('useManualTransactions must be used within a ManualTransactionProvider');
  }
  return context;
};

export const ManualTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>([]);

  // Load transactions from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setManualTransactions([]);
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      // First, try to migrate from localStorage
      await migrateFromLocalStorage();
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_manual', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to Transaction interface
      const transformedTransactions: Transaction[] = data?.map(tx => ({
        id: tx.id,
        date: tx.date,
        vehicleId: tx.vehicle_id,
        vehicleNumber: tx.vehicle_number,
        type: (tx.type === 'income' ? 'manual_income' : 'manual_expense') as TransactionType,
        amount: Number(tx.amount),
        description: tx.description,
        reference: tx.reference || '',
        category: tx.category as 'income' | 'expense',
        paymentMethod: (tx.payment_method || 'cash') as PaymentMethod,
        isManual: tx.is_manual || false,
        location: tx.location || ''
      })) || [];
      
      setManualTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error loading transactions",
        description: "Failed to load your transactions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const migrateFromLocalStorage = async () => {
    if (!user) return;
    
    const storedTransactions = localStorage.getItem('manualTransactions');
    
    if (storedTransactions) {
      try {
        const localTransactions: Transaction[] = JSON.parse(storedTransactions);
        
        // Check if we already have transactions in Supabase
        const { data: existingTransactions } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', user.id);
        
        if (!existingTransactions?.length && localTransactions.length > 0) {
          // Migrate transactions to Supabase
          const transactionsToInsert = localTransactions.map(tx => ({
            date: tx.date,
            vehicle_id: tx.vehicleId,
            vehicle_number: tx.vehicleNumber,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            reference: tx.reference,
            category: tx.category,
            payment_method: tx.paymentMethod,
            is_manual: true,
            location: tx.location,
            user_id: user.id
          }));
          
          const { error } = await supabase
            .from('transactions')
            .insert(transactionsToInsert);
          
          if (!error) {
            localStorage.removeItem('manualTransactions');
            toast({
              title: "Data migrated",
              description: "Your transactions have been migrated to the cloud.",
            });
          }
        }
      } catch (error) {
        console.error('Error migrating transactions:', error);
      }
    }
  };

  const addManualTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          date: transaction.date,
          vehicle_id: transaction.vehicleId,
          vehicle_number: transaction.vehicleNumber,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          reference: transaction.reference,
          category: transaction.category,
          payment_method: transaction.paymentMethod,
          is_manual: true,
          location: transaction.location,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newTransaction: Transaction = {
        id: data.id,
        date: data.date,
        vehicleId: data.vehicle_id,
        vehicleNumber: data.vehicle_number,
        type: (data.type === 'income' ? 'manual_income' : 'manual_expense') as TransactionType,
        amount: Number(data.amount),
        description: data.description,
        reference: data.reference || '',
        category: data.category as 'income' | 'expense',
        paymentMethod: (data.payment_method || 'cash') as PaymentMethod,
        isManual: true,
        location: data.location || ''
      };
      
      setManualTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Transaction added",
        description: "Manual transaction has been saved.",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error adding transaction",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeManualTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setManualTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Transaction deleted",
        description: "Transaction has been removed.",
      });
    } catch (error) {
      console.error('Error removing transaction:', error);
      toast({
        title: "Error removing transaction",
        description: "Failed to remove transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateManualTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          date: updates.date,
          vehicle_id: updates.vehicleId,
          vehicle_number: updates.vehicleNumber,
          type: updates.type,
          amount: updates.amount,
          description: updates.description,
          reference: updates.reference,
          category: updates.category,
          payment_method: updates.paymentMethod,
          location: updates.location
        })
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setManualTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
      
      toast({
        title: "Transaction updated",
        description: "Transaction has been updated.",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error updating transaction",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ManualTransactionContext.Provider value={{
      manualTransactions,
      addManualTransaction,
      removeManualTransaction,
      updateManualTransaction
    }}>
      {children}
    </ManualTransactionContext.Provider>
  );
};