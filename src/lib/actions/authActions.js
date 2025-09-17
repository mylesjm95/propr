'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'

export async function login(formData) {
  try {
    const supabase = await createClient()

    // Validate inputs
    const email = formData.get('email')?.trim()
    const password = formData.get('password')

    if (!email || !password) {
      return { error: 'Please fill in all required fields.' }
    }

    if (!email.includes('@')) {
      return { error: 'Please enter a valid email address.' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle specific Supabase auth errors
      switch (error.message) {
        case 'Invalid login credentials':
          return { error: 'Invalid email or password. Please try again.' }
        case 'Email not confirmed':
          return { error: 'Please check your email and confirm your account before signing in.' }
        case 'Too many requests':
          return { error: 'Too many failed attempts. Please try again later.' }
        default:
          return { error: error.message || 'An error occurred during sign in. Please try again.' }
      }
    }

    if (data.user) {
      // Revalidate multiple paths to ensure UI updates
      revalidatePath('/', 'layout')
      revalidatePath('/dashboard', 'layout')
      revalidatePath('/profile', 'layout')
      
      return { success: true, user: data.user }
    }

    return { error: 'An unexpected error occurred. Please try again.' }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signup(formData) {
  try {
    const supabase = await createClient()

    // Validate inputs
    const email = formData.get('email')?.trim()
    const password = formData.get('password')
    const name = formData.get('name')?.trim()

    if (!email || !password) {
      return { error: 'Please fill in all required fields.' }
    }

    if (!email.includes('@')) {
      return { error: 'Please enter a valid email address.' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
      },
    })

    if (error) {
      // Handle specific Supabase auth errors
      switch (error.message) {
        case 'User already registered':
          return { error: 'An account with this email already exists. Please try signing in instead.' }
        case 'Password should be at least 6 characters':
          return { error: 'Password must be at least 6 characters long.' }
        case 'Invalid email':
          return { error: 'Please enter a valid email address.' }
        default:
          return { error: error.message || 'An error occurred during sign up. Please try again.' }
      }
    }

    if (data.user) {
      // Check if user needs email confirmation
      const needsEmailConfirmation = !data.user.email_confirmed_at
      
      // Revalidate multiple paths to ensure UI updates
      revalidatePath('/', 'layout')
      revalidatePath('/dashboard', 'layout')
      revalidatePath('/profile', 'layout')
      
      return { 
        success: true, 
        user: data.user,
        needsEmailConfirmation
      }
    }

    return { error: 'An unexpected error occurred. Please try again.' }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: error.message }
    }

    // Revalidate multiple paths to ensure UI updates
    revalidatePath('/', 'layout')
    revalidatePath('/dashboard', 'layout')
    revalidatePath('/profile', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function updateProfile(formData) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'User not authenticated' }
    }

    const name = formData.get('name')?.trim()
    const email = formData.get('email')?.trim()

    if (!name) {
      return { error: 'Name is required' }
    }

    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address' }
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name },
      email: email !== user.email ? email : undefined
    })

    if (updateError) {
      return { error: updateError.message }
    }

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        name,
        email: email !== user.email ? email : undefined
      }
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update profile error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function updatePassword(formData) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'User not authenticated' }
    }

    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: 'Please fill in all password fields' }
    }

    if (newPassword.length < 6) {
      return { error: 'New password must be at least 6 characters long' }
    }

    if (newPassword !== confirmPassword) {
      return { error: 'New passwords do not match' }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update password error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
