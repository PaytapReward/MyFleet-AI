import { Transaction, TransactionType } from '@/types/transaction';

const locations = [
  'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Gurgaon',
  'Noida', 'Faridabad', 'Greater Noida', 'Vasant Kunj', 'Saket'
];

const fuelStations = [
  'Indian Oil Petrol Pump', 'HP Petrol Station', 'Reliance Fuel Station',
  'Shell Petrol Pump', 'Essar Fuel Station'
];

const generateRandomReference = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const generateDailyTransactions = (vehicleId: string, vehicleNumber: string, date: Date): Transaction[] => {
  const transactions: Transaction[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  // Daily revenue (2-4 trips per day)
  const tripCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < tripCount; i++) {
    const revenue = Math.floor(Math.random() * 3000) + 1000; // ₹1000-4000 per trip
    transactions.push({
      id: `${vehicleId}-rev-${dateStr}-${i}`,
      vehicleId,
      vehicleNumber,
      type: 'revenue',
      amount: revenue,
      description: `Trip earnings - ${locations[Math.floor(Math.random() * locations.length)]}`,
      date: dateStr,
      location: locations[Math.floor(Math.random() * locations.length)],
      reference: generateRandomReference(),
      category: 'income'
    });
  }
  
  // Daily fuel expense (70% chance)
  if (Math.random() > 0.3) {
    const fuelAmount = Math.floor(Math.random() * 1500) + 500; // ₹500-2000
    transactions.push({
      id: `${vehicleId}-fuel-${dateStr}`,
      vehicleId,
      vehicleNumber,
      type: 'fuel',
      amount: fuelAmount,
      description: `Fuel refill - ${fuelStations[Math.floor(Math.random() * fuelStations.length)]}`,
      date: dateStr,
      location: locations[Math.floor(Math.random() * locations.length)],
      reference: generateRandomReference(),
      category: 'expense'
    });
  }
  
  // Parking payments (50% chance)
  if (Math.random() > 0.5) {
    const parkingAmount = Math.floor(Math.random() * 150) + 50; // ₹50-200
    transactions.push({
      id: `${vehicleId}-parking-${dateStr}`,
      vehicleId,
      vehicleNumber,
      type: 'parking',
      amount: parkingAmount,
      description: `Parking fee - ${locations[Math.floor(Math.random() * locations.length)]}`,
      date: dateStr,
      location: locations[Math.floor(Math.random() * locations.length)],
      reference: generateRandomReference(),
      category: 'expense'
    });
  }
  
  // FASTag payments (40% chance)
  if (Math.random() > 0.6) {
    const tollAmount = Math.floor(Math.random() * 400) + 50; // ₹50-450
    transactions.push({
      id: `${vehicleId}-toll-${dateStr}`,
      vehicleId,
      vehicleNumber,
      type: 'toll',
      amount: tollAmount,
      description: `Toll payment via FASTag`,
      date: dateStr,
      location: `${locations[Math.floor(Math.random() * locations.length)]} Toll Plaza`,
      reference: `FT${generateRandomReference()}`,
      category: 'expense'
    });
  }
  
  return transactions;
};

const generatePeriodicTransactions = (vehicleId: string, vehicleNumber: string): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Maintenance (random in last 30 days)
  if (Math.random() > 0.7) {
    const maintenanceDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const maintenanceAmount = Math.floor(Math.random() * 13000) + 2000; // ₹2000-15000
    transactions.push({
      id: `${vehicleId}-maintenance-${maintenanceDate.toISOString().split('T')[0]}`,
      vehicleId,
      vehicleNumber,
      type: 'maintenance',
      amount: maintenanceAmount,
      description: 'Vehicle maintenance and servicing',
      date: maintenanceDate.toISOString().split('T')[0],
      location: locations[Math.floor(Math.random() * locations.length)],
      reference: `SRV${generateRandomReference()}`,
      category: 'expense'
    });
  }
  
  // Insurance payment (monthly)
  const insuranceDate = new Date(today.getFullYear(), today.getMonth(), 1);
  transactions.push({
    id: `${vehicleId}-insurance-${insuranceDate.toISOString().split('T')[0]}`,
    vehicleId,
    vehicleNumber,
    type: 'insurance',
    amount: 2500,
    description: 'Monthly insurance premium',
    date: insuranceDate.toISOString().split('T')[0],
    reference: `INS${generateRandomReference()}`,
    category: 'expense'
  });
  
  // Add money transactions (random)
  if (Math.random() > 0.5) {
    const addMoneyDate = new Date(today.getTime() - Math.random() * 15 * 24 * 60 * 60 * 1000);
    const addMoneyAmount = [1000, 2000, 5000][Math.floor(Math.random() * 3)];
    transactions.push({
      id: `${vehicleId}-addmoney-${addMoneyDate.toISOString().split('T')[0]}`,
      vehicleId,
      vehicleNumber,
      type: 'add_money',
      amount: addMoneyAmount,
      description: 'Wallet top-up for vehicle expenses',
      date: addMoneyDate.toISOString().split('T')[0],
      reference: `TOP${generateRandomReference()}`,
      category: 'expense'
    });
  }
  
  return transactions;
};

export const generateMockTransactions = (vehicles: Array<{ id: string; number: string }>): Transaction[] => {
  const allTransactions: Transaction[] = [];
  const today = new Date();
  
  vehicles.forEach(vehicle => {
    // Generate daily transactions for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dailyTransactions = generateDailyTransactions(vehicle.id, vehicle.number, date);
      allTransactions.push(...dailyTransactions);
    }
    
    // Generate periodic transactions
    const periodicTransactions = generatePeriodicTransactions(vehicle.id, vehicle.number);
    allTransactions.push(...periodicTransactions);
  });
  
  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};