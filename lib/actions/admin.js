'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server action to fetch all users with admin verification
 */
export async function getUsers() {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // If user is admin, get users from the users table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');
  
  if (usersError) {
    return { error: 'Error fetching users', status: 500 };
  }
  
  // Get auth users
  try {
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    // Combine auth users with profile data
    const combinedUsers = users.map(user => {
      // Find matching auth user to get email, etc.
      const authUser = authUsers?.users?.find(auth => auth.id === user.id) || {};
      return {
        ...user,
        email: authUser.email || null,
        emailConfirmed: authUser.email_confirmed_at || null,
        lastSignIn: authUser.last_sign_in_at || null,
        createdAt: authUser.created_at || null,
      };
    });
    
    return { data: combinedUsers };
  } catch (error) {
    console.error('Error listing users:', error);
    
    // If the admin API fails, return just the users table data
    return { data: users };
  }
}

/**
 * Server action to toggle a user's role between admin and user
 */
export async function toggleUserRole(userId, currentRole) {
  const supabase = await createClient();
  
  // Verify the current user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if current user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);
    
  if (error) {
    return { error: `Failed to update user role: ${error.message}`, status: 500 };
  }
  
  return { 
    success: true, 
    message: `User role updated to ${newRole}!`,
    newRole
  };
}

/**
 * Server action to update a user's role to agent
 */
export async function setUserAsAgent(userEmail) {
  const supabase = await createClient();
  
  // Verify the current user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if current user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Find the user by email
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();
  
  if (userError) {
    // If user doesn't exist yet, they might be authenticating for the first time
    // The role will be set when they create their account
    return { 
      warning: 'User not found in database yet. Role will be set when they first sign in.',
      status: 404 
    };
  }
  
  // Update the user's role to agent
  const { error } = await supabase
    .from('users')
    .update({ role: 'agent' })
    .eq('id', targetUser.id);
    
  if (error) {
    return { error: `Failed to update user role: ${error.message}`, status: 500 };
  }
  
  return { 
    success: true, 
    message: 'User role updated to agent successfully!',
    newRole: 'agent'
  };
}

/**
 * Server action to fetch all agents
 */
export async function getAgents() {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // If user is admin, get agents with their building assignments
  try {
    const { data, error } = await supabase
      .from('agents')
      .select(`
        id, 
        name, 
        email, 
        phone, 
        company,
        created_at,
        agent_buildings (
          id,
          building_address
        )
      `)
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return { data };
  } catch (error) {
    console.error('Error fetching agents:', error);
    return { error: 'Error fetching agents', status: 500 };
  }
}

/**
 * Server action to create a new agent
 */
