const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const analyticsService = require('./src/services/analytics.service');
    const user = { id: 1, role: 'ADMIN' };
    const stats = await analyticsService.getDashboardStats(user);
    console.log('--- STATS SUCCESS ---');
    console.log(JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error('--- STATS ERROR ---');
    console.error(err.message || err);
    if (err.stack) console.error(err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

check();
