import { useState } from 'react';
import { ArrowUpDown, Download, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction, TransactionType } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

type SortField = 'date' | 'amount' | 'type' | 'vehicleNumber';
type SortDirection = 'asc' | 'desc';

const typeColors: Record<TransactionType, string> = {
  revenue: 'bg-status-active/10 text-status-active border-status-active/20',
  fuel: 'bg-orange-100 text-orange-800 border-orange-200',
  parking: 'bg-blue-100 text-blue-800 border-blue-200',
  toll: 'bg-purple-100 text-purple-800 border-purple-200',
  fasttag: 'bg-purple-100 text-purple-800 border-purple-200',
  maintenance: 'bg-red-100 text-red-800 border-red-200',
  insurance: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  add_money: 'bg-green-100 text-green-800 border-green-200',
  permit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  fine: 'bg-red-100 text-red-800 border-red-200'
};

const typeLabels: Record<TransactionType, string> = {
  revenue: 'Revenue',
  fuel: 'Fuel',
  parking: 'Parking',
  toll: 'Toll',
  fasttag: 'FASTag',
  maintenance: 'Maintenance',
  insurance: 'Insurance',
  add_money: 'Add Money',
  permit: 'Permit',
  fine: 'Fine'
};

export const TransactionTable = ({ transactions, isLoading }: TransactionTableProps) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'vehicleNumber':
        aValue = a.vehicleNumber;
        bValue = b.vehicleNumber;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  const exportToCSV = () => {
    const headers = ['Date', 'Vehicle Number', 'Type', 'Description', 'Amount', 'Location', 'Reference'];
    const rows = transactions.map(t => [
      t.date,
      t.vehicleNumber,
      typeLabels[t.type],
      t.description,
      t.amount.toString(),
      t.location || '',
      t.reference || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transaction Details</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {paginatedTransactions.length} of {transactions.length} transactions
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('vehicleNumber')}
                >
                  <div className="flex items-center">
                    Vehicle
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead 
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>{transaction.vehicleNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[transaction.type]}>
                      {typeLabels[transaction.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.category === 'income' ? 'text-status-active' : 'text-status-urgent'}>
                      {transaction.category === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-24">{transaction.location}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {transaction.reference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};