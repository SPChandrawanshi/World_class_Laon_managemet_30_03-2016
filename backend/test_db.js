const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const loans = await prisma.loan.findMany({ include: { payments: true, user: true } });
  console.log(JSON.stringify(loans, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
