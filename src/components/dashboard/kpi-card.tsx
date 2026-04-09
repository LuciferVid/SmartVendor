'use client'

import React from 'react'
import { Card, CardBody } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPIProps {
  title: string
  value: string | number
  change: string
  period: string
  icon: LucideIcon
  color: string
}

export function KpiCard({ title, value, change, period, icon: Icon, color }: KPIProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {change}
              </span>{' '}
              {period}
            </p>
          </div>
          <div className={cn('rounded-lg p-3 text-white', color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
