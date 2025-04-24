'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData) {
  const supabase = await createClient()

  console.log('hello')

  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  console.log('Login data:', data)

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Login error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// Profile update action
export async function updateProfile(formData) {
  const supabase = await createClient()

  // Get the current user to verify identity
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to update your profile' }
  }

  // Get form data
  const id = formData.get('id')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const phone = formData.get('phone')

  // Ensure the user is updating their own profile
  if (id !== user.id) {
    return { error: 'You can only update your own profile' }
  }

  try {
    // Update the profile in the database
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
    
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error.message)
    return { error: error.message }
  }
}

// Password update action
export async function updatePassword(formData) {
  const supabase = await createClient()

  // Get form data
  const currentPassword = formData.get('currentPassword')
  const newPassword = formData.get('newPassword')

  try {
    // First, verify the current password by attempting to sign in
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user.email,
      password: currentPassword
    })

    if (signInError) {
      return { error: 'Current password is incorrect' }
    }

    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) throw updateError
    
    return { success: true }
  } catch (error) {
    console.error('Password update error:', error.message)
    return { error: error.message }
  }
}

// Revoke session action
export async function revokeSession(sessionId) {
  const supabase = await createClient()

  try {
    // Attempt to revoke the session
    const { error } = await supabase.auth.admin.revokeUserSession(sessionId)

    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Session revocation error:', error.message)
    return { error: error.message }
  }
}