import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Dynamically import scheduler at runtime to avoid build-time imports
    const { initializeJobs } = await import('@/jobs/scheduler')
    initializeJobs()
    return NextResponse.json({ success: true, message: 'Jobs initialized' })
  } catch (error) {
    console.error('Failed to initialize jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize jobs' },
      { status: 500 }
    )
  }
}
