import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    let workspaceId: string | null = null

    // Get workspace from auth
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })
      workspaceId = user?.workspaceId || null
    }

    if (!workspaceId) {
      const workspace = await prisma.workspace.findFirst()
      workspaceId = workspace?.id || null
    }

    if (!workspaceId) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    // Stats queries
    const [vendorsCount, activePOsCount, overdueInvoicesCount, expiringContractsCount] = await Promise.all([
      prisma.vendor.count({ where: { workspaceId } }),
      prisma.purchaseOrder.count({ where: { workspaceId, status: 'APPROVED' } }),
      prisma.invoice.count({ 
        where: { 
          workspaceId, 
          status: 'UNPAID',
          dueDate: { lt: new Date() }
        } 
      }),
      prisma.contract.count({ 
        where: { 
          workspaceId, 
          status: 'ACTIVE',
          endDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
        } 
      }),
    ])

    const totalRevenue = await prisma.invoice.aggregate({
      where: { workspaceId, status: 'PAID' },
      _sum: { amount: true }
    })

    return NextResponse.json({
      vendorsCount,
      activePOsCount,
      overdueInvoicesCount,
      expiringContractsCount,
      totalRevenue: totalRevenue._sum.amount || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
