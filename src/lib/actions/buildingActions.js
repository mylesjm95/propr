'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Create client for admin operations (using anon key since RLS is disabled)
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, anonKey);
}

// Helper function to check if user is admin (using regular client)
async function requireAdmin() {
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const isAdmin = user.email === 'mylesjm95@gmail.com' || user.user_metadata?.role === 'admin';
  if (!isAdmin) {
    throw new Error('Admin access required');
  }
  
  return { user };
}

// Get all buildings
export async function getBuildings() {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const { data: buildings, error } = await supabase
      .from('buildings')
      .select(`
        id,
        name,
        slug,
        address,
        description,
        amenities,
        photos,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching buildings:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, buildings: buildings || [] };
  } catch (error) {
    console.error('Error in getBuildings:', error);
    return { success: false, error: error.message };
  }
}

// Create a new building
export async function createBuilding(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const name = formData.get('name');
    const slug = formData.get('slug');
    const address = formData.get('address');
    const description = formData.get('description');
    const amenities = formData.get('amenities');
    const photos = formData.get('photos');
    
    if (!name || !slug) {
      return { success: false, error: 'Name and slug are required' };
    }
    
    // Check if building with this slug already exists
    const { data: existingBuilding } = await supabase
      .from('buildings')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existingBuilding) {
      return { success: false, error: 'Building with this slug already exists' };
    }
    
    // Parse amenities and photos
    const amenitiesArray = amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [];
    const photosArray = photos ? photos.split(',').map(p => p.trim()).filter(p => p) : [];
    
    // Create address object
    const addressObj = {
      street: address || '',
      city: 'Toronto',
      province: 'ON',
      postalCode: ''
    };
    
    const { data: newBuilding, error } = await supabase
      .from('buildings')
      .insert({
        name,
        slug,
        address: addressObj,
        description: description || null,
        amenities: amenitiesArray,
        photos: photosArray,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating building:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, building: newBuilding };
  } catch (error) {
    console.error('Error in createBuilding:', error);
    return { success: false, error: error.message };
  }
}

// Update a building
export async function updateBuilding(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const id = formData.get('id');
    const name = formData.get('name');
    const slug = formData.get('slug');
    const address = formData.get('address');
    const description = formData.get('description');
    const amenities = formData.get('amenities');
    const photos = formData.get('photos');
    
    if (!id || !name || !slug) {
      return { success: false, error: 'ID, name, and slug are required' };
    }
    
    // Check if slug is already taken by another building
    const { data: existingBuilding } = await supabase
      .from('buildings')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();
    
    if (existingBuilding) {
      return { success: false, error: 'Slug is already taken by another building' };
    }
    
    // Parse amenities and photos
    const amenitiesArray = amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [];
    const photosArray = photos ? photos.split(',').map(p => p.trim()).filter(p => p) : [];
    
    // Create address object
    const addressObj = {
      street: address || '',
      city: 'Toronto',
      province: 'ON',
      postalCode: ''
    };
    
    const { data: updatedBuilding, error } = await supabase
      .from('buildings')
      .update({
        name,
        slug,
        address: addressObj,
        description: description || null,
        amenities: amenitiesArray,
        photos: photosArray,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating building:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, building: updatedBuilding };
  } catch (error) {
    console.error('Error in updateBuilding:', error);
    return { success: false, error: error.message };
  }
}

// Delete a building
export async function deleteBuilding(buildingId) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    if (!buildingId) {
      return { success: false, error: 'Building ID is required' };
    }
    
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', buildingId);
    
    if (error) {
      console.error('Error deleting building:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteBuilding:', error);
    return { success: false, error: error.message };
  }
}

// Assign agents to building
export async function assignAgentsToBuilding(formData) {
  try {
    const { supabase } = await requireAdmin();
    
    const buildingId = formData.get('buildingId');
    const agentIds = formData.get('agentIds');
    
    if (!buildingId) {
      return { success: false, error: 'Building ID is required' };
    }
    
    // Parse agent IDs
    const agentIdsArray = agentIds ? agentIds.split(',').filter(id => id.trim()) : [];
    
    // First, remove all existing assignments
    await supabase
      .from('building_agents')
      .delete()
      .eq('building_id', buildingId);
    
    // Then add new assignments
    if (agentIdsArray.length > 0) {
      const assignments = agentIdsArray.map((agentId, index) => ({
        building_id: buildingId,
        agent_id: agentId,
        isPrimary: index === 0, // First agent is primary
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('building_agents')
        .insert(assignments);
      
      if (error) {
        console.error('Error assigning agents:', error);
        return { success: false, error: error.message };
      }
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error in assignAgentsToBuilding:', error);
    return { success: false, error: error.message };
  }
}

// Toggle building active status
export async function toggleBuildingStatus(buildingId) {
  try {
    const { supabase } = await requireAdmin();
    
    if (!buildingId) {
      return { success: false, error: 'Building ID is required' };
    }
    
    // Get current status
    const { data: building } = await supabase
      .from('buildings')
      .select('isActive')
      .eq('id', buildingId)
      .single();
    
    if (!building) {
      return { success: false, error: 'Building not found' };
    }
    
    const { data: updatedBuilding, error } = await supabase
      .from('buildings')
      .update({
        isActive: !building.isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', buildingId)
      .select()
      .single();
    
    if (error) {
      console.error('Error toggling building status:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, building: updatedBuilding };
  } catch (error) {
    console.error('Error in toggleBuildingStatus:', error);
    return { success: false, error: error.message };
  }
}
