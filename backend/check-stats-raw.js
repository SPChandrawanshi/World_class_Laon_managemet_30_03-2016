const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const verifiedStats = await prisma.payment.aggregate({
    where: { status: 'VERIFIED' },
    _sum: {
      baseAmount: true,
      penaltyAmount: true,
      principalPaid: true
    },
    _count: { id: true }
  });

  const commStats = await prisma.commission.aggregate({
    _sum: { amount: true }
  });

  console.log('--- RAW AGGREGATE STATS ---');
  console.log('Verified Payments:', JSON.stringify(verifiedStats, null, 2));
  console.log('Commissions:', JSON.stringify(commStats, null, 2));
}

check().finally(() => prisma.$disconnect());
