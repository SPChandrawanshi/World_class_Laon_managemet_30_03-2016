const axios = require('axios');

async function testApi() {
  try {
    // Assuming we have a way to get a token or the user is already logged in
    // For local testing without real auth, we'll bypass or simulate
    // But since I can't easily get a token here, I'll just check the service directly again with better logging
    console.log("Calling analytics service directly...");
    const analyticsService = require('./src/services/analytics.service');
    const stats = await analyticsService.getDashboardStats({ id: 1, role: 'ADMIN' });
    console.log("Stats Response:", JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testApi();
