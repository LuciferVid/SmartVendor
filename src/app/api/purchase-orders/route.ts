import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { mockPurchaseOrders } from '@/lib/mock-data'

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

        const pos = await prisma.purchaseOrder.findMany({
          where: { workspaceId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { vendor: true, approver: true },
        })

        const total = await prisma.purchaseOrder.count({
          where: { workspaceId },
        })

        return NextResponse.json({
          pos,
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
      pos: mockPurchaseOrders.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        total: mockPurchaseOrders.length,
        pages: Math.ceil(mockPurchaseOrders.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching POs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: 'dev-user-1' },
      })

      if (user) {
        // Generate PO number
        const lastPO = await prisma.purchaseOrder.findFirst({
          where: { workspaceId: user.workspaceId },
          orderBy: { createdAt: 'desc' },
        })

        const poNumber = `PO-${new Date().getFullYear()}-${String((lastPO ? parseInt(lastPO.poNumber.split('-')[2]) : 0) + 1).padStart(4, '0')}`

        const po = await prisma.purchaseOrder.create({
          data: {
            ...body,
            poNumber,
            workspaceId: user.workspaceId,
          },
        })

        return NextResponse.json(po, { status: 201 })
      }
    } catch (dbError) {
      console.log('Database connection failed')
    }

    const poNumber = `PO-${new Date().getFullYear()}-0001`

    return NextResponse.json(
      {
        ...body,
        poNumber,
        id: `mock-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: 'workspace-1',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating PO:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
