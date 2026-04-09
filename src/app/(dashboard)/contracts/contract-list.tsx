'use client'

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContractForm } from '@/components/forms/contract-form'
import { useState } from 'react'
import type { Contract } from '@prisma/client'

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface ContractListProps {
  initialContracts: Contract[]
  initialPagination: Pagination
}

export function ContractList({ initialContracts, initialPagination }: ContractListProps) {
  const [contracts, setContracts] = useState(initialContracts)
  const [pagination, setPagination] = useState(initialPagination)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingContract, setEditingContract] = useState<any>(null)

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'vendor.name',
      header: 'Vendor',
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }: any) => `$${row.original.value.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}>
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
              setEditingContract(row.original)
              setShowForm(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Delete contract?')) {
                const res = await fetch(`/api/contracts/${row.original.id}`, { method: 'DELETE' })
                if (res.ok) {
                  setContracts(contracts.filter(c => c.id !== row.original.id))
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
    const res = await fetch(`/api/contracts?${params}`)
    const { contracts: newContracts, pagination: newPagination } = await res.json()
    setContracts(newContracts)
    setPagination(newPagination)
  }

  return (
    <div>
      {showForm && (
        <ContractForm
          initialData={editingContract}
          onCancel={() => {
            setShowForm(false)
            setEditingContract(null)
          }}
          onSubmit={() => {
            setShowForm(false)
            setEditingContract(null)
            refetch()
          }}
        />
      )}
      <DataTable
        columns={columns}
        data={contracts}
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
