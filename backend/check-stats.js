const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const verifiedPaymentsCount = await prisma.payment.count({ where: { status: 'VERIFIED' } });
  const totalCommissions = await prisma.commission.aggregate({ _sum: { amount: true } });
  const totalPayments = await prisma.payment.aggregate({ 
    where: { status: 'VERIFIED' },
    _sum: { baseAmount: true, penaltyAmount: true } 
  });
  
  console.log('--- DATABASE CHECK ---');
  console.log('Verified Payments Count:', verifiedPaymentsCount);
  console.log('Total Interest (BaseAmount):', totalPayments._sum.baseAmount || 0);
  console.log('Total Late Fees (PenaltyAmount):', totalPayments._sum.penaltyAmount || 0);
  console.log('Total Commissions:', totalCommissions._sum.amount || 0);
}

check().finally(() => prisma.$disconnect());
