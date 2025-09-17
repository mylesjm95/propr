import { prisma } from './db';

/**
 * Check if a user has admin privileges
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} - True if user is admin
 */
export async function isAdmin(userId) {
  if (!userId) return false;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if a user has agent privileges
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} - True if user is agent or admin
 */
export async function isAgent(userId) {
  if (!userId) return false;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role === 'agent' || user?.role === 'admin';
  } catch (error) {
    console.error('Error checking agent status:', error);
    return false;
  }
}

/**
 * Get user role
 * @param {string} userId - The user ID to check
 * @returns {Promise<string|null>} - User role or null
 */
export async function getUserRole(userId) {
  if (!userId) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Require admin access - throws error if not admin
 * @param {string} userId - The user ID to check
 * @throws {Error} - If user is not admin
 */
export async function requireAdmin(userId) {
  const isAdminUser = await isAdmin(userId);
  if (!isAdminUser) {
    throw new Error('Admin access required');
  }
}

/**
 * Require agent or admin access - throws error if not authorized
 * @param {string} userId - The user ID to check
 * @throws {Error} - If user is not agent or admin
 */
export async function requireAgent(userId) {
  const isAgentUser = await isAgent(userId);
  if (!isAgentUser) {
    throw new Error('Agent or admin access required');
  }
}
