'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { ContractList } from './contract-list'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { ContractForm } from '@/components/forms/contract-form'

export default function ContractsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header title="Contracts" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Contracts</h2>
            <p className="text-sm text-slate-600">Upload and manage vendor contracts</p>
          </div>
          <Button size="lg" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        </div>

        {showForm ? (
          <ContractForm
            onCancel={() => setShowForm(false)}
            onSubmit={(data) => {
              console.log('Contract saved:', data)
              setShowForm(false)
              // TODO: Refresh contracts list
            }}
          />
        ) : (
          <ContractList initialContracts={[]} initialPagination={{ page: 1, limit: 10, total: 0, pages: 1 }} />
        )}
      </div>
    </>
  )
}
