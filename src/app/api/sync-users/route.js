import { NextResponse } from 'next/server'
import { syncAllUsers } from '@/lib/userSync'

export async function POST(request) {
  try {
    // This endpoint should be protected in production
    // You might want to add authentication/authorization here
    
    const result = await syncAllUsers()
    
    return NextResponse.json({
      success: true,
      message: 'User sync completed successfully',
      result
    })
  } catch (error) {
    console.error('Error in sync-users API:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to sync users',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request) {
  return NextResponse.json({
    message: 'Use POST method to sync users'
  })
}
