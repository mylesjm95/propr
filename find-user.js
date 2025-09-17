import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUser() {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, email: true, name: true }
    });
    
    if (user) {
      console.log('✅ User found for testing:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log('\nTo test the email service, run:');
      console.log(`   node scripts/send-daily-emails.js --test-user ${user.id}`);
    } else {
      console.log('❌ No users found in database');
    }
  } catch (error) {
    console.error('Error finding user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findUser();
