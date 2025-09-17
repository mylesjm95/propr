'use server';

import { prisma } from '@/lib/db';
import { requireAdmin, requireAgent } from '@/lib/authUtils';
import { revalidatePath } from 'next/cache';

// ===== AGENT MANAGEMENT =====

export async function createAgent(formData) {
  try {
    const userId = formData.get('userId');
    await requireAdmin(userId);

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const specialties = formData.get('specialties')?.split(',').map(s => s.trim()) || [];

    if (!name || !email) {
      return { error: 'Name and email are required' };
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        specialties,
      }
    });

    revalidatePath('/admin');
    return { success: true, agent };
  } catch (error) {
    console.error('Error creating agent:', error);
    return { error: error.message || 'Failed to create agent' };
  }
}

export async function updateAgent(formData) {
  try {
    const userId = formData.get('userId');
    await requireAdmin(userId);

    const agentId = formData.get('agentId');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const specialties = formData.get('specialties')?.split(',').map(s => s.trim()) || [];
    const isActive = formData.get('isActive') === 'true';

    if (!agentId || !name || !email) {
      return { error: 'Agent ID, name and email are required' };
    }

    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        specialties,
        isActive,
      }
    });

    revalidatePath('/admin');
    return { success: true, agent };
  } catch (error) {
    console.error('Error updating agent:', error);
    return { error: error.message || 'Failed to update agent' };
  }
}

export async function deleteAgent(agentId, userId) {
  try {
    await requireAdmin(userId);

    await prisma.agent.delete({
      where: { id: agentId }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting agent:', error);
    return { error: error.message || 'Failed to delete agent' };
  }
}

export async function getAgents(userId) {
  try {
    await requireAdmin(userId);

    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedUsers: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { inquiries: true }
        }
      }
    });

    return { success: true, agents };
  } catch (error) {
    console.error('Error fetching agents:', error);
    return { error: error.message || 'Failed to fetch agents' };
  }
}

// ===== BUILDING MANAGEMENT =====

export async function createBuilding(formData) {
  try {
    const userId = formData.get('userId');
    await requireAdmin(userId);

    const name = formData.get('name');
    const slug = formData.get('slug');
    const address = JSON.parse(formData.get('address') || '{}');
    const description = formData.get('description');
    const amenities = formData.get('amenities')?.split(',').map(s => s.trim()) || [];

    if (!name || !slug) {
      return { error: 'Name and slug are required' };
    }

    const building = await prisma.building.create({
      data: {
        name,
        slug,
        address,
        description: description || null,
        amenities,
      }
    });

    revalidatePath('/admin');
    return { success: true, building };
  } catch (error) {
    console.error('Error creating building:', error);
    return { error: error.message || 'Failed to create building' };
  }
}

export async function updateBuilding(formData) {
  try {
    const userId = formData.get('userId');
    await requireAdmin(userId);

    const buildingId = formData.get('buildingId');
    const name = formData.get('name');
    const slug = formData.get('slug');
    const address = JSON.parse(formData.get('address') || '{}');
    const description = formData.get('description');
    const amenities = formData.get('amenities')?.split(',').map(s => s.trim()) || [];
    const isActive = formData.get('isActive') === 'true';

    if (!buildingId || !name || !slug) {
      return { error: 'Building ID, name and slug are required' };
    }

    const building = await prisma.building.update({
      where: { id: buildingId },
      data: {
        name,
        slug,
        address,
        description: description || null,
        amenities,
        isActive,
      }
    });

    revalidatePath('/admin');
    return { success: true, building };
  } catch (error) {
    console.error('Error updating building:', error);
    return { error: error.message || 'Failed to update building' };
  }
}

export async function deleteBuilding(buildingId, userId) {
  try {
    await requireAdmin(userId);

    await prisma.building.delete({
      where: { id: buildingId }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting building:', error);
    return { error: error.message || 'Failed to delete building' };
  }
}

export async function getBuildings(userId) {
  try {
    await requireAdmin(userId);

    const buildings = await prisma.building.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { inquiries: true }
        }
      }
    });

    return { success: true, buildings };
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return { error: error.message || 'Failed to fetch buildings' };
  }
}

// ===== PHOTO UPLOAD =====

export async function uploadBuildingPhotos(formData) {
  try {
    const userId = formData.get('userId');
    await requireAdmin(userId);

    const buildingId = formData.get('buildingId');
    const photos = formData.getAll('photos');

    if (!buildingId) {
      return { error: 'Building ID is required' };
    }

    if (!photos || photos.length === 0) {
      return { error: 'No photos provided' };
    }

    // Upload photos to Supabase Storage
    const { uploadMultipleFiles } = await import('@/lib/storageUtils');
    const uploadResult = await uploadMultipleFiles('building-photos', photos, `building-photos/${buildingId}`);

    if (!uploadResult.success) {
      return { error: uploadResult.error || 'Failed to upload photos' };
    }

    // Extract photo URLs from the results
    const photoUrls = uploadResult.results.map(result => result.url);

    // Get current building to append photos
    const currentBuilding = await prisma.building.findUnique({
      where: { id: buildingId },
      select: { photos: true }
    });

    // Update building with new photos
    const building = await prisma.building.update({
      where: { id: buildingId },
      data: {
        photos: [...(currentBuilding?.photos || []), ...photoUrls]
      }
    });

    revalidatePath('/admin');
    return { success: true, building, photoUrls };
  } catch (error) {
    console.error('Error uploading photos:', error);
    return { error: error.message || 'Failed to upload photos' };
  }
}

