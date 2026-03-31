const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lendanet.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@lendanet.com',
      phone: '0000000001',
      password,
      role: 'ADMIN',
      isVerified: true,
      isApproved: true,
      status: 'active'
    }
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@lendanet.com' },
    update: {},
    create: {
      name: 'Global Node',
      email: 'staff@lendanet.com',
      phone: '0000000002',
      password,
      role: 'STAFF',
      isVerified: true,
      isApproved: true,
      status: 'active'
    }
  });

  const borrower = await prisma.user.upsert({
    where: { email: 'borrower@lendanet.com' },
    update: {},
    create: {
      name: 'David Zulu',
      email: 'borrower@lendanet.com',
      phone: '0000000003',
      password,
      role: 'BORROWER',
      isVerified: true,
      isApproved: true,
      status: 'active'
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@lendanet.com' },
    update: {},
    create: {
      name: 'Demo Agent',
      email: 'agent@lendanet.com',
      phone: '0000000004',
      password,
      role: 'AGENT',
      isVerified: true,
      isApproved: true,
      status: 'active'
    }
  });

  // Loans
  const existingLoan = await prisma.loan.findFirst({ where: { userId: borrower.id } });
  
  if (!existingLoan) {
    const loan = await prisma.loan.create({
      data: {
          userId: borrower.id,
          principalAmount: 50000,
          currentPrincipal: 50000,
          interestRate: 5,
          initiationFeeRate: 3,
          initiationFee: 1500,
          disbursedAmount: 48500,
          status: 'ACTIVE',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    
    await prisma.loan.create({
      data: {
          userId: borrower.id,
          principalAmount: 15000,
          currentPrincipal: 15000,
          interestRate: 3,
          initiationFeeRate: 2,
          initiationFee: 300,
          disbursedAmount: 14700,
          status: 'PENDING'
      }
    });

    console.log("Created demo loans for John Doe.");
  }

  console.log("\n=======================================================");
  console.log("DATABASE SEEDED SUCCESSFULLY WITH DEMO ACCOUNTS!");
  console.log("=======================================================");
  console.log("Admin:    admin@lendanet.com  / password123");
  console.log("Staff:    staff@lendanet.com  / password123");
  console.log("Agent:    agent@lendanet.com  / password123");
  console.log("Borrower: borrower@lendanet.com / password123");
  console.log("=======================================================\n");

  const settingsItems = [
    { key: 'default_interest', value: '10' },
    { key: 'default_late_fee', value: '2' },
    { key: 'default_agent_percentage', value: '5' },
    { key: 'default_grace_days', value: '3' },
    { key: 'collateral_enabled', value: 'true' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'neural_risk_scoring', value: 'true' },
    { key: 'auto_reminders', value: 'true' },
    { key: 'debug_mode', value: 'false' },
    { key: 'default_threshold', value: '3' }
  ];

  for (const s of settingsItems) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s
    });
  }

  console.log("System settings initialized.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
