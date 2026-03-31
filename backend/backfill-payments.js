const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  const payments = await prisma.payment.findMany({
    where: { dueDate: null },
    include: { loan: true }
  });

  console.log(`Backfilling ${payments.length} payments...`);

  for (const p of payments) {
    // If loan has a dueDate, use it. Otherwise, use createdAt + 1 month.
    let d = p.loan.dueDate;
    if (!d) {
      d = new Date(p.createdAt);
      d.setMonth(d.getMonth() + 1);
    }
    
    await prisma.payment.update({
      where: { id: p.id },
      data: { dueDate: d }
    });
  }

  console.log('Backfill complete.');
}

backfill().finally(() => prisma.$disconnect());
