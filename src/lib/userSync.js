import { createClient } from '@/utils/supabase/server'
import { prisma } from './db'

/**
 * Syncs a Supabase user with the Prisma database
 * This is useful for existing users who signed up before the trigger was in place
 */
export async function syncUserWithDatabase(userId) {
  try {
    const supabase = await createClient()
    
    // Get user data from Supabase Auth
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error || !user) {
      throw new Error('User not found in Supabase Auth')
    }

    // Check if user already exists in Prisma database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (existingUser) {
      console.log('User already exists in database:', userId)
      return existingUser
    }

    // Create user in Prisma database
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || null,
      }
    })

    console.log('User synced with database:', newUser)
    return newUser
  } catch (error) {
    console.error('Error syncing user with database:', error)
    throw error
  }
}

/**
 * Syncs all existing Supabase users with the Prisma database
 * Use this function once to migrate existing users
 */
export async function syncAllUsers() {
  try {
    const supabase = await createClient()
    
    // Get all users from Supabase Auth (this requires admin privileges)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      throw new Error('Failed to fetch users from Supabase Auth')
    }

    let syncedCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        await syncUserWithDatabase(user.id)
        syncedCount++
      } catch (syncError) {
        console.error(`Failed to sync user ${user.id}:`, syncError)
        errorCount++
      }
    }

    console.log(`User sync completed. Synced: ${syncedCount}, Errors: ${errorCount}`)
    return { syncedCount, errorCount }
  } catch (error) {
    console.error('Error syncing all users:', error)
    throw error
  }
}
