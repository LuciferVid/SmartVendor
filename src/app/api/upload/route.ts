import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/supabase-storage'

/**
 * File upload API endpoint
 * POST /api/upload?bucket=contracts&type=contract
 *
 * Query params:
 * - bucket: 'contracts' | 'invoices' | 'purchase-orders'
 * - type: entity type for organizing files
 * - entityId: optional ID of the entity (contract, invoice, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const bucket = request.nextUrl.searchParams.get('bucket')
    const type = request.nextUrl.searchParams.get('type') || 'document'
    const entityId = request.nextUrl.searchParams.get('entityId') || 'general'

    if (!bucket) {
      return NextResponse.json(
        { error: 'Bucket parameter is required' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large (max 50MB)' },
        { status: 400 }
      )
    }

    // Create file path
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const filePath = `${type}/${entityId}/${timestamp}-${sanitizedName}`

    // Upload to Supabase
    const url = await uploadFile(file, bucket, filePath)

    return NextResponse.json(
      {
        success: true,
        url,
        bucket,
        path: filePath,
        name: file.name,
        size: file.size,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
