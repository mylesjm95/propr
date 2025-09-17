import { NextResponse } from 'next/server';
import { getUsers, assignAgentToUser } from '@/lib/actions/adminActions';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await getUsers(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, agentId, adminUserId } = await request.json();
    
    if (!userId || !agentId || !adminUserId) {
      return NextResponse.json({ error: 'User ID, Agent ID, and Admin User ID required' }, { status: 400 });
    }
    
    const result = await assignAgentToUser(userId, agentId, adminUserId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error assigning agent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}