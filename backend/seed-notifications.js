const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedNotifications() {
  try {
    const agent = await prisma.user.findFirst({
      where: { email: 'agent@lendanet.com' }
    });

    if (!agent) {
      console.log('Agent not found. Please ensure agent@lendanet.com exists.');
      process.exit(1);
    }

    // Seed mock notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: agent.id,
          title: 'System Initialized',
          message: 'Your agent node has successfully connected to the global network registry.',
          type: 'SYSTEM',
          isRead: false
        },
        {
          userId: agent.id,
          title: 'Commission Yield Verified',
          message: 'A yield tier of K500 has been successfully added to your pending layout.',
          type: 'SYSTEM',
          isRead: true
        },
        {
          userId: agent.id,
          title: 'Payout Disbursement Notice',
          message: 'Your payout cycle corresponding to TX-991209 has been approved for Network transfer.',
          type: 'SYSTEM',
          isRead: false
        }
      ]
    });

    console.log(`Successfully seeded notifications for Agent: ${agent.name} (${agent.id})`);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
