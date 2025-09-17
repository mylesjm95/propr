// Client-side admin service for API calls

// Agents
export async function fetchAgents(userId) {
  try {
    const response = await fetch(`/api/admin/agents?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    return { error: error.message };
  }
}

export async function createAgent(formData) {
  try {
    const response = await fetch('/api/admin/agents', {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating agent:', error);
    return { error: error.message };
  }
}

export async function updateAgent(formData) {
  try {
    const response = await fetch('/api/admin/agents', {
      method: 'PUT',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating agent:', error);
    return { error: error.message };
  }
}

export async function deleteAgent(agentId, userId) {
  try {
    const response = await fetch(`/api/admin/agents?agentId=${agentId}&userId=${userId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting agent:', error);
    return { error: error.message };
  }
}

// Buildings
export async function fetchBuildings(userId) {
  try {
    const response = await fetch(`/api/admin/buildings?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return { error: error.message };
  }
}

export async function createBuilding(formData) {
  try {
    const response = await fetch('/api/admin/buildings', {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating building:', error);
    return { error: error.message };
  }
}

export async function updateBuilding(formData) {
  try {
    const response = await fetch('/api/admin/buildings', {
      method: 'PUT',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating building:', error);
    return { error: error.message };
  }
}

export async function deleteBuilding(buildingId, userId) {
  try {
    const response = await fetch(`/api/admin/buildings?buildingId=${buildingId}&userId=${userId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting building:', error);
    return { error: error.message };
  }
}

// Users
export async function fetchUsers(userId) {
  try {
    const response = await fetch(`/api/admin/users?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: error.message };
  }
}

export async function assignAgentToUser(userId, agentId, adminUserId) {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, agentId, adminUserId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error assigning agent:', error);
    return { error: error.message };
  }
}

// Inquiries
export async function fetchInquiries(userId) {
  try {
    const response = await fetch(`/api/admin/inquiries?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return { error: error.message };
  }
}

export async function updateInquiryStatus(inquiryId, status, userId) {
  try {
    const response = await fetch('/api/admin/inquiries', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inquiryId, status, userId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { error: error.message };
  }
}

// Photos
export async function uploadBuildingPhotos(formData) {
  try {
    const response = await fetch('/api/admin/photos', {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading photos:', error);
    return { error: error.message };
  }
}

// Building-Agent Assignments
export async function getBuildingAgents(buildingId, userId) {
  try {
    const response = await fetch(`/api/admin/building-agents?buildingId=${buildingId}&userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching building agents:', error);
    return { error: error.message };
  }
}

export async function assignAgentToBuilding(buildingId, agentId, isPrimary, adminUserId) {
  try {
    const response = await fetch('/api/admin/building-agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buildingId, agentId, isPrimary, adminUserId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error assigning agent to building:', error);
    return { error: error.message };
  }
}

export async function removeAgentFromBuilding(buildingId, agentId, adminUserId) {
  try {
    const response = await fetch(`/api/admin/building-agents?buildingId=${buildingId}&agentId=${agentId}&adminUserId=${adminUserId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error removing agent from building:', error);
    return { error: error.message };
  }
}
