import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database operations for saved searches
export async function createSavedSearch(userId, buildingSlug, buildingAddress, emails = null, preferences = null) {
  try {
    // Convert buildingAddress to JSON format if it's a string
    const buildingAddressData = typeof buildingAddress === 'string' 
      ? { address: buildingAddress, displayName: buildingAddress }
      : buildingAddress;

    const data = {
      buildingSlug,
      buildingAddress: buildingAddressData,
      user: {
        connect: { id: userId }
      }
    };

    // Only add optional fields if they have actual values
    if (emails !== null && emails !== undefined && Array.isArray(emails) && emails.length > 0) {
      data.emails = emails;
    }

    if (preferences !== null && preferences !== undefined) {
      data.preferences = preferences;
    }

    const savedSearch = await prisma.savedSearch.create({
      data,
    });
    return savedSearch;
  } catch (error) {
    console.error('Error creating saved search:', error);
    throw error;
  }
}

export async function removeSavedSearch(userId, buildingSlug) {
  try {
    await prisma.savedSearch.delete({
      where: {
        userId_buildingSlug: {
          userId,
          buildingSlug,
        },
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error removing saved search:', error);
    throw error;
  }
}

export async function getUserSavedSearches(userId) {
  try {
    const savedSearches = await prisma.savedSearch.findMany({
      where: { 
        userId,
        isActive: true,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return savedSearches;
  } catch (error) {
    console.error('Error getting user saved searches:', error);
    throw error;
  }
}

export async function isUserSubscribedToBuilding(userId, buildingSlug) {
  try {
    const savedSearch = await prisma.savedSearch.findUnique({
      where: {
        userId_buildingSlug: {
          userId,
          buildingSlug,
        },
      },
    });
    
    return !!savedSearch && savedSearch.isActive;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

export async function updateSavedSearchPreferences(userId, buildingSlug, preferences) {
  try {
    const savedSearch = await prisma.savedSearch.update({
      where: {
        userId_buildingSlug: {
          userId,
          buildingSlug,
        },
      },
      data: {
        preferences,
        updatedAt: new Date(),
      },
    });
    
    return savedSearch;
  } catch (error) {
    console.error('Error updating saved search preferences:', error);
    throw error;
  }
}

export async function deactivateSavedSearch(userId, buildingSlug) {
  try {
    const savedSearch = await prisma.savedSearch.update({
      where: {
        userId_buildingSlug: {
          userId,
          buildingSlug,
        },
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
    
    return savedSearch;
  } catch (error) {
    console.error('Error deactivating saved search:', error);
    throw error;
  }
} 