'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, Trash2 } from 'lucide-react'
import { getDownloadUrl } from '@/lib/supabase-storage'

interface UploadedFile {
  url: string
  path: string
  name: string
  bucket: string
}

interface FileViewerProps {
  files: UploadedFile[]
  onDelete?: (path: string) => void
  showPreview?: boolean
}

export function FileViewer({ files, onDelete, showPreview = true }: FileViewerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handlePreview = async (file: UploadedFile) => {
    if (showPreview) {
      const signedUrl = await getDownloadUrl(file.bucket, file.path)
      setPreviewUrl(signedUrl)
    }
  }

  const handleDownload = async (file: UploadedFile) => {
    const signedUrl = await getDownloadUrl(file.bucket, file.path)
    const a = document.createElement('a')
    a.href = signedUrl
    a.download = file.name
    a.click()
  }

  const handleDelete = (path: string) => {
    if (confirm('Delete this file?')) {
      onDelete?.(path)
    }
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-slate-900">Files ({files.length})</h4>
      {files.length === 0 ? (
        <p className="text-sm text-slate-500">No files uploaded</p>
      ) : (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded border p-3 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                  {file.name}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {file.bucket}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePreview(file)}
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.path)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -right-4 -top-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {previewUrl.endsWith('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg" />
            ) : (
              <img src={previewUrl} className="w-full h-[70vh] object-contain rounded-lg" alt="Preview" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

