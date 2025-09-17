import { NextResponse } from 'next/server';
import { assignAgentToBuilding, removeAgentFromBuilding, getBuildingAgents } from '@/lib/actions/adminActions';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const buildingId = url.searchParams.get('buildingId');
    const userId = url.searchParams.get('userId');
    
    if (!buildingId || !userId) {
      return NextResponse.json({ error: 'Building ID and User ID required' }, { status: 400 });
    }
    
    const result = await getBuildingAgents(buildingId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching building agents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { buildingId, agentId, isPrimary, adminUserId } = await request.json();
    
    if (!buildingId || !agentId || !adminUserId) {
      return NextResponse.json({ error: 'Building ID, Agent ID, and Admin User ID required' }, { status: 400 });
    }
    
    const result = await assignAgentToBuilding(buildingId, agentId, isPrimary, adminUserId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error assigning agent to building:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const buildingId = url.searchParams.get('buildingId');
    const agentId = url.searchParams.get('agentId');
    const adminUserId = url.searchParams.get('adminUserId');
    
    if (!buildingId || !agentId || !adminUserId) {
      return NextResponse.json({ error: 'Building ID, Agent ID, and Admin User ID required' }, { status: 400 });
    }
    
    const result = await removeAgentFromBuilding(buildingId, agentId, adminUserId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error removing agent from building:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
