export const monthlyData = [
  { month: 'Jan', propPremiums: 142, propClaims: 91,  autoPremiums: 98,  autoClaims: 67  },
  { month: 'Feb', propPremiums: 148, propClaims: 88,  autoPremiums: 102, autoClaims: 71  },
  { month: 'Mar', propPremiums: 155, propClaims: 102, autoPremiums: 108, autoClaims: 58  },
  { month: 'Apr', propPremiums: 151, propClaims: 115, autoPremiums: 105, autoClaims: 82  },
  { month: 'May', propPremiums: 160, propClaims: 97,  autoPremiums: 112, autoClaims: 74  },
  { month: 'Jun', propPremiums: 158, propClaims: 108, autoPremiums: 118, autoClaims: 89  },
  { month: 'Jul', propPremiums: 165, propClaims: 121, autoPremiums: 122, autoClaims: 95  },
  { month: 'Aug', propPremiums: 162, propClaims: 98,  autoPremiums: 119, autoClaims: 78  },
  { month: 'Sep', propPremiums: 170, propClaims: 112, autoPremiums: 125, autoClaims: 84  },
  { month: 'Oct', propPremiums: 168, propClaims: 125, autoPremiums: 128, autoClaims: 91  },
  { month: 'Nov', propPremiums: 175, propClaims: 118, autoPremiums: 132, autoClaims: 88  },
  { month: 'Dec', propPremiums: 173, propClaims: 134, autoPremiums: 130, autoClaims: 96  },
];

export const kpiData = {
  gross: {
    totalOwed:          3326000,
    totalClaimed:       2282000,
    autoPremiums:       1399000,
    autoClaims:          973000,
    propertyPremiums:   1927000,
    propertyClaims:     1309000,
  },
  net: {
    totalOwed:          2993400,
    totalClaimed:       2053800,
    autoPremiums:       1259100,
    autoClaims:          875700,
    propertyPremiums:   1734300,
    propertyClaims:     1178100,
  },
};

export const assets = [
  { id: 'VEH-001', name: '2022 Freightliner Cascadia', category: 'Auto',     premiumDue: 2850, dueDate: '2024-02-15', totalClaims: 45200 },
  { id: 'VEH-002', name: '2021 Peterbilt 579',          category: 'Auto',     premiumDue: 2450, dueDate: '2024-02-28', totalClaims: 12800 },
  { id: 'VEH-003', name: '2020 Kenworth T680',           category: 'Auto',     premiumDue: 2200, dueDate: '2024-03-05', totalClaims: 31500 },
  { id: 'VEH-004', name: '2023 Volvo VNL 860',           category: 'Auto',     premiumDue: 2950, dueDate: '2024-02-20', totalClaims:  8200 },
  { id: 'VEH-005', name: '2019 Mack Anthem',             category: 'Auto',     premiumDue: 1980, dueDate: '2024-03-15', totalClaims: 67400 },
  { id: 'PROP-001', name: '123 Maple St Warehouse',      category: 'Property', premiumDue: 4200, dueDate: '2024-02-10', totalClaims: 89500 },
  { id: 'PROP-002', name: '456 Oak Industrial Park',     category: 'Property', premiumDue: 3800, dueDate: '2024-02-25', totalClaims: 24300 },
  { id: 'PROP-003', name: '789 Commerce Blvd Office',    category: 'Property', premiumDue: 2600, dueDate: '2024-03-01', totalClaims: 15700 },
  { id: 'PROP-004', name: '321 Harbor Storage Facility', category: 'Property', premiumDue: 5100, dueDate: '2024-02-18', totalClaims: 42800 },
  { id: 'PROP-005', name: '567 Summit Distribution Ctr', category: 'Property', premiumDue: 3400, dueDate: '2024-03-10', totalClaims: 38100 },
];

export const mockClaimsHistory = {
  'VEH-001': [
    { id: 'CLM-2023-041', date: '2023-08-12', type: 'Collision', status: 'Paid',      amount: 18400 },
    { id: 'CLM-2023-019', date: '2023-03-05', type: 'Cargo Loss', status: 'Paid',     amount: 22700 },
    { id: 'CLM-2022-087', date: '2022-11-18', type: 'Windshield', status: 'Paid',     amount:  4100 },
  ],
  'VEH-005': [
    { id: 'CLM-2024-003', date: '2024-01-22', type: 'Collision',  status: 'In Review', amount: 31200 },
    { id: 'CLM-2023-055', date: '2023-09-14', type: 'Cargo Loss', status: 'Paid',      amount: 24800 },
    { id: 'CLM-2023-011', date: '2023-02-27', type: 'Third Party', status: 'Paid',     amount: 11400 },
  ],
  'PROP-001': [
    { id: 'CLM-2024-001', date: '2024-01-08', type: 'Water Damage',  status: 'In Review', amount: 45000 },
    { id: 'CLM-2023-072', date: '2023-11-30', type: 'Roof Damage',   status: 'Paid',       amount: 28500 },
    { id: 'CLM-2022-093', date: '2022-06-14', type: 'Fire Damage',   status: 'Paid',       amount: 16000 },
  ],
};

export const getAssetClaims = (assetId) =>
  mockClaimsHistory[assetId] || [
    { id: 'CLM-2023-044', date: '2023-07-19', type: 'General', status: 'Paid', amount: 8500 },
    { id: 'CLM-2022-031', date: '2022-12-02', type: 'General', status: 'Paid', amount: 6200 },
  ];

export const formatCurrency = (value, compact = false) => {
  if (compact) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000)    return `$${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(value);
};
