import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

interface ManualTransactionContextType {
  manualTransactions: Transaction[];
  addManualTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeManualTransaction: (id: string) => void;
  updateManualTransaction: (id: string, transaction: Partial<Transaction>) => void;
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
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>([]);

  // Load manual transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('manualTransactions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setManualTransactions(parsed);
      } catch (error) {
        console.error('Error loading manual transactions:', error);
      }
    }
  }, []);

  // Save to localStorage whenever manual transactions change
  useEffect(() => {
    localStorage.setItem('manualTransactions', JSON.stringify(manualTransactions));
  }, [manualTransactions]);

  const addManualTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isManual: true
    };
    setManualTransactions(prev => [newTransaction, ...prev]);
  };

  const removeManualTransaction = (id: string) => {
    setManualTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateManualTransaction = (id: string, updates: Partial<Transaction>) => {
    setManualTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
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