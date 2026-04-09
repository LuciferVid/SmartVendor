'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Star } from 'lucide-react'
import { toast } from 'sonner' // Assume shadcn toast available or add

interface VendorFormData {
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  category: string
  gstin: string
  rating: number
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED'
  tags: string[]
  notes: string
}

interface VendorFormProps {
  vendor?: Partial<VendorFormData> | null
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export function VendorForm({ vendor, onSuccess, onCancel, mode = 'create' }: VendorFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; path: string; name: string }[]>([])
  const [formData, setFormData] = useState<VendorFormData>({
    name: vendor?.name || '',
    contactName: vendor?.contactName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    category: vendor?.category || '',
    gstin: vendor?.gstin || '',
    rating: vendor?.rating || 3,
    status: (vendor?.status as any) || 'ACTIVE',
    tags: [],
    notes: vendor?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const submitData = { ...formData }

        const method = mode === 'edit' ? 'PUT' : 'POST'
        const url = mode === 'edit' ? `/api/vendors/${vendor?.id}` : '/api/vendors'

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        })

        if (!res.ok) throw new Error('Failed to save vendor')

        toast.success(mode === 'create' ? 'Vendor created' : 'Vendor updated')
        onSuccess?.()
        if (mode === 'create') router.refresh()
      } catch (error) {
        toast.error('Error saving vendor')
        console.error(error)
      }
    })
  }

  const handleChange = (field: keyof VendorFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUploaded = (url: string, path: string, name: string) => {
    setUploadedFiles(prev => [...prev, { url, path, name }])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'New Vendor' : 'Edit Vendor'}</CardTitle>
          <CardDescription>Enter vendor details</CardDescription>
        </CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vendor Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., IT Services"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GSTIN</label>
            <Input
              value={formData.gstin}
              onChange={(e) => handleChange('gstin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange('rating', star)}
                  className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="h-5 w-5" fill={formData.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span className="ml-2 text-sm">({formData.rating}/5)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(v) => handleChange('status', v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Additional notes..."
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Vendor'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
