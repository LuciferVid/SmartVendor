'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { VendorList } from './vendor-list'
import { VendorForm } from '@/components/forms/vendor-form'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Filter, Download } from 'lucide-react'

export default function VendorsPage() {
  const [showForm, setShowForm] = useState(false)
  const [vendors, setVendors] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  const refetch = async (page = 1) => {
    const params = new URLSearchParams({ page: page.toString(), limit: '10' })
    const res = await fetch(`/api/vendors?${params}`)
    const data = await res.json()
    setVendors(data.vendors)
    setPagination(data.pagination)
  }

  React.useEffect(() => {
    refetch()
  }, [])

  return (
    <>
      <Header title="Vendors" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Vendor Management</h2>
            <p className="text-sm text-slate-600">Manage all your suppliers and track performance</p>
          </div>
          <Button size="lg" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
          {showForm && (
            <VendorForm 
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="secondary" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Category
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <VendorList initialVendors={[]} initialPagination={{ page: 1, limit: 10, total: 0, pages: 1 }} />
      </div>
    </>
  )
}