export async function createAgent(formData) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Extract agent data from formData
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone') || null;
  const company = formData.get('company') || null;
  
  try {
    // Add new agent
    const { error } = await supabase
      .from('agents')
      .insert([{
        name,
        email,
        phone,
        company,
      }]);
      
    if (error) throw error;
    
    // Update the user role to agent
    await setUserAsAgent(email);
    
    return { 
      success: true, 
      message: 'Agent added successfully!' 
    };
  } catch (error) {
    console.error('Error creating agent:', error);
    return { 
      error: `Failed to create agent: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to update an existing agent
 */
export async function updateAgent(agentId, formData) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Extract agent data from formData
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone') || null;
  const company = formData.get('company') || null;
  
  try {
    const { error } = await supabase
      .from('agents')
      .update({
        name,
        email,
        phone,
        company,
      })
      .eq('id', agentId);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Agent updated successfully!' 
    };
  } catch (error) {
    console.error('Error updating agent:', error);
    return { 
      error: `Failed to update agent: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to delete an agent
 */
export async function deleteAgent(agentId) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  try {
    // First delete related agent_buildings entries
    await supabase
      .from('agent_buildings')
      .delete()
      .eq('agent_id', agentId);
    
    // Then delete the agent
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Agent deleted successfully!' 
    };
  } catch (error) {
    console.error('Error deleting agent:', error);
    return { 
      error: `Failed to delete agent: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to fetch all buildings
 */
export async function getBuildings() {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // If user is admin, get buildings
  try {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('building_address');
    
    if (error) {
      throw error;
    }
    
    return { data };
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return { error: 'Error fetching buildings', status: 500 };
  }
}

/**
 * Server action to create a new building
 */
export async function createBuilding(formData) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Extract building data from formData
  const building_address = formData.get('building_address');
  const building_name = formData.get('building_name') || null;
  const corp_number = formData.get('corp_number') || null;
  const neighborhood = formData.get('neighborhood') || null;
  const city = formData.get('city') || null;
  const postal_code = formData.get('postal_code') || null;
  const year_built = formData.get('year_built') ? parseInt(formData.get('year_built')) : null;
  const num_floors = formData.get('num_floors') ? parseInt(formData.get('num_floors')) : null;
  const num_units = formData.get('num_units') ? parseInt(formData.get('num_units')) : null;
  const size_units = formData.get('size_units') || null;
  const price_sqft = formData.get('price_sqft') ? parseInt(formData.get('price_sqft')) : null;
  
  try {
    // Add new building
    const { error } = await supabase
      .from('buildings')
      .insert([{
        building_address,
        building_name,
        corp_number,
        neighborhood,
        city,
        postal_code,
        year_built,
        num_floors,
        num_units,
        size_units,
        price_sqft
      }]);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Building added successfully!' 
    };
  } catch (error) {
    console.error('Error creating building:', error);
    return { 
      error: `Failed to create building: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to update an existing building
 */
export async function updateBuilding(buildingAddress, formData) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Extract building data from formData
  const new_building_address = formData.get('building_address');
  const neighborhood = formData.get('neighborhood') || null;
  const city = formData.get('city') || null;
  const postal_code = formData.get('postal_code') || null;
  const year_built = formData.get('year_built') ? parseInt(formData.get('year_built')) : null;
  
  try {
    const { error } = await supabase
      .from('buildings')
      .update({
        building_address: new_building_address,
        neighborhood,
        city,
        postal_code,
        year_built
      })
      .eq('building_address', buildingAddress);
      
    if (error) throw error;
    
    // If the address was changed, we need to update all references in agent_buildings
    if (buildingAddress !== new_building_address) {
      const { error: updateError } = await supabase
        .from('agent_buildings')
        .update({ building_address: new_building_address })
        .eq('building_address', buildingAddress);
        
      if (updateError) throw updateError;
    }
    
    return { 
      success: true, 
      message: 'Building updated successfully!' 
    };
  } catch (error) {
    console.error('Error updating building:', error);
    return { 
      error: `Failed to update building: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to delete a building
 */
export async function deleteBuilding(buildingAddress) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  try {
    // First delete related agent_buildings entries
    await supabase
      .from('agent_buildings')
      .delete()
      .eq('building_address', buildingAddress);
    
    // Then delete the building
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('building_address', buildingAddress);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Building deleted successfully!' 
    };
  } catch (error) {
    console.error('Error deleting building:', error);
    return { 
      error: `Failed to delete building: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to assign a building to an agent
 */
export async function assignBuildingToAgent(agentId, formData) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  // Extract building address from formData
  const building_address = formData.get('building_address');
  
  if (!building_address || !building_address.trim()) {
    return { error: 'Please enter a building address', status: 400 };
  }
  
  try {
    // Check if building already assigned
    const { data: existingAssignments, error: checkError } = await supabase
      .from('agent_buildings')
      .select('id')
      .eq('agent_id', agentId)
      .eq('building_address', building_address);
    
    if (checkError) throw checkError;
    
    if (existingAssignments && existingAssignments.length > 0) {
      return { 
        error: 'This agent is already assigned to this building', 
        status: 400 
      };
    }
    
    // Add new building assignment
    const { error } = await supabase
      .from('agent_buildings')
      .insert([{
        agent_id: agentId,
        building_address: building_address
      }]);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Building assigned successfully!' 
    };
  } catch (error) {
    console.error('Error assigning building:', error);
    return { 
      error: `Failed to assign building: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to remove a building assignment
 */
export async function removeBuildingAssignment(assignmentId) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  try {
    const { error } = await supabase
      .from('agent_buildings')
      .delete()
      .eq('id', assignmentId);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Building assignment removed successfully!' 
    };
  } catch (error) {
    console.error('Error removing building assignment:', error);
    return { 
      error: `Failed to remove building assignment: ${error.message}`, 
      status: 500 
    };
  }
}

/**
 * Server action to fetch assigned buildings for an agent
 */
export async function getAgentBuildings(agentId) {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (roleError || !userData || userData.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }
  
  try {
    const { data, error } = await supabase
      .from('agent_buildings')
      .select('id, building_address, created_at')
      .eq('agent_id', agentId)
      .order('building_address');
      
    if (error) throw error;
    
    return { data };
  } catch (error) {
    console.error('Error fetching agent buildings:', error);
    return { 
      error: `Failed to fetch assigned buildings: ${error.message}`, 
      status: 500 
    };
  }
}
