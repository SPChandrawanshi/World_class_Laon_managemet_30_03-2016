const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const agent = await prisma.user.findFirst({
      where: { email: 'agent@lendanet.com' }
    });

    if (!agent) {
      console.log('Agent not found. Seeding requires agent@lendanet.com');
      process.exit(1);
    }

    console.log(`Found agent: ${agent.name} (${agent.id})`);

    let borrower = await prisma.user.findFirst({
      where: { role: 'BORROWER' }
    });

    if (!borrower) {
        borrower = await prisma.user.create({
            data: {
                name: "Mock Borrower",
                email: "mockborrower@lendanet.com",
                phone: "0999999999",
                password: "mock",
                role: "BORROWER"
            }
        });
    }

    let loan = await prisma.loan.findFirst({
      where: { agentId: agent.id }
    });

    if (!loan) {
        loan = await prisma.loan.create({
            data: {
                userId: borrower.id,
                agentId: agent.id,
                principalAmount: 10000,
                currentPrincipal: 10000,
                initiationFeeRate: 2,
                initiationFee: 200,
                disbursedAmount: 9800,
                interestRate: 5,
                status: 'ACTIVE'
            }
        });
    }

    // Seed Commissions
    await prisma.commission.createMany({
      data: [
        {
          agentId: agent.id,
          borrowerId: borrower.id,
          loanId: loan.id,
          amount: 500,
          percentage: 5.00,
          status: 'PENDING'
        },
        {
          agentId: agent.id,
          borrowerId: borrower.id,
          loanId: loan.id,
          amount: 250,
          percentage: 5.00,
          status: 'PAID'
        },
        {
          agentId: agent.id,
          borrowerId: borrower.id,
          loanId: loan.id,
          amount: 800,
          percentage: 5.00,
          status: 'PENDING'
        }
      ]
    });

    // Seed Payouts
    await prisma.payout.createMany({
        data: [
            {
                agentId: agent.id,
                amount: 1500,
                status: 'COMPLETED',
                method: 'BANK_TRANSFER',
                trxId: 'TRX-' + Date.now(),
                processedAt: new Date()
            },
            {
                agentId: agent.id,
                amount: 500,
                status: 'PENDING',
                method: 'NETWORK'
            }
        ]
    });

    console.log('Successfully seeded mock yield data for Agent!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
