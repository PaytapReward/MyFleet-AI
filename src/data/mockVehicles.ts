// Generate mock financial data for different dates
const generateFinancialData = () => {
  const data = [];
  const today = new Date();
  
  // Generate data for the last 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    data.push({
      revenue: Math.floor(Math.random() * 5000) + 1000, // 1000-6000
      expenses: Math.floor(Math.random() * 3000) + 500,  // 500-3500
      date: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

export const mockVehicles = [
  {
    id: "1",
    number: "KA 01 AB 1234",
    model: "Tata Ace",
    payTapBalance: 2500,
    fastTagLinked: true,
    driver: "Mukesh Kumar",
    lastService: "15 Nov 2024",
    gpsLinked: true,
    challans: 0,
    documents: {
      pollution: { status: 'uploaded' as const, expiryDate: '2025-06-15' },
      registration: { status: 'uploaded' as const, expiryDate: '2026-12-20' },
      insurance: { status: 'expired' as const, expiryDate: '2024-10-30' },
      license: { status: 'uploaded' as const, expiryDate: '2025-08-22' }
    },
    financialData: generateFinancialData()
  },
  {
    id: "2",
    number: "KA 02 CD 5678",
    model: "Mahindra Bolero",
    payTapBalance: 1200,
    fastTagLinked: false,
    driver: "Rajesh Singh",
    lastService: "02 Nov 2024",
    gpsLinked: true,
    challans: 2,
    documents: {
      pollution: { status: 'missing' as const },
      registration: { status: 'uploaded' as const, expiryDate: '2025-03-15' },
      insurance: { status: 'uploaded' as const, expiryDate: '2025-04-10' },
      license: { status: 'expired' as const, expiryDate: '2024-09-12' }
    },
    financialData: generateFinancialData()
  },
  {
    id: "3",
    number: "KA 03 EF 9012",
    model: "Ashok Leyland Dost",
    payTapBalance: 3200,
    fastTagLinked: true,
    driver: null,
    lastService: "28 Oct 2024",
    gpsLinked: false,
    challans: 1,
    documents: {
      pollution: { status: 'uploaded' as const, expiryDate: '2025-01-20' },
      registration: { status: 'uploaded' as const, expiryDate: '2026-07-08' },
      insurance: { status: 'uploaded' as const, expiryDate: '2025-02-14' },
      license: { status: 'missing' as const }
    },
    financialData: generateFinancialData()
  },
  {
    id: "4",
    number: "KA 04 GH 3456",
    model: "Force Traveller",
    payTapBalance: 850,
    fastTagLinked: true,
    driver: "Suresh Reddy",
    lastService: "10 Nov 2024",
    gpsLinked: true,
    challans: 0,
    documents: {
      pollution: { status: 'uploaded' as const, expiryDate: '2025-05-30' },
      registration: { status: 'uploaded' as const, expiryDate: '2025-11-18' },
      insurance: { status: 'uploaded' as const, expiryDate: '2025-09-25' },
      license: { status: 'uploaded' as const, expiryDate: '2026-01-15' }
    },
    financialData: generateFinancialData()
  },
  {
    id: "5",
    number: "KA 05 IJ 7890",
    model: "Eicher Pro 1049",
    payTapBalance: 4500,
    fastTagLinked: false,
    driver: "Ramesh Yadav",
    lastService: "05 Nov 2024",
    gpsLinked: true,
    challans: 0,
    documents: {
      pollution: { status: 'expired' as const, expiryDate: '2024-08-15' },
      registration: { status: 'uploaded' as const, expiryDate: '2025-12-10' },
      insurance: { status: 'uploaded' as const, expiryDate: '2025-07-22' },
      license: { status: 'uploaded' as const, expiryDate: '2025-03-08' }
    },
    financialData: generateFinancialData()
  }
];