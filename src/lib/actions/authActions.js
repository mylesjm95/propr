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
