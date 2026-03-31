const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the first loan (e.g. ID 1)
  const loan = await prisma.loan.findFirst();
  if (!loan) {
    console.log('No loans found to seed payments for.');
    return;
  }

  // Create a pending monthly interest payment placeholder
  const payment = await prisma.payment.create({
    data: {
      loanId: loan.id,
      type: 'MONTHLY_INTEREST',
      baseAmount: (Number(loan.principalAmount) * (Number(loan.interestRate || 10) / 100)),
      penaltyAmount: 0,
      principalPaid: 0,
      totalCollected: (Number(loan.principalAmount) * (Number(loan.interestRate || 10) / 100)),
      status: 'PENDING',
      method: 'MOBILE_MONEY'
    }
  });

  console.log('Successfully seeded a payment placeholder:', payment);
}

main().catch(console.error).finally(() => prisma.$disconnect());
