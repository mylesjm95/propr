'use server';

import {
  createSavedSearch, 
  removeSavedSearch, 
  getUserSavedSearches, 
  isUserSubscribedToBuilding,
  updateSavedSearchPreferences
} from '@/lib/db';

// Server Action: Create a saved search for a building
export async function createBuildingSavedSearch(userId, buildingSlug, buildingAddress, emails = null, preferences = null) {
  try {
    if (!userId || !buildingSlug || !buildingAddress) {
      throw new Error('User ID, building slug, and building address are required');
    }

    // Check if saved search already exists
    const isSubscribed = await isUserSubscribedToBuilding(userId, buildingSlug);

    if (isSubscribed) {
      return {
        success: false,
        error: 'You are already subscribed to this building'
      };
    }

    const savedSearch = await createSavedSearch(userId, buildingSlug, buildingAddress, emails, preferences);
    
    return {
      success: true,
      savedSearch,
      message: 'Saved search created successfully'
    };
  } catch (error) {
    console.error('Error creating saved search:', error);
    
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'You are already subscribed to this building'
      };
    }
    
    return {
      success: false,
      error: 'Failed to create saved search'
    };
  }
}

// Server Action: Remove a saved search
export async function removeBuildingSavedSearch(userId, buildingSlug) {
  try {
    if (!userId || !buildingSlug) {
      throw new Error('User ID and building slug are required');
    }

    await removeSavedSearch(userId, buildingSlug);
    
    return {
      success: true,
      message: 'Saved search removed successfully'
    };
  } catch (error) {
    console.error('Error removing saved search:', error);
    return {
      success: false,
      error: 'Failed to remove saved search'
    };
  }
}

// Server Action: Get user's saved searches
export async function getUserSavedSearchesAction(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const savedSearches = await getUserSavedSearches(userId);
    
    return {
      success: true,
      savedSearches
    };
  } catch (error) {
    console.error('Error getting saved searches:', error);
    return {
      success: false,
      error: 'Failed to get saved searches',
      savedSearches: []
    };
  }
}

// Server Action: Check if user is subscribed to a building
export async function checkUserSubscription(userId, buildingSlug) {
  try {
    if (!userId || !buildingSlug) {
      return { isSubscribed: false };
    }

    const isSubscribed = await isUserSubscribedToBuilding(userId, buildingSlug);
    
    return { isSubscribed };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isSubscribed: false };
  }
}

// Server Action: Toggle saved search (create or remove)
export async function toggleSavedSearch(userId, buildingSlug, buildingAddress, emails = null, preferences = null) {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check current subscription status
    const { isSubscribed } = await checkUserSubscription(userId, buildingSlug);

    if (isSubscribed) {
      // Remove saved search
      return await removeBuildingSavedSearch(userId, buildingSlug);
    } else {
      // Create saved search
      return await createBuildingSavedSearch(userId, buildingSlug, buildingAddress, emails, preferences);
    }
  } catch (error) {
    console.error('Error toggling saved search:', error);
    return {
      success: false,
      error: 'Failed to update saved search'
    };
  }
}

// Server Action: Update saved search preferences
export async function updateSavedSearchPreferencesAction(userId, buildingSlug, preferences) {
  try {
    if (!userId || !buildingSlug || !preferences) {
      throw new Error('User ID, building slug, and preferences are required');
    }

    const savedSearch = await updateSavedSearchPreferences(userId, buildingSlug, preferences);
    
    return {
      success: true,
      savedSearch,
      message: 'Preferences updated successfully'
    };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return {
      success: false,
      error: 'Failed to update preferences'
    };
  }
}

// Server Action: Delete a saved search by ID
export async function deleteSavedSearch(searchId) {
  try {
    if (!searchId) {
      throw new Error('Search ID is required');
    }

    // Use the existing prisma instance from db.js
    const { prisma } = await import('@/lib/db');

    await prisma.savedSearch.delete({
      where: {
        id: searchId,
      },
    });
    
    return {
      success: true,
      message: 'Saved search deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return {
      success: false,
      error: 'Failed to delete saved search'
    };
  }
} 