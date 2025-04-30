'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get favorite listings for current user
 */
export async function getFavoriteListings() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to view favorites' };
  }
  
  // Get user data including favorite_listings
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('favorite_listings')
    .eq('id', user.id)
    .single();
    
  if (userError) {
    console.error('Error fetching favorite listings:', userError);
    return { error: 'Error fetching favorite listings', details: userError.message };
  }
  
  return { data: userData.favorite_listings || {} };
}

/**
 * Toggle favorite status for a listing
 */
export async function toggleFavoriteListing(formData) {
  const supabase = await createClient();
  const listingKey = formData.get('listing_key');
  const listingAddress = formData.get('listing_address');
  const note = formData.get('note') || '';
  
  if (!listingKey || !listingAddress) {
    return { error: 'Listing information is required' };
  }
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to favorite listings' };
  }
  
  try {
    // Get user's current favorite_listings
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('favorite_listings')
      .eq('id', user.id)
      .single();
      
    if (userError) {
      console.error('Error fetching user data:', userError);
      return { error: 'Failed to get user data', details: userError.message };
    }
    
    // Get current favorites or initialize empty object
    const currentFavorites = userData.favorite_listings || {};
    
    // Check if this listing is already a favorite
    if (currentFavorites[listingKey]) {
      // If already a favorite, remove it
      delete currentFavorites[listingKey];
    } else {
      // Add as a favorite with address, listing key, and note
      currentFavorites[listingKey] = {
        listing_key: listingKey,
        address: listingAddress,
        added_at: new Date().toISOString(),
        note: note
      };
    }
    
    // Update user's favorite_listings in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        favorite_listings: currentFavorites
      })
      .eq('id', user.id);
      
    if (updateError) {
      console.error('Error updating favorites:', updateError);
      return { error: 'Failed to update favorites', details: updateError.message };
    }
    
    // Success!
    revalidatePath('/favorites');
    return { 
      success: true, 
      action: currentFavorites[listingKey] ? 'added' : 'removed',
      favorites: currentFavorites
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { error: 'An unexpected error occurred', details: error.message };
  }
}

/**
 * Update note for a favorited listing
 */
export async function updateFavoriteNote(formData) {
  const supabase = await createClient();
  const listingKey = formData.get('listing_key');
  const note = formData.get('note') || '';
  
  if (!listingKey) {
    return { error: 'Listing key is required' };
  }
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update favorite notes' };
  }
  
  try {
    // Get user's current favorite_listings
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('favorite_listings')
      .eq('id', user.id)
      .single();
      
    if (userError) {
      return { error: 'Failed to get user data', details: userError.message };
    }
    
    const currentFavorites = userData.favorite_listings || {};
    
    // Check if this listing exists in favorites
    if (!currentFavorites[listingKey]) {
      return { error: 'Listing is not in favorites' };
    }
    
    // Update the note
    currentFavorites[listingKey].note = note;
    currentFavorites[listingKey].updated_at = new Date().toISOString();
    
    // Update user's favorite_listings in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        favorite_listings: currentFavorites
      })
      .eq('id', user.id);
      
    if (updateError) {
      return { error: 'Failed to update note', details: updateError.message };
    }
    
    // Success!
    revalidatePath('/favorites');
    return { success: true };
  } catch (error) {
    console.error('Error updating favorite note:', error);
    return { error: 'An unexpected error occurred', details: error.message };
  }
}
