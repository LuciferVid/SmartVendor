import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { mockVendors } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    let workspaceId: string | null = null

    // Try to get from auth first
    try {
      const { userId } = await auth()
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { clerkId: userId },
        })
        workspaceId = user?.workspaceId || null
      }
    } catch (e) {
      // Auth failed, continue to find workspace
    }

    // If no workspace from auth, get the first workspace (development mode)
    if (!workspaceId) {
      const workspace = await prisma.workspace.findFirst()
      workspaceId = workspace?.id || null
    }

    if (workspaceId) {
      try {
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const vendors = await prisma.vendor.findMany({
          where: { workspaceId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        })

        const total = await prisma.vendor.count({
          where: { workspaceId },
        })

        return NextResponse.json({
          vendors,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        })
      } catch (dbError) {
        console.log('Database query failed, using mock data:', (dbError as Error).message)
      }
    }

    // Return mock data as fallback
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    return NextResponse.json({
      vendors: mockVendors.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        total: mockVendors.length,
        pages: Math.ceil(mockVendors.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip auth for development mode
    const body = await request.json()

    // Try to save to database
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: 'dev-user-1' },
      })

      if (user) {
        const vendor = await prisma.vendor.create({
          data: {
            ...body,
            workspaceId: user.workspaceId,
          },
        })

        return NextResponse.json(vendor, { status: 201 })
      }
    } catch (dbError) {
      // Database not available
      console.log('Database connection failed')
    }

    // Return mock response
    return NextResponse.json(
      {
        ...body,
        id: `mock-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: 'workspace-1',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
