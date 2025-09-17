import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import { fetchFromAmpre } from './apiUtils.js';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to get building name from address
function getBuildingNameFromAddress(buildingAddress) {
  try {
    const address = typeof buildingAddress === 'string' ? JSON.parse(buildingAddress) : buildingAddress;
    return address.displayName || address.address || 'Unknown Building';
  } catch (error) {
    return 'Unknown Building';
  }
}

// Fetch new listings for a building (listings that appeared in the last 24 hours and are still active)
async function getNewListings(buildingSlug, buildingAddress) {
  try {
    const parts = buildingSlug.split('-');
    const streetNumber = parts[0];
    let streetNameParts = parts.slice(1);
    const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
    
    const suffixes = ['rd', 'st', 'ave', 'blvd', 'dr', 'ln', 'cir', 'ct', 'pl', 'ter', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'circle', 'court', 'place', 'terrace'];
    
    if (suffixes.includes(lastPart)) {
      streetNameParts = streetNameParts.slice(0, -1);
    }
    const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

    // Get listings from the previous day only
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Start of previous day
    const yesterdayStartISO = yesterday.toISOString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const todayStartISO = today.toISOString();

    // Get listings that were created on the previous day (not just modified)
    const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and MlsStatus eq 'New' and (OriginalEntryTimestamp ge ${yesterdayStartISO} and OriginalEntryTimestamp lt ${todayStartISO})`;
    
    const listings = await fetchFromAmpre(filter, 'OriginalEntryTimestamp desc');
    
    return listings.map(listing => ({
      ...listing,
      buildingSlug,
      buildingName: getBuildingNameFromAddress(buildingAddress),
      status: 'new'
    }));
  } catch (error) {
    console.error(`Error fetching new listings for ${buildingSlug}:`, error);
    return [];
  }
}

// Fetch recently sold listings (updated in the last 24 hours)
async function getRecentlySoldListings(buildingSlug, buildingAddress) {
  try {
    const parts = buildingSlug.split('-');
    const streetNumber = parts[0];
    let streetNameParts = parts.slice(1);
    const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
    
    const suffixes = ['rd', 'st', 'ave', 'blvd', 'dr', 'ln', 'cir', 'ct', 'pl', 'ter', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'circle', 'court', 'place', 'terrace'];
    
    if (suffixes.includes(lastPart)) {
      streetNameParts = streetNameParts.slice(0, -1);
    }
    const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

    // Get listings that were sold on the previous day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Start of previous day
    const yesterdayStartISO = yesterday.toISOString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const todayStartISO = today.toISOString();

    const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and (MlsStatus eq 'Sold' or MlsStatus eq 'Sold Conditional') and (SoldEntryTimestamp ge ${yesterdayStartISO} and SoldEntryTimestamp lt ${todayStartISO})`;
    
    const listings = await fetchFromAmpre(filter, 'ModificationTimestamp desc');
    
    return listings.map(listing => ({
      ...listing,
      buildingSlug,
      buildingName: getBuildingNameFromAddress(buildingAddress),
      status: 'sold'
    }));
  } catch (error) {
    console.error(`Error fetching sold listings for ${buildingSlug}:`, error);
    return [];
  }
}

// Fetch recently leased listings (updated in the last 24 hours)
async function getRecentlyLeasedListings(buildingSlug, buildingAddress) {
  try {
    const parts = buildingSlug.split('-');
    const streetNumber = parts[0];
    let streetNameParts = parts.slice(1);
    const lastPart = streetNameParts[streetNameParts.length - 1].toLowerCase();
    
    const suffixes = ['rd', 'st', 'ave', 'blvd', 'dr', 'ln', 'cir', 'ct', 'pl', 'ter', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'circle', 'court', 'place', 'terrace'];
    
    if (suffixes.includes(lastPart)) {
      streetNameParts = streetNameParts.slice(0, -1);
    }
    const streetName = streetNameParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());

    // Get listings that were leased on the previous day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Start of previous day
    const yesterdayStartISO = yesterday.toISOString();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const todayStartISO = today.toISOString();

    const filter = `StreetNumber eq '${streetNumber}' and StreetName eq '${streetName}' and PropertySubType eq 'Condo Apartment' and (MlsStatus eq 'Leased' or MlsStatus eq 'Leased Conditional') and (LeasedEntryTimestamp ge ${yesterdayStartISO} and LeasedEntryTimestamp lt ${todayStartISO})`;
    
    const listings = await fetchFromAmpre(filter, 'ModificationTimestamp desc');
    
    return listings.map(listing => ({
      ...listing,
      buildingSlug,
      buildingName: getBuildingNameFromAddress(buildingAddress),
      status: 'leased'
    }));
  } catch (error) {
    console.error(`Error fetching leased listings for ${buildingSlug}:`, error);
    return [];
  }
}

