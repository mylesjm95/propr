'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

// Get all users
export async function getUsers() {
  try {
    await requireAdmin(); // Check admin status
    const supabase = createServiceClient(); // Use service role for data access
    
    const { data: users, error } = await supabase
      .from('User')
      .select(`
        id,
        name,
        email,
        role,
        createdAt,
        updatedAt,
        assignedAgent:assigned_agent_id (
          id,
          name,
          email
        )
      `)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, users: users || [] };
  } catch (error) {
    console.error('Error in getUsers:', error);
    return { success: false, error: error.message };
  }
}

// Create a new user
export async function createUser(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role') || 'user';
    
    if (!name || !email) {
      return { success: false, error: 'Name and email are required' };
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    const { data: newUser, error } = await supabase
      .from('User')
      .insert({
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error in createUser:', error);
    return { success: false, error: error.message };
  }
}

// Update a user
export async function updateUser(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const id = formData.get('id');
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    
    if (!id || !name || !email) {
      return { success: false, error: 'ID, name, and email are required' };
    }
    
    // Check if email is already taken by another user
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .single();
    
    if (existingUser) {
      return { success: false, error: 'Email is already taken by another user' };
    }
    
    const { data: updatedUser, error } = await supabase
      .from('User')
      .update({
        name,
        email,
        role,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error in updateUser:', error);
    return { success: false, error: error.message };
  }
}

// Delete a user
export async function deleteUser(userId) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return { success: false, error: error.message };
  }
}

// Assign agent to user
export async function assignAgentToUser(formData) {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    
    const userId = formData.get('userId');
    const agentId = formData.get('agentId');
    
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    const { data: updatedUser, error } = await supabase
      .from('User')
      .update({
        assigned_agent_id: agentId || null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', userId)
      .select(`
        id,
        name,
        email,
        role,
        assignedAgent:assigned_agent_id (
          id,
          name,
          email
        )
      `)
      .single();
    
    if (error) {
      console.error('Error assigning agent:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin');
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error in assignAgentToUser:', error);
    return { success: false, error: error.message };
  }
}
