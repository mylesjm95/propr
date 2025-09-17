import { NextResponse } from 'next/server';
import { getAgents, createAgent, updateAgent, deleteAgent } from '@/lib/actions/adminActions';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await getAgents(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await createAgent(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const result = await updateAgent(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agentId');
    const userId = url.searchParams.get('userId');
    
    if (!agentId || !userId) {
      return NextResponse.json({ error: 'Agent ID and User ID required' }, { status: 400 });
    }
    
    const result = await deleteAgent(agentId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}