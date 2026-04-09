'use client'

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VendorForm } from '@/components/forms/vendor-form'
import { useState } from 'react'
import type { Vendor } from '@prisma/client'

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface VendorListProps {
  initialVendors: Vendor[]
  initialPagination: Pagination
}

export function VendorList({ initialVendors, initialPagination }: VendorListProps) {
  const [vendors, setVendors] = useState(initialVendors)
  const [pagination, setPagination] = useState(initialPagination)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<any>(null)

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`text-xs ${row.original.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingVendor(row.original)
              setShowForm(true)
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Delete vendor?')) {
                const res = await fetch(`/api/vendors/${row.original.id}`, { method: 'DELETE' })
                if (res.ok) {
                  setVendors(vendors.filter(v => v.id !== row.original.id))
                }
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const refetch = async (newPage = page) => {
    const params = new URLSearchParams({ page: newPage.toString(), limit: '10' })
    const res = await fetch(`/api/vendors?${params}`)
    const { vendors: newVendors, pagination: newPagination } = await res.json()
    setVendors(newVendors)
    setPagination(newPagination)
  }

  return (
    <div>
      {showForm && (
        <VendorForm
          vendor={editingVendor || undefined}
          onSuccess={() => {
            setShowForm(false)
            setEditingVendor(null)
            refetch()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingVendor(null)
          }}
        />
      )}
      <DataTable
        columns={columns}
        data={vendors}
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
