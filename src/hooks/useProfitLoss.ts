import { useMemo } from 'react';
import { Vehicle, PnLPeriod } from '@/types/vehicle';

export const useProfitLoss = (vehicles: Vehicle[], period: PnLPeriod) => {
  return useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(today);
        break;
      case 'weekly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'yearly':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    let totalRevenue = 0;
    let totalExpenses = 0;
    
    vehicles.forEach(vehicle => {
      vehicle.financialData.forEach(data => {
        if (period === 'today') {
          if (data.date === todayStr) {
            totalRevenue += data.revenue;
            totalExpenses += data.expenses;
          }
        } else {
          if (data.date >= startDateStr && data.date <= todayStr) {
            totalRevenue += data.revenue;
            totalExpenses += data.expenses;
          }
        }
      });
    });
    
    const pnl = totalRevenue - totalExpenses;
    
    return {
      profit: totalRevenue,
      loss: totalExpenses,
      netPnL: pnl,
      isProfit: pnl >= 0
    };
  }, [vehicles, period]);
};