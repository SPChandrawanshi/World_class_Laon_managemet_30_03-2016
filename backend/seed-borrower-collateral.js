const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedBorrowerCollateral() {
  try {
    // Find a borrower. We'll use the first one or a known one if possible.
    const borrower = await prisma.user.findFirst({
      where: { role: 'BORROWER' }
    });

    if (!borrower) {
      console.log('No borrower found. Seeding requires at least one user with role BORROWER.');
      process.exit(1);
    }

    console.log(`Found borrower: ${borrower.name} (${borrower.id})`);

    // Seed additional collaterals
    await prisma.collateral.createMany({
      data: [
        {
          userId: borrower.id,
          name: 'TOYOTA COROLLA V5 LOGBOOK',
          type: 'PDF',
          imageUrl: 'https://api.placeholder.com/documents/logbook.pdf',
          verified: true
        },
        {
          userId: borrower.id,
          name: 'ZAMBIAN NRC - FRONT',
          type: 'IMAGE',
          imageUrl: 'https://api.placeholder.com/documents/nrc.jpg',
          verified: false
        },
        {
          userId: borrower.id,
          name: 'LUSAKA PLOT DEED #4410',
          type: 'PDF',
          imageUrl: 'https://api.placeholder.com/documents/deed.pdf',
          verified: true
        }
      ]
    });

    console.log('Successfully seeded 3 additional collateral records for the borrower!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBorrowerCollateral();
