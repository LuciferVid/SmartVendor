'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  ShoppingCart,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    vendorsCount: 0,
    activePOsCount: 0,
    overdueInvoicesCount: 0,
    expiringContractsCount: 0,
    totalRevenue: 0,
  })

  React.useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)
  }, [])
    {
      title: 'Total Vendors',
      value: '24',
      change: '+3',
      period: 'this month',
      icon: 'Users',
      color: 'bg-blue-500',
    },
    {
      title: 'Active POs',
      value: '12',
      change: '₹4.2L',
      period: 'total value',
      icon: 'ShoppingCart' ,
      color: 'bg-green-500',
    },
    {
      title: 'Overdue Invoices',
      value: '3',
      change: '₹1.8L',
      period: 'total amount',
      icon: 'AlertCircle',
      color: 'bg-red-500',
    },
    {
      title: 'Contracts Expiring',
      value: '2',
      change: 'in 30 days',
      period: 'warning',
      icon: 'FileText',
      color: 'bg-amber-500',
    },
  ]

  return (
    <>
      <Header title="Dashboard" notificationCount={2} />
      <div className="space-y-8 px-6 py-8">
        {/* Getting Started Banner */}
        <Card className="border-amber-200 bg-amber-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-amber-900">
                  Welcome to SmartVendor! 👋
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  Set up your workspace in 5 minutes. Complete these steps to get started:
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <input type="checkbox" className="rounded" />
                    <span>Add your first vendor</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <input type="checkbox" className="rounded" />
                    <span>Create a purchase order</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <input type="checkbox" className="rounded" />
                    <span>Upload a contract</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <input type="checkbox" className="rounded" />
                    <span>Invite team members</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Dismiss
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Vendors"
            value={stats.vendorsCount}
            change="+12%"
            period="this month"
            icon={Users}
            color="bg-blue-500"
          />
          <KpiCard
            title="Active POs"
            value={stats.activePOsCount}
            change="₹4.2L"
            period="total value"
            icon={ShoppingCart}
            color="bg-green-500"
          />
          <KpiCard
            title="Overdue Invoices"
            value={stats.overdueInvoicesCount}
            change="₹1.8L"
            period="total amount"
            icon={AlertCircle}
            color="bg-red-500"
          />
          <KpiCard
            title="Expiring Contracts"
            value={stats.expiringContractsCount}
            change="in 30 days"
            period="warning"
            icon={FileText}
            color="bg-amber-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    {
                      type: 'vendor',
                      title: 'New vendor added',
                      description: 'TechParts India',
                      time: '2 hours ago',
                    },
                    {
                      type: 'po',
                      title: 'PO approved',
                      description: 'PO-2024-0002 by Admin',
                      time: '4 hours ago',
                    },
                    {
                      type: 'invoice',
                      title: 'Invoice overdue',
                      description: 'INV-2024-003 from Packaging Solutions',
                      time: '1 day ago',
                    },
                    {
                      type: 'contract',
                      title: 'Contract expiring soon',
                      description: 'Electronics Supply Agreement - 20 days left',
                      time: '2 days ago',
                    },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4 w-full">
                  View all activity
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Top Vendors */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button className="w-full" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
                <Button variant="secondary" className="w-full" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create PO
                </Button>
                <Button variant="secondary" className="w-full" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Invoice
                </Button>
              </CardBody>
            </Card>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900">Top Vendors by Spend</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { name: 'Quality Logistics', amount: '₹8.5L', percent: 45 },
                    { name: 'TechParts India', amount: '₹4.5L', percent: 24 },
                    { name: 'Global Steel', amount: '₹2.5L', percent: 13 },
                    { name: 'Packaging Solutions', amount: '₹2.3L', percent: 12 },
                    { name: 'Innovation Labs', amount: '₹0.5L', percent: 6 },
                  ].map((vendor, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">
                          {vendor.name}
                        </span>
                        <span className="text-sm text-slate-600">
                          {vendor.amount}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${vendor.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-900">
              Upcoming Deadlines (Next 30 Days)
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Vendor
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type: 'Invoice',
                      name: 'INV-2024-002',
                      vendor: 'TechParts India',
                      date: '12 Apr 2024',
                      status: 'UNPAID',
                      statusBg: 'bg-amber-100 text-amber-800',
                    },
                    {
                      type: 'Contract',
                      name: 'Electronics Supply',
                      vendor: 'TechParts India',
                      date: '27 Apr 2024',
                      status: 'EXPIRING',
                      statusBg: 'bg-orange-100 text-orange-800',
                    },
                    {
                      type: 'Invoice',
                      name: 'INV-2024-004',
                      vendor: 'Global Steel',
                      date: '5 May 2024',
                      status: 'UNPAID',
                      statusBg: 'bg-amber-100 text-amber-800',
                    },
                  ].map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-900">{item.type}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.vendor}</td>
                      <td className="px-4 py-3 text-slate-600">{item.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.status === 'UNPAID' ? 'warning' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
