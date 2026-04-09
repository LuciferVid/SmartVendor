'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { InvoiceList } from './invoice-list'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Filter, Upload } from 'lucide-react'
import { InvoiceForm } from '@/components/forms/invoice-form'

export default function InvoicesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header title="Invoices" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Invoices</h2>
            <p className="text-sm text-slate-600">Manage supplier invoices</p>
          </div>
          <Button size="lg" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Invoice
          </Button>
        </div>

        {showForm ? (
          <InvoiceForm
            onCancel={() => setShowForm(false)}
            onSubmit={(data) => {
              console.log('Invoice saved:', data)
              setShowForm(false)
            }}
          />
        ) : (
          <InvoiceList initialInvoices={[]} initialPagination={{ page: 1, limit: 10, total: 0, pages: 1 }} />
        )}
      </div>
    </>
  )
}
