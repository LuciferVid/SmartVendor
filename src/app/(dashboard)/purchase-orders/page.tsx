'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { POLIst } from './po-list'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Filter, Download } from 'lucide-react'
import { POForm } from '@/components/forms/po-form'

export default function PurchaseOrdersPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header title="Purchase Orders" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Purchase Orders</h2>
            <p className="text-sm text-slate-600">Create and track purchase orders</p>
          </div>
          <Button size="lg" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        </div>

        {showForm ? (
          <POForm
            onCancel={() => setShowForm(false)}
            onSubmit={(data) => {
              console.log('Purchase Order saved:', data)
              setShowForm(false)
            }}
          />
        ) : (
          <POLIst initialPOs={[]} initialPagination={{ page: 1, limit: 10, total: 0, pages: 1 }} />
        )}
      </div>
    </>
  )
}
