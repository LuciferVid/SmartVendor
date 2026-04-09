'use client'

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InvoiceForm } from '@/components/forms/invoice-form'
import { useState } from 'react'
import type { Invoice } from '@prisma/client'

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface InvoiceListProps {
  initialInvoices: Invoice[]
  initialPagination: Pagination
}

export function InvoiceList({ initialInvoices, initialPagination }: InvoiceListProps) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [pagination, setPagination] = useState(initialPagination)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)

  const columns = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
    },
    {
      accessorKey: 'vendor.name',
      header: 'Vendor',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => `$${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'PAID' ? 'default' : row.original.status === 'OVERDUE' ? 'warning' : 'secondary'}>
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
              setEditingInvoice(row.original)
              setShowForm(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Delete invoice?')) {
                const res = await fetch(`/api/invoices/${row.original.id}`, { method: 'DELETE' })
                if (res.ok) {
                  setInvoices(invoices.filter(i => i.id !== row.original.id))
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
    const res = await fetch(`/api/invoices?${params}`)
    const { invoices: newInvoices, pagination: newPagination } = await res.json()
    setInvoices(newInvoices)
    setPagination(newPagination)
  }

  return (
    <div>
      {showForm && (
        <InvoiceForm
          initialData={editingInvoice}
          onCancel={() => {
            setShowForm(false)
            setEditingInvoice(null)
          }}
          onSubmit={() => {
            setShowForm(false)
            setEditingInvoice(null)
            refetch()
          }}
        />
      )}
      <DataTable
        columns={columns}
        data={invoices}
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
