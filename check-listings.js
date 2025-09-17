import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkListings() {
  try {
    // Check all listings
    const allListings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('📊 Recent Listings:');
    allListings.forEach(listing => {
      const date = new Date(listing.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      console.log(`  🏠 ${listing.title} - Created: ${date.toLocaleDateString()} (${diffDays} days ago)`);
    });
    
    // Check if any are from yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayListings = await prisma.listing.findMany({
      where: {
        createdAt: {
          gte: yesterday
        }
      }
    });
    
    console.log(`\n📅 Listings from yesterday: ${yesterdayListings.length}`);
    
    if (yesterdayListings.length > 0) {
      console.log('These should trigger daily emails:');
      yesterdayListings.forEach(listing => {
        console.log(`  🏠 ${listing.title}`);
      });
    }
    
    // Check saved searches and users
    const users = await prisma.user.findMany({
      include: {
        savedSearches: true
      }
    });
    
    console.log(`\n👥 Users with saved searches: ${users.length}`);
    users.forEach(user => {
      console.log(`  📧 ${user.email}: ${user.savedSearches.length} searches`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkListings();
