// =============================================================================
// Prisma PostgreSQL Seed Script — CCP-FMS
// Populate PostgreSQL with Philippine Government Chart of Accounts & Seed Data
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { MOCK_USERS, MOCK_BURS, MOCK_DVS, CHART_OF_ACCOUNTS, SEED_ALLOTMENTS } from '../src/data/seedData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PostgreSQL Database Seeding for CCP-FMS...');

  // 1. Seed Users
  console.log('👤 Seeding System Users & Roles...');
  for (const user of MOCK_USERS) {
    const roleMapping = {
      'IT/Admin': 'IT_ADMIN',
      'Budget Officer': 'BUDGET_OFFICER',
      'Division Chief': 'DIVISION_CHIEF',
      'Treasury': 'TREASURY',
      'Bookkeeper': 'BOOKKEEPER',
    };

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: roleMapping[user.role] || 'BUDGET_OFFICER',
        department: user.department || 'Financial Services Division',
        status: user.status || 'Active',
      },
    });
  }

  // 2. Seed Chart of Accounts
  console.log('📊 Seeding Philippine Government Chart of Accounts...');
  for (const acc of CHART_OF_ACCOUNTS) {
    await prisma.accountCode.upsert({
      where: { code: acc.code },
      update: {},
      create: {
        code: acc.code,
        name: acc.name,
        category: acc.category || 'EXPENSE',
        description: acc.description || '',
      },
    });
  }

  // 3. Seed Allotments
  console.log('💵 Seeding Fund Cluster Allotments...');
  for (const alt of SEED_ALLOTMENTS) {
    await prisma.allotment.create({
      data: {
        fundCluster: alt.fundCluster,
        mfoPap: alt.mfoPap,
        allotmentClass: alt.allotmentClass,
        accountCode: alt.accountCode,
        totalAllotment: alt.totalAllotment,
        obligated: alt.obligated || 0,
        balance: alt.balance || alt.totalAllotment,
      },
    });
  }

  // 4. Seed Mock BURs
  console.log('📜 Seeding Budget Utilization Requests (BURs)...');
  for (const bur of MOCK_BURS) {
    await prisma.bUR.upsert({
      where: { burNo: bur.burNo },
      update: {},
      create: {
        burNo: bur.burNo,
        fundCluster: bur.fundCluster || '101',
        fundClusterName: bur.fundClusterName || 'REGULAR',
        responsibilityCenter: bur.responsibilityCenter || '08',
        office: bur.office || 'Administrative Services',
        mfoPap: bur.mfoPap || '301000000',
        allotmentClass: bur.allotmentClass || 'MOOE',
        accountCode: bur.accountCode || '5021202000',
        amount: bur.amount,
        payeeName: bur.payeeName || bur.payee || 'CCP Vendor',
        payeeTIN: bur.payeeTIN || '000-000-000-000',
        address: bur.address || 'Pasay City',
        modeOfPayment: bur.modeOfPayment || 'Check',
        particulars: bur.particulars || 'Budget Utilization Request',
        status: bur.status === 'OBLIGATED' ? 'OBLIGATED' : 'PREPARED',
        certifiedByName: 'KAYE C. TINGA',
        approvedByName: 'LOURDES S. MENDOZA',
      },
    });
  }

  console.log('✅ PostgreSQL Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