// ===== USER MANAGEMENT =====

export async function assignAgentToUser(userId, agentId, adminUserId) {
  try {
    await requireAdmin(adminUserId);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { assignedAgentId: agentId },
      include: {
        assignedAgent: true
      }
    });

    revalidatePath('/admin');
    return { success: true, user };
  } catch (error) {
    console.error('Error assigning agent:', error);
    return { error: error.message || 'Failed to assign agent' };
  }
}

export async function getUsers(userId) {
  try {
    await requireAdmin(userId);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedAgent: true,
        _count: {
          select: { 
            savedSearches: true,
            inquiries: true
          }
        }
      }
    });

    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: error.message || 'Failed to fetch users' };
  }
}

export async function toggleUserRole(userId, currentRole) {
  try {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    revalidatePath('/admin');
    return { success: true, newRole, message: `User role updated to ${newRole}` };
  } catch (error) {
    console.error('Error toggling user role:', error);
    return { error: error.message || 'Failed to update user role' };
  }
}

// ===== INQUIRY MANAGEMENT =====

export async function getInquiries(userId) {
  try {
    await requireAgent(userId);

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        agent: {
          select: { id: true, name: true, email: true }
        },
        building: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return { success: true, inquiries };
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return { error: error.message || 'Failed to fetch inquiries' };
  }
}

export async function updateInquiryStatus(inquiryId, status, userId) {
  try {
    await requireAgent(userId);

    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status }
    });

    revalidatePath('/admin');
    return { success: true, inquiry };
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { error: error.message || 'Failed to update inquiry status' };
  }
}

export async function createInquiry(formData) {
  try {
    const userId = formData.get('userId');
    const agentId = formData.get('agentId');
    const buildingId = formData.get('buildingId');
    const listingKey = formData.get('listingKey');
    const type = formData.get('type') || 'question';
    const subject = formData.get('subject');
    const message = formData.get('message');
    const priority = formData.get('priority') || 'normal';

    if (!userId || !subject || !message) {
      return { error: 'User ID, subject, and message are required' };
    }

    // If buildingId is provided but no agentId, find the primary agent for the building
    let assignedAgentId = agentId;
    if (buildingId && !agentId) {
      const primaryAgent = await prisma.buildingAgent.findFirst({
        where: {
          buildingId,
          isPrimary: true,
          isActive: true
        },
        include: { agent: true }
      });
      assignedAgentId = primaryAgent?.agentId || null;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        userId,
        agentId: assignedAgentId,
        buildingId: buildingId || null,
        listingKey: listingKey || null,
        type,
        subject,
        message,
        priority
      }
    });

    revalidatePath('/admin');
    return { success: true, inquiry };
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return { error: error.message || 'Failed to create inquiry' };
  }
}

// ===== BUILDING-AGENT ASSIGNMENTS =====

export async function assignAgentToBuilding(buildingId, agentId, isPrimary, adminUserId) {
  try {
    await requireAdmin(adminUserId);

    // If setting as primary, unset other primary agents for this building
    if (isPrimary) {
      await prisma.buildingAgent.updateMany({
        where: {
          buildingId,
          isPrimary: true
        },
        data: {
          isPrimary: false
        }
      });
    }

    const buildingAgent = await prisma.buildingAgent.upsert({
      where: {
        buildingId_agentId: {
          buildingId,
          agentId
        }
      },
      update: {
        isPrimary,
        isActive: true
      },
      create: {
        buildingId,
        agentId,
        isPrimary,
        isActive: true
      },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true }
        },
        building: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    revalidatePath('/admin');
    return { success: true, buildingAgent };
  } catch (error) {
    console.error('Error assigning agent to building:', error);
    return { error: error.message || 'Failed to assign agent to building' };
  }
}

export async function removeAgentFromBuilding(buildingId, agentId, adminUserId) {
  try {
    await requireAdmin(adminUserId);

    await prisma.buildingAgent.delete({
      where: {
        buildingId_agentId: {
          buildingId,
          agentId
        }
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error removing agent from building:', error);
    return { error: error.message || 'Failed to remove agent from building' };
  }
}

export async function getBuildingAgents(buildingId, adminUserId) {
  try {
    await requireAdmin(adminUserId);

    const buildingAgents = await prisma.buildingAgent.findMany({
      where: { buildingId },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true, isActive: true }
        }
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return { success: true, buildingAgents };
  } catch (error) {
    console.error('Error fetching building agents:', error);
    return { error: error.message || 'Failed to fetch building agents' };
  }
}
