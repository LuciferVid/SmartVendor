'use client'

import React, { useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface POFormData {
  poNumber: string
  vendorId: string
  issueDate: string
  deliveryDate: string
  status: string
  lineItems: LineItem[]
  shippingAddress: string
  notes: string
  fileUrls?: string[]
  filePaths?: string[]
}

interface POFormProps {
  onSubmit?: (data: POFormData) => void
  onCancel?: () => void
  initialData?: Partial<POFormData>
}

export function POForm({ onSubmit, onCancel, initialData }: POFormProps) {
  const [formData, setFormData] = useState<POFormData>({
    poNumber: initialData?.poNumber || '',
    vendorId: initialData?.vendorId || '',
    issueDate: initialData?.issueDate || '',
    deliveryDate: initialData?.deliveryDate || '',
    status: initialData?.status || 'draft',
    lineItems: initialData?.lineItems || [
      { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 },
    ],
    shippingAddress: initialData?.shippingAddress || '',
    notes: initialData?.notes || '',
    fileUrls: initialData?.fileUrls,
    filePaths: initialData?.filePaths,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; path: string; name: string }[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedLineItems = formData.lineItems.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }))

      const totalAmount = updatedLineItems.reduce((sum, item) => sum + item.total, 0)

      const poData = {
        ...formData,
        lineItems: updatedLineItems,
        totalAmount,
      }

      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poData),
      })
      if (!res.ok) throw new Error('Failed to create PO')
      toast.success('PO created successfully')
      onSubmit?.(poData)
    } catch (error) {
      toast.error('Failed to save PO')
      console.error('Failed to save purchase order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof POFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 },
      ],
    }))
  }

  const removeLineItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleFileUploaded = (url: string, path: string, name: string) => {
    setUploadedFiles((prev) => [...prev, { url, path, name }])
    setFormData((prev) => ({
      ...prev,
      fileUrls: [...(prev.fileUrls || []), url],
      filePaths: [...(prev.filePaths || []), path],
    }))
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      fileUrls: prev.fileUrls?.filter((_, i) => i !== index),
      filePaths: prev.filePaths?.filter((_, i) => i !== index),
    }))
  }

  const totalAmount = formData.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900">Purchase Order Details</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* PO Number */}
          <div className="space-y-2">
            <label htmlFor="poNumber" className="block text-sm font-medium text-slate-700">
              PO Number *
            </label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => handleChange('poNumber', e.target.value)}
              placeholder="e.g., PO-2026-001"
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
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700">
                Issue Date *
              </label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleChange('issueDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-slate-700">
                Expected Delivery *
              </label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleChange('deliveryDate', e.target.value)}
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
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Items</label>
              <Button type="button" variant="secondary" size="sm" onClick={addLineItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.lineItems.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, 'description', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(item.id, 'quantity', Number(e.target.value))
                      }
                      min="1"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateLineItem(item.id, 'unitPrice', Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="w-24 text-right font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="rounded p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t pt-3">
              <div className="text-lg font-semibold">
                Total: ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2">
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-slate-700">
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => handleChange('shippingAddress', e.target.value)}
              placeholder="Enter delivery address..."
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional instructions or comments..."
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Attachments
            </label>
            <FileUpload
              bucket="purchase-orders"
              type="po"
              entityId={formData.vendorId}
              onFileUploaded={(url, path) => handleFileUploaded(url, path, '')}
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              label="Upload PO document"
              helpText="Supported: PDF, DOC, XLS • Max 50MB"
            />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border bg-slate-50 p-2"
                  >
                    <span className="text-sm text-slate-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Purchase Order'}
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
