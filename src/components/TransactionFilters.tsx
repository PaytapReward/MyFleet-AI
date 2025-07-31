import { useState, useEffect } from 'react';
import { Calendar, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionFilters as ITransactionFilters, TransactionType } from '@/types/transaction';
import { useVehicles } from '@/contexts/VehicleContext';

interface TransactionFiltersProps {
  onFiltersChange: (filters: ITransactionFilters) => void;
  initialFilters?: ITransactionFilters;
}

const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'parking', label: 'Parking' },
  { value: 'toll', label: 'Toll/FASTag' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'add_money', label: 'Add Money' },
  { value: 'permit', label: 'Permit' },
  { value: 'fine', label: 'Fine' }
];

export const TransactionFilters = ({ onFiltersChange, initialFilters }: TransactionFiltersProps) => {
  const { vehicles } = useVehicles();
  const [filters, setFilters] = useState<ITransactionFilters>(initialFilters || {});
  
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  useEffect(() => {
    if (!initialFilters?.startDate && !initialFilters?.endDate) {
      setFilters(prev => ({
        ...prev,
        startDate: thirtyDaysAgo,
        endDate: today
      }));
    }
  }, [thirtyDaysAgo, today, initialFilters]);
  
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);
  
  const updateFilter = (key: keyof ITransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      startDate: thirtyDaysAgo,
      endDate: today
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={filters.startDate || thirtyDaysAgo}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={filters.endDate || today}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />
          </div>
          
          {/* Vehicle Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle</label>
            <Select 
              value={filters.vehicleId || 'all'} 
              onValueChange={(value) => updateFilter('vehicleId', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.number} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select 
              value={filters.type || 'all'} 
              onValueChange={(value) => updateFilter('type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {transactionTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Amount (₹)</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Amount (₹)</label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters.maxAmount || ''}
              onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search description, location..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};