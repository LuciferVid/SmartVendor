'use client'

import React from 'react'
import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  title: string
  notificationCount?: number
}

export const Header: React.FC<HeaderProps> = ({
  title,
  notificationCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between bg-white px-6 py-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden w-64 md:block">
            <Input
              type="search"
              placeholder="Search vendors, POs, invoices..."
              className="text-sm"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative rounded-lg p-2 hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />
            {notificationCount > 0 && (
              <span className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
