const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { role: 'BORROWER' } });
  if (!user) {
    console.log('No borrower found to seed collateral for.');
    return;
  }
  const collateral = await prisma.collateral.create({
    data: {
      userId: user.id,
      imageUrl: 'https://api.placeholder.com/documents/logbook_sample.png',
      verified: true
    }
  });
  console.log('Successfully seeded a collateral record:', collateral);
}
main().catch(console.error).finally(() => prisma.$disconnect());