// Get all daily updates for a user's saved searches
async function getUserDailyUpdates(userId) {
  try {
    // Get user's active saved searches
    const savedSearches = await prisma.savedSearch.findMany({
      where: {
        userId,
        isActive: true,
        emailFrequency: 'daily'
      },
      include: {
        user: true
      }
    });

    if (savedSearches.length === 0) {
      return null;
    }

    const allListings = [];
    
    // Fetch updates for each building
    for (const search of savedSearches) {
      console.log(`Checking building: ${search.buildingSlug}`);
      
      const newListings = await getNewListings(search.buildingSlug, search.buildingAddress);
      const soldListings = await getRecentlySoldListings(search.buildingSlug, search.buildingAddress);
      const leasedListings = await getRecentlyLeasedListings(search.buildingSlug, search.buildingAddress);
      
      console.log(`  New: ${newListings.length}, Sold: ${soldListings.length}, Leased: ${leasedListings.length}`);
      
      // Combine all listings and deduplicate by ListingKey
      const buildingListings = [...newListings, ...soldListings, ...leasedListings];
      
      // Deduplicate listings, prioritizing sold > leased > new
      const uniqueListings = new Map();
      
      buildingListings.forEach(listing => {
        const key = listing.ListingKey;
        const existing = uniqueListings.get(key);
        
        if (!existing) {
          // First time seeing this listing
          uniqueListings.set(key, listing);
        } else {
          // Listing already exists, prioritize by status importance
          const statusPriority = { 'sold': 3, 'leased': 2, 'new': 1 };
          const currentPriority = statusPriority[listing.status] || 0;
          const existingPriority = statusPriority[existing.status] || 0;
          
          if (currentPriority > existingPriority) {
            uniqueListings.set(key, listing);
          }
        }
      });
      
      const uniqueBuildingListings = Array.from(uniqueListings.values());
      console.log(`  Final unique listings for ${search.buildingSlug}: ${uniqueBuildingListings.length}`);
      
      allListings.push(...uniqueBuildingListings);
    }
    
    console.log(`Total listings found across all buildings: ${allListings.length}`);

    return {
      user: savedSearches[0].user,
      listings: allListings,
      savedSearches
    };
  } catch (error) {
    console.error(`Error getting daily updates for user ${userId}:`, error);
    return null;
  }
}

