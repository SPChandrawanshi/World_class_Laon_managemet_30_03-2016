const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateReferralCode() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'BORROWER' } });
    if (!user) return console.log('No borrower found');

    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: 'DZ8' + user.id }
    });

    console.log(`Updated referral code for ${user.name} to DZ8${user.id}`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

updateReferralCode();
