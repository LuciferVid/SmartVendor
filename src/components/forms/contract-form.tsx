'use client'

import React, { useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface ContractFormData {
  title: string
  vendorId: string
  value: string
  startDate: string
  endDate: string
  status: string
  description: string
  fileUrl?: string
  filePath?: string
}

interface ContractFormProps {
  onSubmit?: (data: ContractFormData) => void
  onCancel?: () => void
  initialData?: Partial<ContractFormData>
}

export function ContractForm({ onSubmit, onCancel, initialData }: ContractFormProps) {
  const [formData, setFormData] = useState<ContractFormData>({
    title: initialData?.title || '',
    vendorId: initialData?.vendorId || '',
    value: initialData?.value || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status || 'draft',
    description: initialData?.description || '',
    fileUrl: initialData?.fileUrl,
    filePath: initialData?.filePath,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to create contract')
      toast.success('Contract created successfully')
      onSubmit?.(formData)
    } catch (error) {
      toast.error('Failed to save contract')
      console.error('Failed to save contract:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ContractFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUploaded = (url: string, path: string) => {
    setFormData((prev) => ({ ...prev, fileUrl: url, filePath: path }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900">Contract Details</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Contract Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Software License Agreement 2026"
              required
            />
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <label htmlFor="vendor" className="block text-sm font-medium text-slate-700">
              Vendor *
            </label>
            <select
              id="vendor"
              value={formData.vendorId}
              onChange={(e) => handleChange('vendorId', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a vendor</option>
              <option value="1">Acme Corporation</option>
              <option value="2">TechSupply Inc</option>
              <option value="3">Global Services Ltd</option>
              <option value="4">DataFlow Systems</option>
              <option value="5">CloudNet Solutions</option>
            </select>
          </div>

          {/* Contract Value */}
          <div className="space-y-2">
            <label htmlFor="value" className="block text-sm font-medium text-slate-700">
              Contract Value *
            </label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                Start Date *
              </label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
                End Date *
              </label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the contract terms and conditions..."
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Contract Document
            </label>
            <FileUpload
              bucket="contracts"
              type="contract"
              entityId={formData.vendorId}
              onFileUploaded={handleFileUploaded}
              accept=".pdf,.doc,.docx"
              label="Upload contract document"
              helpText="Supported formats: PDF, DOC, DOCX • Max 50MB"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Contract'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </form>
  )
}
