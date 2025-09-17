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

// Get all agents
export async function getAgents() {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const { data: agents, error } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        email,
        phone,
        photo,
        bio,
        specialties,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching agents:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, agents: agents || [] };
  } catch (error) {
    console.error('Error in getAgents:', error);
    return { success: false, error: error.message };
  }
}

// Create a new agent
export async function createAgent(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const specialties = formData.get('specialties');
    const photo = formData.get('photo');
    
    if (!name || !email) {
      return { success: false, error: 'Name and email are required' };
    }
    
    // Check if agent with this email already exists
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingAgent) {
      return { success: false, error: 'Agent with this email already exists' };
    }
    
    // Parse specialties
    const specialtiesArray = specialties ? specialties.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const { data: newAgent, error } = await supabase
      .from('agents')
      .insert({
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        specialties: specialtiesArray,
        photo: photo || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, agent: newAgent };
  } catch (error) {
    console.error('Error in createAgent:', error);
    return { success: false, error: error.message };
  }
}

// Update an agent
export async function updateAgent(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const id = formData.get('id');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const specialties = formData.get('specialties');
    const photo = formData.get('photo');
    
    if (!id || !name || !email) {
      return { success: false, error: 'ID, name, and email are required' };
    }
    
    // Check if email is already taken by another agent
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .single();
    
    if (existingAgent) {
      return { success: false, error: 'Email is already taken by another agent' };
    }
    
    // Parse specialties
    const specialtiesArray = specialties ? specialties.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const { data: updatedAgent, error } = await supabase
      .from('agents')
      .update({
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        specialties: specialtiesArray,
        photo: photo || null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating agent:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, agent: updatedAgent };
  } catch (error) {
    console.error('Error in updateAgent:', error);
    return { success: false, error: error.message };
  }
}

// Delete an agent
export async function deleteAgent(agentId) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    if (!agentId) {
      return { success: false, error: 'Agent ID is required' };
    }
    
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);
    
    if (error) {
      console.error('Error deleting agent:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteAgent:', error);
    return { success: false, error: error.message };
  }
}

// Toggle agent active status
export async function toggleAgentStatus(agentId) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    if (!agentId) {
      return { success: false, error: 'Agent ID is required' };
    }
    
    // Get current status
    const { data: agent } = await supabase
      .from('agents')
      .select('isActive')
      .eq('id', agentId)
      .single();
    
    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }
    
    const { data: updatedAgent, error } = await supabase
      .from('agents')
      .update({
        isActive: !agent.isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', agentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error toggling agent status:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, agent: updatedAgent };
  } catch (error) {
    console.error('Error in toggleAgentStatus:', error);
    return { success: false, error: error.message };
  }
}

// Get agents for building assignment
export async function getAgentsForAssignment() {
  try {
    const { supabase } = await requireAdmin();
    
    const { data: agents, error } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        email,
        phone,
        photo,
        specialties,
        isActive
      `)
      .eq('isActive', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching agents for assignment:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, agents: agents || [] };
  } catch (error) {
    console.error('Error in getAgentsForAssignment:', error);
    return { success: false, error: error.message };
  }
}
