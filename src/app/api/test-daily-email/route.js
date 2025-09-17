import { NextResponse } from 'next/server';
import { testDailyEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await testDailyEmail(userId);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error testing daily email:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
