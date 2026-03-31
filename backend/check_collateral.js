const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const collaterals = await prisma.collateral.findMany({ include: { user: true } });
  console.log(JSON.stringify(collaterals, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
