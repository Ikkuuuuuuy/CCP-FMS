// =============================================================================
// CCP FMS — Seed Data
// Philippine Government Accounting Chart of Accounts + CCP-specific MFO/PAP Codes
// =============================================================================

export const CHART_OF_ACCOUNTS = [
  // ASSETS
  { code: '1-01-01', name: 'Cash - MDS, Regular', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-01-02', name: 'Cash - MDS, Special Account', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-01-04', name: 'Petty Cash Fund', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-06-01', name: 'Accounts Receivable', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-06-05', name: 'Advances to Officers and Employees', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-07-01', name: 'Office Supplies Inventory', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-07-05', name: 'Semi-Expendable - ICT Equipment', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-04-04', name: 'Due from NGAs', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-12-01', name: 'Office Equipment', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-12-05', name: 'ICT Equipment and Software', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-12-09', name: 'Furniture and Fixtures', type: 'ASSET', normal: 'DEBIT' },
  { code: '1-12-03', name: 'Motor Vehicles', type: 'ASSET', normal: 'DEBIT' },
  // LIABILITIES
  { code: '2-01-01', name: 'Accounts Payable', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-01-02', name: 'Due to Officers and Employees', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-02-03', name: 'Due to BIR (Tax Withholding)', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-02-01', name: 'Due to GSIS', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-02-02', name: 'Due to PhilHealth', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-02-04', name: 'Due to Pag-IBIG', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2-05-01', name: 'Performance/Bidders Bond Payable', type: 'LIABILITY', normal: 'CREDIT' },
  // EQUITY
  { code: '3-01-01', name: 'Accumulated Surplus/(Deficit)', type: 'EQUITY', normal: 'CREDIT' },
  { code: '3-04-01', name: 'Subsidy from National Government', type: 'EQUITY', normal: 'CREDIT' },
  // REVENUE
  { code: '4-01-01', name: 'Subsidy from National Government', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4-02-01', name: 'Income from Cultural Performances', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4-02-02', name: 'Rental Income - CCP Complex', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4-02-03', name: 'Income from Grants and Donations', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4-02-04', name: 'Registration Fees - Arts Programs', type: 'REVENUE', normal: 'CREDIT' },
  // EXPENSES
  { code: '5-01-01', name: 'Salaries and Wages - Regular', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-02', name: 'Salaries and Wages - Contractual', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-05', name: 'PERA', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-06', name: 'Representation Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-07', name: 'Transportation Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-11', name: 'Clothing/Uniform Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-13', name: 'Subsistence Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-14', name: 'Laundry Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-01-10', name: 'Personnel Economic Relief Allowance', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-01', name: 'Traveling Expenses - Local', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-02', name: 'Traveling Expenses - Foreign', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-03', name: 'Training and Scholarship Expenses', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-04', name: 'Supplies and Materials Expenses', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-05', name: 'Utility Expenses - Water', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-06', name: 'Utility Expenses - Electricity', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-07', name: 'Communication Expenses', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-08', name: 'Confidential and Intelligence Expenses', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-09', name: 'Professional Services', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-10', name: 'General Services', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-11', name: 'Repairs and Maintenance - Bldg. & Struct.', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-12', name: 'Repairs and Maintenance - Machinery & Eq.', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-13', name: 'Financial Assistance/Subsidy', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-14', name: 'Taxes, Insurance Premiums and Others', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-02-99', name: 'Other MOOE', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-06-01', name: 'Depreciation - Office Equipment', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-06-05', name: 'Depreciation - ICT Equipment', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5-06-09', name: 'Depreciation - Furniture and Fixtures', type: 'EXPENSE', normal: 'DEBIT' },
];

// =============================================================================
// CCP Fund Clusters
// =============================================================================
export const FUND_CLUSTERS = [
  { code: '101', name: 'Regular Agency Fund (General Fund)', shortName: 'Regular Fund' },
  { code: '151', name: 'Special Account in the General Fund (SAGF)', shortName: 'Special Account' },
  { code: '104', name: 'Trust Receipts Fund', shortName: 'Trust Fund' },
];

// =============================================================================
// CCP Allotment Classes
// =============================================================================
export const ALLOTMENT_CLASSES = [
  { code: 'PS', name: 'Personal Services', color: '#2563EB' },
  { code: 'MOOE', name: 'Maintenance and Other Operating Expenses', color: '#059669' },
  { code: 'CO', name: 'Capital Outlay', color: '#D97706' },
  { code: 'FE', name: 'Financial Expenses', color: '#7C3AED' },
];

// =============================================================================
// CCP MFO/PAP Codes (FY 2026 GAA-based)
// =============================================================================
export const MFO_PAP_CODES = [
  // Major Final Outputs (MFOs)
  { code: 'MFO-1', name: 'Production and Presentation of Arts and Culture Programs', type: 'MFO' },
  { code: 'MFO-2', name: 'Arts Education and Development Programs', type: 'MFO' },
  { code: 'MFO-3', name: 'Cultural Exchange and International Programs', type: 'MFO' },
  { code: 'MFO-4', name: 'Venue and Facility Management Services', type: 'MFO' },
  // Programs, Activities, Projects (PAPs)
  { code: 'PAP-1.1', name: 'CCP Resident Companies Support (BPO, BPF, Tanghalang Pilipino, etc.)', type: 'PAP', parent: 'MFO-1' },
  { code: 'PAP-1.2', name: 'National Arts Festivals and Special Events', type: 'PAP', parent: 'MFO-1' },
  { code: 'PAP-1.3', name: 'Film, Television, and New Media Programs', type: 'PAP', parent: 'MFO-1' },
  { code: 'PAP-2.1', name: 'CCP Open University and Formal Arts Education', type: 'PAP', parent: 'MFO-2' },
  { code: 'PAP-2.2', name: 'Artists Residency and Fellowship Programs', type: 'PAP', parent: 'MFO-2' },
  { code: 'PAP-2.3', name: 'Outreach and Community Arts Programs', type: 'PAP', parent: 'MFO-2' },
  { code: 'PAP-3.1', name: 'International Cultural Exchange Agreements', type: 'PAP', parent: 'MFO-3' },
  { code: 'PAP-3.2', name: 'ASEAN Cultural Diplomacy Initiatives', type: 'PAP', parent: 'MFO-3' },
  { code: 'PAP-4.1', name: 'Main Theater and Venue Operations', type: 'PAP', parent: 'MFO-4' },
  { code: 'PAP-4.2', name: 'CCP Complex Infrastructure Maintenance', type: 'PAP', parent: 'MFO-4' },
  // General Administration
  { code: 'GAD', name: 'General Administration and Support', type: 'GAD' },
  { code: 'GAD-HR', name: 'Human Resource Development Program', type: 'GAD' },
  { code: 'GAD-ICT', name: 'ICT Systems and Digital Transformation', type: 'GAD' },
];

// =============================================================================
// Official CCP Offices & Departments
// =============================================================================
export const CCP_OFFICES = [
  { code: 'OP', name: 'Office of the President', shortName: 'Office of the President' },
  { code: 'OVP', name: 'Office of the Vice President', shortName: 'Office of the Vice President' },
  { code: 'OAD', name: 'Office of the Artistic Director', shortName: 'Office of the Artistic Director' },
  { code: 'FSD', name: 'Financial Services Department', shortName: 'Financial Services Department' },
  { code: 'ASD', name: 'Administrative Services Department', shortName: 'Administrative Services Department' },
  { code: 'CAD', name: 'Corporate Affairs Department', shortName: 'Corporate Affairs Department' },
  { code: 'MD', name: 'Marketing Department', shortName: 'Marketing Department' },
  { code: 'PED', name: 'Production and Exhibition Department', shortName: 'Production and Exhibition Department' },
  { code: 'AED', name: 'Arts Education Department', shortName: 'Arts Education Department' },
  { code: 'CED', name: 'Cultural Exchange Department', shortName: 'Cultural Exchange Department' },
  { code: 'CCD', name: 'Cultural Content Department', shortName: 'Cultural Content Department' },
];

// =============================================================================
// Responsibility Centers
// =============================================================================
export const RESPONSIBILITY_CENTERS = [
  { code: 'OP', name: 'Office of the President', type: 'Executive' },
  { code: 'OVP', name: 'Office of the Vice President', type: 'Executive' },
  { code: 'OAD', name: 'Office of the Artistic Director', type: 'Executive' },
  { code: 'FSD', name: 'Financial Services Department', type: 'Central' },
  { code: 'ASD', name: 'Administrative Services Department', type: 'Central' },
  { code: 'CAD', name: 'Corporate Affairs Department', type: 'Central' },
  { code: 'MD', name: 'Marketing Department', type: 'Program' },
  { code: 'PED', name: 'Production and Exhibition Department', type: 'Program' },
  { code: 'AED', name: 'Arts Education Department', type: 'Program' },
  { code: 'CED', name: 'Cultural Exchange Department', type: 'Program' },
  { code: 'CCD', name: 'Cultural Content Department', type: 'Program' },
];

// =============================================================================
// Seed Allotment Balances (FY 2026 — Realistic CCP GAA amounts in PHP)
// =============================================================================
export const SEED_ALLOTMENTS = {
  '101': {
    PS:   { total: 285_000_000, obligated: 0, disbursed: 0 },
    MOOE: { total:  98_500_000, obligated: 0, disbursed: 0 },
    CO:   { total:  22_000_000, obligated: 0, disbursed: 0 },
    FE:   { total:     500_000, obligated: 0, disbursed: 0 },
  },
  '151': {
    PS:   { total:  12_000_000, obligated: 0, disbursed: 0 },
    MOOE: { total:  45_000_000, obligated: 0, disbursed: 0 },
    CO:   { total:   8_000_000, obligated: 0, disbursed: 0 },
    FE:   { total:     200_000, obligated: 0, disbursed: 0 },
  },
  '104': {
    PS:   { total:   5_000_000, obligated: 0, disbursed: 0 },
    MOOE: { total:  18_000_000, obligated: 0, disbursed: 0 },
    CO:   { total:   3_500_000, obligated: 0, disbursed: 0 },
    FE:   { total:     100_000, obligated: 0, disbursed: 0 },
  },
};

// =============================================================================
// Mock Users with Roles
// =============================================================================
export const MOCK_USERS = [
  {
    id: 'user-000',
    name: 'Jose Reyes',
    email: 'jose.reyes@ccp.gov.ph',
    role: 'IT/ADMIN',
    roleLabel: 'IT/ADMIN',
    division: 'OED',
    avatar: 'JR',
    permissions: ['all'],
  },
  {
    id: 'user-001',
    name: 'Maria Santos',
    email: 'maria.santos@ccp.gov.ph',
    role: 'Budget Officer',
    roleLabel: 'Budget Officer',
    division: 'FD',
    avatar: 'MS',
    permissions: ['bur.create', 'bur.view', 'bur.edit', 'dv.view', 'ledger.view'],
  },
  {
    id: 'user-002',
    name: 'Ana Cruz',
    email: 'ana.cruz@ccp.gov.ph',
    role: 'Division Chief',
    roleLabel: 'Division Chief',
    division: 'OED',
    avatar: 'AC',
    permissions: ['bur.view', 'bur.approve', 'dv.view', 'dv.approve', 'ledger.view', 'audit.view', 'dashboard.view'],
  },
  {
    id: 'user-003',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@ccp.gov.ph',
    role: 'Bookkeeper',
    roleLabel: 'Bookkeeper',
    division: 'FD',
    avatar: 'JD',
    permissions: ['logs.view'],
  },
  {
    id: 'user-004',
    name: 'Ricardo Lim',
    email: 'ricardo.lim@ccp.gov.ph',
    role: 'Treasury',
    roleLabel: 'Treasury',
    division: 'FD',
    avatar: 'RL',
    permissions: ['dv.edit', 'dv.view', 'dv.create'],
  },
];

// =============================================================================
// Mock BURs (Budget Utilization Requests)
// =============================================================================
export const MOCK_BURS = [
  {
    id: 'bur-001',
    burNo: '26-08-0001',
    createdAt: '2026-08-01T09:15:00.000Z',
    fundCluster: '101',
    fundClusterName: 'REGULAR',
    responsibilityCenter: 'PED',
    office: 'Production and Exhibition Department',
    mfoPap: 'PAP-1.1',
    allotmentClass: 'MOOE',
    accountCode: '5-02-99',
    amount: 1250000.00,
    payeeName: 'LSERV Corporation',
    payeeTIN: '123-456-789-000',
    address: 'CCP Complex, Roxas Blvd, Pasay City',
    modeOfPayment: 'Check',
    particulars: 'Philippine Philharmonic Orchestra Concert Stage Setup & Sound Engineering',
    purpose: 'Production setup for CCP 2026 Main Concert Series',
    status: 'OBLIGATED',
    assignedTo: 'user-001',
    assignedToName: 'Maria Santos',
    certifiedByName: 'KAYE C. TINGA',
    approvedByName: 'LOURDES S. MENDOZA',
    history: [{ status: 'OBLIGATED', actor: 'KAYE C. TINGA', timestamp: '2026-08-01T09:15:00.000Z', note: 'Initial obligation' }],
  },
  {
    id: 'bur-002',
    burNo: '26-08-0002',
    createdAt: '2026-08-01T11:30:00.000Z',
    fundCluster: '101',
    fundClusterName: 'REGULAR',
    responsibilityCenter: 'ASD',
    office: 'Administrative Services Department',
    mfoPap: 'PAP-4.2',
    allotmentClass: 'MOOE',
    accountCode: '5-02-11',
    amount: 485000.00,
    payeeName: 'MERALCO Industrial Engineering Services',
    payeeTIN: '987-654-321-000',
    address: 'Meralco Compound, Ortigas Ave, Pasig City',
    modeOfPayment: 'Check',
    particulars: 'Tanghalang Nicanor Abelardo Theater Air Conditioning & Chiller Maintenance',
    purpose: 'Quarterly preventative maintenance for Main Theater HVAC system',
    status: 'FOR_APPROVAL_OP',
    assignedTo: 'user-002',
    assignedToName: 'Ana Cruz',
    certifiedByName: 'KAYE C. TINGA',
    approvedByName: 'LOURDES S. MENDOZA',
    history: [{ status: 'FOR_APPROVAL_OP', actor: 'KAYE C. TINGA', timestamp: '2026-08-01T11:30:00.000Z', note: 'Forwarded for OP approval' }],
  },
  {
    id: 'bur-003',
    burNo: '26-08-0003',
    createdAt: '2026-08-02T08:20:00.000Z',
    fundCluster: '151',
    fundClusterName: 'SPECIAL',
    responsibilityCenter: 'MD',
    office: 'Marketing Department',
    mfoPap: 'PAP-1.2',
    allotmentClass: 'MOOE',
    accountCode: '5-02-04',
    amount: 650000.00,
    payeeName: 'MediaPro Philippines Inc.',
    payeeTIN: '456-789-123-000',
    address: 'Makati Avenue, Makati City',
    modeOfPayment: 'Check',
    particulars: 'Pasinaya 2026 Open House Festival National Arts Promotion & Media Campaign',
    purpose: 'National promotion and printing of Pasinaya 2026 festival guidebooks',
    status: 'FORWARDED_TO_TREASURY',
    assignedTo: 'user-004',
    assignedToName: 'Ricardo Lim',
    certifiedByName: 'KAYE C. TINGA',
    approvedByName: 'LOURDES S. MENDOZA',
    history: [{ status: 'FORWARDED_TO_TREASURY', actor: 'KAYE C. TINGA', timestamp: '2026-08-02T08:20:00.000Z', note: 'Forwarded to Treasury' }],
  },
  {
    id: 'bur-004',
    burNo: '26-08-0004',
    createdAt: '2026-08-02T09:40:00.000Z',
    fundCluster: '104',
    fundClusterName: 'TRUST',
    responsibilityCenter: 'ASD',
    office: 'Administrative Services Department',
    mfoPap: 'PAP-4.2',
    allotmentClass: 'CO',
    accountCode: '1-12-05',
    amount: 320000.00,
    payeeName: 'Security & Protection Solutions Corp',
    payeeTIN: '789-123-456-000',
    address: 'Quezon Avenue, Quezon City',
    modeOfPayment: 'Check',
    particulars: 'National Arts Center Makiling Facility Upgrades & Security Installations',
    purpose: 'CCTV installation and access control system for NAC Makiling residency campus',
    status: 'PREPARED',
    assignedTo: 'user-001',
    assignedToName: 'Maria Santos',
    certifiedByName: 'KAYE C. TINGA',
    approvedByName: 'LOURDES S. MENDOZA',
    history: [{ status: 'PREPARED', actor: 'KAYE C. TINGA', timestamp: '2026-08-02T09:40:00.000Z', note: 'BUR Prepared' }],
  },
  {
    id: 'bur-005',
    burNo: '26-08-0005',
    createdAt: '2026-08-02T10:15:00.000Z',
    fundCluster: '101',
    fundClusterName: 'REGULAR',
    responsibilityCenter: 'PED',
    office: 'Production and Exhibition Department',
    mfoPap: 'PAP-1.1',
    allotmentClass: 'MOOE',
    accountCode: '5-02-99',
    amount: 188203.13,
    payeeName: 'StageCraft Lighting Systems Inc.',
    payeeTIN: '321-654-987-000',
    address: 'Mandaluyong City, Metro Manila',
    modeOfPayment: 'Check',
    particulars: 'CCP Virgin Labfest Theater Festival Lighting & Production Expenses',
    purpose: 'Professional theatrical lighting equipment rental for Virgin Labfest 2026',
    status: 'APPROVED',
    assignedTo: 'user-003',
    assignedToName: 'Juan Dela Cruz',
    certifiedByName: 'KAYE C. TINGA',
    approvedByName: 'LOURDES S. MENDOZA',
    history: [{ status: 'APPROVED', actor: 'KAYE C. TINGA', timestamp: '2026-08-02T10:15:00.000Z', note: 'Approved' }],
  }
];

// =============================================================================
// Mock DVs (Disbursement Vouchers)
// =============================================================================
export const MOCK_DVS = [
  {
    id: 'dv-001',
    dvNo: '08-0001-26',
    createdAt: '2026-08-01T10:00:00.000Z',
    burId: 'bur-001',
    burRef: '26-08-0001',
    modeOfPayment: 'Check',
    payeeName: 'LSERV Corporation',
    payeeTIN: '123-456-789-000',
    address: 'CCP Complex, Roxas Blvd, Pasay City',
    department: 'Arts Group Department',
    expenseAccountCode: '5-02-99',
    description: 'Payment for Philippine Philharmonic Orchestra Concert Stage Setup & Sound Engineering',
    grossClaim: 1250000.00,
    totalDeductions: 87500.00,
    finalVat: 62500.00,
    ewt: 25000.00,
    netAmount: 1162500.00,
    status: 'PAID',
    assignedTo: 'user-004',
    assignedToName: 'Ricardo Lim',
    checkNo: 'CHK-2026-88102',
    checkDate: '2026-08-01',
    bankName: 'LANDBANK',
    jevNo: 'JEV-2026-08-001',
    certifiedByName: 'LOURDES S. MENDOZA',
    approvedByName: 'KAYE C. TINGA',
    history: [{ status: 'PAID', actor: 'System', timestamp: '2026-08-01T10:00:00.000Z', note: 'Stamped PAID' }],
  },
  {
    id: 'dv-002',
    dvNo: '08-0002-26',
    createdAt: '2026-08-01T14:30:00.000Z',
    burId: 'bur-002',
    burRef: '26-08-0002',
    modeOfPayment: 'Check',
    payeeName: 'MERALCO Industrial Engineering Services',
    payeeTIN: '987-654-321-000',
    address: 'Meralco Compound, Ortigas Ave, Pasig City',
    department: 'Administrative Services Department',
    expenseAccountCode: '5-02-11',
    description: 'Payment for Tanghalang Nicanor Abelardo Theater Air Conditioning & Chiller Maintenance',
    grossClaim: 485000.00,
    totalDeductions: 33950.00,
    finalVat: 24250.00,
    ewt: 9700.00,
    netAmount: 451050.00,
    status: 'FOR_RELEASE',
    assignedTo: 'user-004',
    assignedToName: 'Ricardo Lim',
    certifiedByName: 'LOURDES S. MENDOZA',
    approvedByName: 'KAYE C. TINGA',
    history: [{ status: 'FOR_RELEASE', actor: 'System', timestamp: '2026-08-01T14:30:00.000Z', note: 'Marked for Release' }],
  },
  {
    id: 'dv-003',
    dvNo: '08-0003-26',
    createdAt: '2026-08-02T11:00:00.000Z',
    burId: 'bur-005',
    burRef: '26-08-0005',
    modeOfPayment: 'Check',
    payeeName: 'StageCraft Lighting Systems Inc.',
    payeeTIN: '321-654-987-000',
    address: 'Mandaluyong City, Metro Manila',
    department: 'Production and Exhibition Department',
    expenseAccountCode: '5-02-99',
    description: 'Payment for CCP Virgin Labfest Theater Festival Lighting & Production Expenses',
    grossClaim: 188203.13,
    totalDeductions: 13174.22,
    finalVat: 9410.16,
    ewt: 3764.06,
    netAmount: 175028.91,
    status: 'FOR_CHECK_PREPARATION',
    assignedTo: 'user-003',
    assignedToName: 'Juan Dela Cruz',
    bankName: 'LANDBANK',
    certifiedByName: 'LOURDES S. MENDOZA',
    approvedByName: 'KAYE C. TINGA',
    history: [{ status: 'FOR_CHECK_PREPARATION', actor: 'System', timestamp: '2026-08-02T11:00:00.000Z', note: 'Check Preparation' }],
  },
  {
    id: 'dv-004',
    dvNo: '08-0004-26',
    createdAt: '2026-08-02T13:15:00.000Z',
    burId: 'bur-003',
    burRef: '26-08-0003',
    modeOfPayment: 'Check',
    payeeName: 'MediaPro Philippines Inc.',
    payeeTIN: '456-789-123-000',
    address: 'Makati Avenue, Makati City',
    department: 'Marketing Department',
    expenseAccountCode: '5-02-04',
    description: 'Payment for Pasinaya 2026 Open House Festival National Arts Promotion & Media Campaign',
    grossClaim: 650000.00,
    totalDeductions: 45500.00,
    finalVat: 32500.00,
    ewt: 13000.00,
    netAmount: 604500.00,
    status: 'APPROVED_FOR_PAYMENT',
    assignedTo: 'user-001',
    assignedToName: 'Maria Santos',
    certifiedByName: 'LOURDES S. MENDOZA',
    approvedByName: 'KAYE C. TINGA',
    history: [{ status: 'APPROVED_FOR_PAYMENT', actor: 'System', timestamp: '2026-08-02T13:15:00.000Z', note: 'Approved for Payment' }],
  }
];

// =============================================================================
// Mock Journal Entries (General & Subsidiary Ledgers)
// =============================================================================
export const MOCK_JOURNAL_ENTRIES = [
  {
    je_id: 'JE-2026-08-001',
    date: '2026-08-01',
    particulars: 'Payment of Stage Setup & Sound Engineering to LSERV Corporation (DV-08-0001-26)',
    status: 'POSTED',
    lines: [
      { account_code: '5-02-99', account_name: 'Other MOOE', debit: 1250000.00, credit: 0 },
      { account_code: '2-02-03', account_name: 'Due to BIR (Tax Withholding)', debit: 0, credit: 87500.00 },
      { account_code: '1-01-01', account_name: 'Cash - MDS, Regular', debit: 0, credit: 1162500.00 }
    ]
  },
  {
    je_id: 'JE-2026-08-002',
    date: '2026-08-01',
    particulars: 'Payment of Chiller Maintenance to MERALCO Industrial Services (DV-08-0002-26)',
    status: 'POSTED',
    lines: [
      { account_code: '5-02-11', account_name: 'Repairs and Maintenance - Bldg. & Struct.', debit: 485000.00, credit: 0 },
      { account_code: '2-02-03', account_name: 'Due to BIR (Tax Withholding)', debit: 0, credit: 33950.00 },
      { account_code: '1-01-01', account_name: 'Cash - MDS, Regular', debit: 0, credit: 451050.00 }
    ]
  },
  {
    je_id: 'JE-2026-08-003',
    date: '2026-08-02',
    particulars: 'Payment of Monthly Optical Fiber Internet Service to PLDT Communications',
    status: 'POSTED',
    lines: [
      { account_code: '5-02-07', account_name: 'Communication Expenses', debit: 85000.00, credit: 0 },
      { account_code: '1-01-01', account_name: 'Cash - MDS, Regular', debit: 0, credit: 85000.00 }
    ]
  }
];

// =============================================================================
// Mock System Audit Activity Logs (COA-Compliant Security Audit Trail)
// =============================================================================
export const MOCK_AUDIT_LOGS = [
  {
    log_id: 'LOG-2026-0001',
    timestamp: '2026-08-01T08:30:00.000Z',
    actor_id: 'user-001',
    actor_name: 'Kaye C. Tinga (Budget Officer)',
    module: 'BUR',
    action_type: 'CREATE',
    document_ref: '26-08-0001',
    payload_delta: { old: null, new: { status: 'PENDING_CERTIFICATION', payeeName: 'LSERV Corporation', amount: 1250000.00 } }
  },
  {
    log_id: 'LOG-2026-0002',
    timestamp: '2026-08-01T09:15:00.000Z',
    actor_id: 'user-002',
    actor_name: 'Lourdes S. Mendoza (Chief Accountant)',
    module: 'BUR',
    action_type: 'CERTIFY',
    document_ref: '26-08-0001',
    payload_delta: { old: { status: 'PENDING_CERTIFICATION' }, new: { status: 'OBLIGATED', certifiedByName: 'KAYE C. TINGA' } }
  },
  {
    log_id: 'LOG-2026-0003',
    timestamp: '2026-08-01T10:00:00.000Z',
    actor_id: 'user-004',
    actor_name: 'Ricardo Lim (Treasury)',
    module: 'DV',
    action_type: 'CREATE',
    document_ref: 'DV-08-0001-26',
    payload_delta: { old: null, new: { burRef: '26-08-0001', grossClaim: 1250000.00, status: 'PREPARED' } }
  },
  {
    log_id: 'LOG-2026-0004',
    timestamp: '2026-08-01T11:45:00.000Z',
    actor_id: 'user-002',
    actor_name: 'Lourdes S. Mendoza (Chief Accountant)',
    module: 'DV',
    action_type: 'PAID',
    document_ref: 'DV-08-0001-26',
    payload_delta: { old: { status: 'PREPARED' }, new: { status: 'PAID', netAmount: 1162500.00 } }
  },
  {
    log_id: 'LOG-2026-0005',
    timestamp: '2026-08-01T13:20:00.000Z',
    actor_id: 'user-003',
    actor_name: 'Juan Dela Cruz (Bookkeeper)',
    module: 'LEDGER',
    action_type: 'POST',
    document_ref: 'JE-2026-08-001',
    payload_delta: { old: { status: 'UNPOSTED' }, new: { status: 'POSTED', debitTotal: 1250000.00, creditTotal: 1250000.00 } }
  },
  {
    log_id: 'LOG-2026-0006',
    timestamp: '2026-08-02T09:10:00.000Z',
    actor_id: 'user-001',
    actor_name: 'Kaye C. Tinga (Budget Officer)',
    module: 'BUR',
    action_type: 'CREATE',
    document_ref: '26-08-0002',
    payload_delta: { old: null, new: { status: 'PENDING_CERTIFICATION', payeeName: 'MERALCO Industrial Services', amount: 485000.00 } }
  },
  {
    log_id: 'LOG-2026-0007',
    timestamp: '2026-08-02T10:30:00.000Z',
    actor_id: 'user-002',
    actor_name: 'Lourdes S. Mendoza (Chief Accountant)',
    module: 'BUR',
    action_type: 'CERTIFY',
    document_ref: '26-08-0002',
    payload_delta: { old: { status: 'PENDING_CERTIFICATION' }, new: { status: 'OBLIGATED' } }
  },
  {
    log_id: 'LOG-2026-0008',
    timestamp: '2026-08-02T14:15:00.000Z',
    actor_id: 'user-004',
    actor_name: 'Ricardo Lim (Treasury)',
    module: 'DV',
    action_type: 'PAID',
    document_ref: 'DV-08-0002-26',
    payload_delta: { old: { status: 'PENDING_ACCOUNTING' }, new: { status: 'PAID', netAmount: 451050.00 } }
  },
  {
    log_id: 'LOG-2026-0009',
    timestamp: '2026-08-03T08:05:00.000Z',
    actor_id: 'user-003',
    actor_name: 'Juan Dela Cruz (Bookkeeper)',
    module: 'LEDGER',
    action_type: 'POST',
    document_ref: 'JE-2026-08-002',
    payload_delta: { old: { status: 'UNPOSTED' }, new: { status: 'POSTED' } }
  }
];

