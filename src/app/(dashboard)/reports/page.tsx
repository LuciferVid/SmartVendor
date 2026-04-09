'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    {
      title: 'Spend Analysis',
      description: 'Monthly spend trends by vendor',
      icon: '📊',
    },
    {
      title: 'Invoice Aging',
      description: 'Analysis of unpaid invoices by age',
      icon: '📈',
    },
    {
      title: 'Vendor Performance',
      description: 'Scorecard of vendor metrics',
      icon: '⭐',
    },
    {
      title: 'Contract Calendar',
      description: 'View contract expiration dates',
      icon: '📅',
    },
  ]

  return (
    <>
      <Header title="Reports" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Reports & Analytics</h2>
          <p className="text-sm text-slate-600">Track metrics and generate reports</p>
        </div>

        <div className="grid gaps-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.title}>
              <CardBody className="flex items-start gap-4">
                <div className="text-4xl">{report.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{report.title}</h3>
                  <p className="text-sm text-slate-600">{report.description}</p>
                  <Button variant="ghost" size="sm" className="mt-3">
                    <Download className="mr-2 h-4 w-4" />
                    View & Download
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
