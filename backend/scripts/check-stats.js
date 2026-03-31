const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const [
    totalUsers,
    totalLoans,
    pendingLoans,
    activeLoans,
    overdueLoans,
    totalPrincipal,
    pendingPayments
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'BORROWER' } }),
    prisma.loan.count(),
    prisma.loan.count({ where: { status: 'PENDING' } }),
    prisma.loan.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.count({ where: { status: 'LATE' } }),
    prisma.loan.aggregate({ _sum: { principalAmount: true } }),
    prisma.payment.count({ where: { status: 'PENDING' } })
  ]);

  console.log('--- DATABASE STATS ---');
  console.log('Total Users:', totalUsers);
  console.log('Total Loans:', totalLoans);
  console.log('Pending Loans:', pendingLoans);
  console.log('Active Loans:', activeLoans);
  console.log('Overdue Loans (Payments):', overdueLoans);
  console.log('Total Principal (Sum):', totalPrincipal?._sum?.principalAmount);
  console.log('Pending Payments:', pendingPayments);
  
  const loans = await prisma.loan.findMany({ 
    take: 5, 
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('\n--- RECENT LOANS ---');
  loans.forEach(l => {
    console.log(`ID: ${l.id}, User: ${l.user?.name}, Status: ${l.status}, Amount: ${l.principalAmount}`);
  });

  process.exit();
}
check();