// Generate HTML email content
export function generateDailyListingEmailHtml(userName, listings, date) {
  const formatPrice = (price) => {
    if (!price) return 'Contact for price';
    return `$${parseInt(price).toLocaleString()}`;
  };

  const formatAddress = (listing) => {
    const { StreetNumber, StreetName, StreetSuffix, UnitNumber, City, StateOrProvince, PostalCode } = listing;
    const address = `${StreetNumber} ${StreetName} ${StreetSuffix || ''} ${UnitNumber || ''}`.trim();
    const cityState = `${City}, ${StateOrProvince} ${PostalCode}`;
    return { address, cityState };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#10B981'; // green
      case 'sold': return '#3B82F6'; // blue
      case 'leased': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'New Listing';
      case 'sold': return 'Recently Sold';
      case 'leased': return 'Recently Leased';
      default: return status;
    }
  };

  const groupListingsByBuilding = () => {
    const grouped = {};
    
    // First, initialize all buildings from saved searches
    // This ensures all buildings appear in the email, even if they have no updates
    const allBuildingSlugs = new Set();
    listings.forEach(listing => {
      allBuildingSlugs.add(listing.buildingSlug);
    });
    
    // Group listings by building
    listings.forEach(listing => {
      const buildingSlug = listing.buildingSlug;
      if (!grouped[buildingSlug]) {
        grouped[buildingSlug] = {
          buildingName: listing.buildingName || 'Unknown Building',
          listings: []
        };
      }
      grouped[buildingSlug].listings.push(listing);
    });
    
    return grouped;
  };

  const groupedListings = groupListingsByBuilding();

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Daily Property Updates</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9fafb;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 30px;
          color: #374151;
        }
        .building-section {
          margin-bottom: 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .building-header {
          background: #f3f4f6;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .building-name {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .listing-item {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .listing-item:last-child {
          border-bottom: none;
        }
        .listing-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .listing-details {
          flex: 1;
        }
        .listing-address {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }
        .listing-city {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }
        .listing-price {
          font-size: 18px;
          font-weight: 600;
          color: #059669;
          margin: 0 0 8px 0;
        }
        .listing-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .no-listings {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏠 Daily Property Updates</h1>
        <p>${date}</p>
      </div>
      
      <div class="content">
        <div class="greeting">
          Hello ${userName}! Here's your daily property update:
        </div>`;

  if (listings.length === 0) {
    html += `
        <div class="no-listings">
          No new property updates today. Check back tomorrow!
        </div>`;
  } else {
    Object.entries(groupedListings).forEach(([buildingSlug, building]) => {
      html += `
        <div class="building-section">
          <div class="building-header">
            <h2 class="building-name">${building.buildingName}</h2>
          </div>`;
      
      building.listings.forEach(listing => {
        const { address, cityState } = formatAddress(listing);
        const statusColor = getStatusColor(listing.status);
        const statusText = getStatusText(listing.status);
        
        // Get the first available image URL
        const imageUrl = listing.Media?.length > 0 && listing.Media[0]?.MediaURL 
          ? listing.Media[0].MediaURL 
          : 'https://via.placeholder.com/80x80?text=No+Image';
        
        html += `
          <div class="listing-item">
            <img src="${imageUrl}" 
                 alt="Property" class="listing-image" 
                 onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'" />
            <div class="listing-details">
              <div class="listing-address">${address}</div>
              <div class="listing-city">${cityState}</div>
              <div class="listing-price">${formatPrice(listing.ListPrice)}</div>
              <span class="listing-status" style="background-color: ${statusColor}; color: white;">
                ${statusText}
              </span>
            </div>
          </div>`;
      });
      
      html += `
        </div>`;
    });
  }

  html += `
        <div class="footer">
          <p>You're receiving this email because you have active saved searches.</p>
          <p>© 2024 Property Updates. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>`;

  return html;
}

// Send daily email to a specific user
async function sendDailyEmail(userId) {
  try {
    console.log(`Sending daily email to user ${userId}...`);
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      console.error(`User ${userId} not found`);
      return { success: false, error: 'User not found' };
    }

    // Get user's daily updates
    const updates = await getUserDailyUpdates(userId);
    
    if (!updates) {
      console.log(`No saved searches found for user ${userId}, skipping email`);
      return { success: true, data: 'No saved searches found' };
    }
    
    // Always send email if user has saved searches, even if no updates
    if (updates.listings.length === 0) {
      console.log(`No updates for user ${userId}, but sending email with no listings`);
    }
    
    const { listings, user: userData } = updates;

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate the email HTML
    const emailHtml = generateDailyListingEmailHtml(
      userData.name || userData.email.split('@')[0],
      listings,
      today
    );

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Property Updates <noreply@proprmarketing.co>',
      to: user.email,
      subject: `🏠 Daily Property Updates - ${today}`,
      html: emailHtml
    });

    if (error) {
      console.error(`Error sending email to ${user.email}:`, error);
      return { success: false, error: error.message };
    }

    // Update last email sent timestamp for all user's saved searches
    await prisma.savedSearch.updateMany({
      where: { userId },
      data: { lastEmailSent: new Date() }
    });

    console.log(`Daily email sent successfully to ${user.email}`);
    return { success: true, data };

  } catch (error) {
    console.error(`Error sending daily email to user ${userId}:`, error);
    return { success: false, error: error.message };
  }
}

// Send daily emails to all users
export async function sendDailyEmailsToAllUsers() {
  try {
    console.log('Starting daily email process...');
    
    // Get all users with active saved searches
    const usersWithSearches = await prisma.user.findMany({
      where: {
        savedSearches: {
          some: {
            isActive: true,
            emailFrequency: 'daily'
          }
        }
      },
      select: { id: true }
    });

    console.log(`Found ${usersWithSearches.length} users to send emails to`);

    const results = [];
    
    // Send emails to each user
    for (const user of usersWithSearches) {
      const result = await sendDailyEmail(user.id);
      results.push({ userId: user.id, ...result });
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Daily email process completed. Successful: ${successful}, Failed: ${failed}`);
    
    return {
      total: usersWithSearches.length,
      successful,
      failed,
      results
    };

  } catch (error) {
    console.error('Error in daily email process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Test function to send email to a specific user
export async function testDailyEmail(userId) {
  try {
    const result = await sendDailyEmail(userId);
    await prisma.$disconnect();
    return result;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

// Export the main function for testing
export async function sendEmail(userId) {
  return await sendDailyEmail(userId);
}
