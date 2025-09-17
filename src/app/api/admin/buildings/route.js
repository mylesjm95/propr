import { NextResponse } from 'next/server';
import { getBuildings, createBuilding, updateBuilding, deleteBuilding } from '@/lib/actions/adminActions';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await getBuildings(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await createBuilding(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating building:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const result = await updateBuilding(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating building:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const buildingId = url.searchParams.get('buildingId');
    const userId = url.searchParams.get('userId');
    
    if (!buildingId || !userId) {
      return NextResponse.json({ error: 'Building ID and User ID required' }, { status: 400 });
    }
    
    const result = await deleteBuilding(buildingId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting building:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}