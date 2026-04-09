import { NextRequest, NextResponse } from 'next/server'
import { getDownloadUrl } from '@/lib/supabase-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { bucket: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 })
    }

    const signedUrl = await getDownloadUrl(params.bucket, path)
    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error('File download error:', error)
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }
}

