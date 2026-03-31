const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedReferrals() {
  try {
    const mainBorrower = await prisma.user.findFirst({ where: { role: 'BORROWER' } });
    if (!mainBorrower) return console.log('No borrower found');

    console.log(`Seeding referrals for: ${mainBorrower.name}`);

    // Create a few referred users
    const usersData = [
      { name: 'Alice Referral', email: `alice_${Date.now()}@example.com`, phone: `097${Math.floor(Math.random()*10000000)}`, password: 'password123', role: 'BORROWER' },
      { name: 'Bob Referral', email: `bob_${Date.now()}@example.com`, phone: `097${Math.floor(Math.random()*10000000)}`, password: 'password123', role: 'BORROWER' },
      { name: 'Charlie Referral', email: `charlie_${Date.now()}@example.com`, phone: `097${Math.floor(Math.random()*10000000)}`, password: 'password123', role: 'BORROWER' }
    ];

    const users = [];
    for (const data of usersData) {
      const u = await prisma.user.create({ data });
      users.push(u);
    }

    // Create referrals
    await prisma.referral.createMany({
      data: [
        { referrerId: mainBorrower.id, referredId: users[0].id, status: 'REWARDED', rewardAmount: 50.00 },
        { referrerId: mainBorrower.id, referredId: users[1].id, status: 'PENDING', rewardAmount: 50.00 },
        { referrerId: mainBorrower.id, referredId: users[2].id, status: 'REWARDED', rewardAmount: 50.00 }
      ]
    });

    console.log('Seeded 3 referrals');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

seedReferrals();
