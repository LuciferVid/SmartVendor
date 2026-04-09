'use client'

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { POForm } from '@/components/forms/po-form'
import { useState } from 'react'
import type { PurchaseOrder } from '@prisma/client'

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface POLIstProps {
  initialPOs: PurchaseOrder[]
  initialPagination: Pagination
}

export function POLIst({ initialPOs, initialPagination }: POLIstProps) {
  const [pos, setPOs] = useState(initialPOs)
  const [pagination, setPagination] = useState(initialPagination)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingPO, setEditingPO] = useState<any>(null)

  const columns = [
    {
      accessorKey: 'poNumber',
      header: 'PO Number',
    },
    {
      accessorKey: 'vendor.name',
      header: 'Vendor',
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }: any) => `$${row.original.total.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'APPROVED' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingPO(row.original)
              setShowForm(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Delete PO?')) {
                const res = await fetch(`/api/purchase-orders/${row.original.id}`, { method: 'DELETE' })
                if (res.ok) {
                  setPOs(pos.filter(p => p.id !== row.original.id))
                }
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const refetch = async (newPage = page) => {
    const params = new URLSearchParams({ page: newPage.toString(), limit: '10' })
    const res = await fetch(`/api/purchase-orders?${params}`)
    const { pos: newPOs, pagination: newPagination } = await res.json()
    setPOs(newPOs)
    setPagination(newPagination)
  }

  return (
    <div>
      {showForm && (
        <POForm
          initialData={editingPO}
          onCancel={() => {
            setShowForm(false)
            setEditingPO(null)
          }}
          onSubmit={() => {
            setShowForm(false)
            setEditingPO(null)
            refetch()
          }}
        />
      )}
      <DataTable
        columns={columns}
        data={pos}
        pageCount={pagination.pages}
        currentPage={pagination.page}
        onPageChange={(p) => {
          setPage(p)
          refetch(p)
        }}
      />
    </div>
  )
}
