import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/authUtils';

export async function POST(request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false, error: 'User ID required' });
    }
    
    const userIsAdmin = await isAdmin(userId);
    
    return NextResponse.json({ isAdmin: userIsAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      error: error.message 
    });
  }
}
