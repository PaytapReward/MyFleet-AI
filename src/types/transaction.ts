export type TransactionType = 
  | 'fuel' 
  | 'parking' 
  | 'fasttag' 
  | 'add_money' 
  | 'maintenance' 
  | 'insurance' 
  | 'revenue'
  | 'toll'
  | 'permit'
  | 'fine'
  | 'manual_income'
  | 'manual_expense';

export type PaymentMethod = 'upi' | 'cash' | 'bank_transfer' | 'other';

export interface Transaction {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  location?: string;
  reference?: string;
  category: 'income' | 'expense';
  paymentMethod?: PaymentMethod;
  isManual?: boolean;
}

export type DateRangeType = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';

export interface TransactionFilters {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  dateRangeType?: DateRangeType;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ProfitLossData {
  totalRevenue: number;
  totalExpenses: number;
  netProfitLoss: number;
  transactions: Transaction[];
  expenseBreakdown: Record<TransactionType, number>;
}