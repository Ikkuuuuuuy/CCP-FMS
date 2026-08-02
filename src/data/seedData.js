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
// Responsibility Centers
// =============================================================================
export const RESPONSIBILITY_CENTERS = [
  { code: 'OED', name: 'Office of the Executive Director', type: 'Central' },
  { code: 'FD', name: 'Finance Division', type: 'Central' },
  { code: 'HRD', name: 'Human Resource Division', type: 'Central' },
  { code: 'ICTD', name: 'ICT Division', type: 'Central' },
  { code: 'AGD', name: 'Arts Group Division', type: 'Program' },
  { code: 'AED', name: 'Arts Education Division', type: 'Program' },
  { code: 'ICD', name: 'International and Cultural Diplomacy Division', type: 'Program' },
  { code: 'VMD', name: 'Venue Management Division', type: 'Program' },
  { code: 'PPD', name: 'Planning and Policy Division', type: 'Program' },
  { code: 'MSD', name: 'Marketing and Sponsorships Division', type: 'Program' },
  { code: 'CAD', name: 'Communication and Archives Division', type: 'Program' },
  { code: 'GAD-OFF', name: 'GAD Focal Point Office', type: 'Special' },
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
