import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.vehicleId) count++;
    if (filters.type) count++;
    if (filters.minAmount) count++;
    if (filters.maxAmount) count++;
    if (filters.search) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  
  return (
    <div className="mb-6 p-4 bg-card border rounded-lg">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={filters.startDate || thirtyDaysAgo}
            onChange={(e) => updateFilter('startDate', e.target.value)}
            className="w-auto text-sm"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={filters.endDate || today}
            onChange={(e) => updateFilter('endDate', e.target.value)}
            className="w-auto text-sm"
          />
        </div>

        {/* Vehicle Filter */}
        <Select 
          value={filters.vehicleId || 'all'} 
          onValueChange={(value) => updateFilter('vehicleId', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[200px]">
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

        {/* Quick Type Filters */}
        <div className="flex gap-2">
          <Button
            variant={!filters.type ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('type', undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.type === 'revenue' ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('type', filters.type === 'revenue' ? undefined : 'revenue')}
          >
            Income
          </Button>
          <Button
            variant={filters.type && filters.type !== 'revenue' ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('type', filters.type && filters.type !== 'revenue' ? undefined : 'fuel')}
          >
            Expenses
          </Button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* More Filters Button */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              More
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          {/* Advanced Filters */}
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              {/* Detailed Transaction Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Specific Type</label>
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
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Clear Filters */}
        {(activeFilterCount > 0 || filters.startDate !== thirtyDaysAgo || filters.endDate !== today) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};