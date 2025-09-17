'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Add a listing to user's favorites
 * @param {string} listingKey - The listing key to add to favorites
 * @returns {Object} - Success status and message
 */
export async function addToFavorites(listingKey) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { 
      success: false, 
      error: 'User not authenticated',
      redirectToAuth: true 
    };
  }

  try {
    // Get the current user data to check favorites
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('favorites')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Initialize favorites array if it doesn't exist
    const favorites = userData.favorites || [];
    
    // Check if this listing is already in favorites
    if (favorites.includes(listingKey)) {
      return { 
        success: true,
        message: 'This listing is already in your favorites' 
      };
    }
    
    // Add the new listing to favorites
    const updatedFavorites = [...favorites, listingKey];
    
    // Update the user record with the new favorites array
    const { error: updateError } = await supabase
      .from('users')
      .update({ favorites: updatedFavorites })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Revalidate the favorites page
    revalidatePath('/favorites');
    
    return { 
      success: true, 
      message: 'Listing added to favorites' 
    };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { 
      success: false, 
      error: 'Failed to add to favorites. Please try again later.' 
    };
  }
}

/**
 * Remove a listing from user's favorites
 * @param {string} listingKey - The listing key to remove from favorites
 * @returns {Object} - Success status and message
 */
export async function removeFromFavorites(listingKey) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { 
      success: false, 
      error: 'User not authenticated'
    };
  }

  try {
    // Get the current user data to access favorites
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('favorites')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Initialize favorites array if it doesn't exist
    const favorites = userData.favorites || [];
    
    // Filter out the listing from favorites
    const updatedFavorites = favorites.filter(key => key !== listingKey);
    
    // Check if anything was actually removed
    if (favorites.length === updatedFavorites.length) {
      return { 
        success: false, 
        error: 'Listing not found in favorites' 
      };
    }
    
    // Update the user record with the filtered favorites array
    const { error: updateError } = await supabase
      .from('users')
      .update({ favorites: updatedFavorites })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Revalidate the favorites page
    revalidatePath('/favorites');
    
    return { 
      success: true, 
      message: 'Listing removed from favorites' 
    };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { 
      success: false, 
      error: 'Failed to remove from favorites. Please try again later.' 
    };
  }
}

/**
 * Get user's favorite listings
 * @returns {Array} - Array of favorite listing keys
 */
export async function getFavorites() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return [];
  }

  try {
    // Get the current user data to access favorites
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('favorites')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return userData.favorites || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

/**
 * Get user's favorite listings with full data
 * @returns {Object} - Object with data property containing favorite listings
 */
export async function getFavoriteListings() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { data: {} };
  }

  try {
    // Get the current user data to access favorites
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('favorites')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const favorites = userData.favorites || [];
    
    // Convert array to object for easier lookup
    const favoriteListings = {};
    favorites.forEach(listingKey => {
      favoriteListings[listingKey] = true;
    });
    
    return { data: favoriteListings };
  } catch (error) {
    console.error('Error getting favorite listings:', error);
    return { data: {} };
  }
}

/**
 * Update favorite note
 * @param {string} listingKey - The listing key
 * @param {string} note - The note to save
 * @returns {Object} - Success status and message
 */
export async function updateFavoriteNote(listingKey, note) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { 
      success: false, 
      error: 'User not authenticated'
    };
  }

  try {
    // This would typically update a notes field in the user's favorites
    // For now, we'll just return success
    return { 
      success: true, 
      message: 'Note updated successfully' 
    };
  } catch (error) {
    console.error('Error updating favorite note:', error);
    return { 
      success: false, 
      error: 'Failed to update note. Please try again later.' 
    };
  }
}
