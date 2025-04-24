'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save a building to the user's saved searches
 * @param {string} condoAddress - The address of the condo building
 * @returns {Object} - Success status and message
 */
export async function saveCondoSearch(condoAddress) {
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
    // Get the current user data to check saved_searches
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('saved_searches')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Initialize saved_searches array if it doesn't exist
    const savedSearches = userData.saved_searches || [];
    
    // Check if this building is already in the user's saved searches
    if (savedSearches.some(search => search.building_address === condoAddress)) {
      return { 
        success: true,
        message: 'You are already subscribed to updates for this building' 
      };
    }
    
    // Add the new search to the saved_searches array with a unique ID
    const updatedSearches = [
      ...savedSearches,
      {
        id: uuidv4(),
        building_address: condoAddress,
        created_at: new Date().toISOString()
      }
    ];
    
    // Update the user record with the new saved_searches array
    const { error: updateError } = await supabase
      .from('users')
      .update({ saved_searches: updatedSearches })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Revalidate the settings page where saved searches may be displayed
    revalidatePath('/settings');
    
    return { 
      success: true, 
      message: 'Building added to your saved searches' 
    };
  } catch (error) {
    console.error('Error saving building search:', error);
    return { 
      success: false, 
      error: 'Failed to save search. Please try again later.' 
    };
  }
}

/**
 * Delete a building from the user's saved searches
 * @param {string} searchId - The unique ID of the saved search to delete
 * @returns {Object} - Success status and message
 */
export async function deleteSavedSearch(searchId) {
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
    // Get the current user data to access saved_searches
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('saved_searches')
      .eq('id', user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Initialize saved_searches array if it doesn't exist
    const savedSearches = userData.saved_searches || [];
    
    // Filter out the saved search with the matching ID
    const updatedSearches = savedSearches.filter(
      search => search.id !== searchId
    );
    
    // Check if anything was actually removed
    if (savedSearches.length === updatedSearches.length) {
      return { 
        success: false, 
        error: 'Saved search not found' 
      };
    }
    
    // Update the user record with the filtered saved_searches array
    const { error: updateError } = await supabase
      .from('users')
      .update({ saved_searches: updatedSearches })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Revalidate the settings page where saved searches are displayed
    revalidatePath('/settings');
    
    return { 
      success: true, 
      message: 'Building removed from your saved searches' 
    };
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return { 
      success: false, 
      error: 'Failed to delete search. Please try again later.' 
    };
  }
}
