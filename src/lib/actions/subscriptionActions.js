'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Create client for subscription operations
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, anonKey);
}

// Helper function to check if user is authenticated
async function requireAuth() {
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return { user };
}

// Subscribe user to building updates
export async function subscribeToBuildingUpdates(formData) {
  try {
    const { user } = await requireAuth();
    const supabase = createServiceClient();
    
    const buildingAddress = formData.get('buildingAddress');
    const userId = user.id;
    
    if (!buildingAddress) {
      return { success: false, error: 'Building address is required' };
    }
    
    // Check if user is already subscribed to this building
    const { data: existingSubscription } = await supabase
      .from('saved_searches')
      .select('id')
      .eq('user_id', userId)
      .eq('building_address->>address', buildingAddress)
      .single();
    
    if (existingSubscription) {
      return { success: false, error: 'You are already subscribed to updates for this building' };
    }
    
    // Create new subscription
    const { data: newSubscription, error } = await supabase
      .from('saved_searches')
      .insert({
        id: crypto.randomUUID(), // Generate a UUID for the id field
        user_id: userId,
        building_slug: buildingAddress.toLowerCase().replace(/\s+/g, '-'),
        building_address: {
          address: buildingAddress
        },
        preferences: {
          notification_frequency: 'immediate',
          email_notifications: true
        },
        is_active: true,
        email_frequency: 'immediate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/favorites');
    return { success: true, subscription: newSubscription };
  } catch (error) {
    console.error('Error in subscribeToBuildingUpdates:', error);
    return { success: false, error: error.message };
  }
}

// Unsubscribe user from building updates
export async function unsubscribeFromBuildingUpdates(formData) {
  try {
    const { user } = await requireAuth();
    const supabase = createServiceClient();
    
    const buildingAddress = formData.get('buildingAddress');
    const userId = user.id;
    
    if (!buildingAddress) {
      return { success: false, error: 'Building address is required' };
    }
    
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('user_id', userId)
      .eq('building_address->>address', buildingAddress);
    
    if (error) {
      console.error('Error removing subscription:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/favorites');
    return { success: true };
  } catch (error) {
    console.error('Error in unsubscribeFromBuildingUpdates:', error);
    return { success: false, error: error.message };
  }
}

// Get user's building subscriptions
export async function getUserBuildingSubscriptions() {
  try {
    const { user } = await requireAuth();
    const supabase = createServiceClient();
    
    const { data: subscriptions, error } = await supabase
      .from('saved_searches')
      .select('id, building_address, building_slug, preferences, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, subscriptions: subscriptions || [] };
  } catch (error) {
    console.error('Error in getUserBuildingSubscriptions:', error);
    return { success: false, error: error.message };
  }
}
