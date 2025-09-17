import { NextResponse } from 'next/server';
import { getInquiries, updateInquiryStatus } from '@/lib/actions/adminActions';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await getInquiries(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { inquiryId, status, userId } = await request.json();
    
    if (!inquiryId || !status || !userId) {
      return NextResponse.json({ error: 'Inquiry ID, Status, and User ID required' }, { status: 400 });
    }
    
    const result = await updateInquiryStatus(inquiryId, status, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}