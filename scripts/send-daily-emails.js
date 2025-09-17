#!/usr/bin/env node

/**
 * Daily Property Update Email Script
 * 
 * This script fetches property updates from AMPRE API and sends daily emails
 * to users with saved searches. It can be run manually or by GitHub Actions.
 * 
 * Usage:
 *   node scripts/send-daily-emails.js
 *   node scripts/send-daily-emails.js --test-user <userId>
 */

import { sendDailyEmailsToAllUsers, testDailyEmail } from '../src/lib/emailService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting Daily Property Update Email Process...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    // Check if this is a test run for a specific user
    const args = process.argv.slice(2);
    const testUserIndex = args.indexOf('--test-user');
    
    if (testUserIndex !== -1 && args[testUserIndex + 1]) {
      const testUserId = args[testUserIndex + 1];
      console.log(`🧪 Testing email for user: ${testUserId}`);
      
      const result = await testDailyEmail(testUserId);
      console.log('✅ Test email result:', result);
      
    } else {
      // Regular daily email run
      console.log('📧 Sending daily emails to all users...');
      
      const result = await sendDailyEmailsToAllUsers();
      console.log('✅ Daily email process completed successfully!');
      console.log('📊 Results:', result);
    }
    
  } catch (error) {
    console.error('❌ Error in daily email process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
    console.log(`⏰ Completed at: ${new Date().toISOString()}`);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main();
