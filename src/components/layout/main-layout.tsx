'use client'

import React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  workspaceName?: string
  plan?: string
  notificationCount?: number
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  workspaceName,
  plan,
  notificationCount,
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar workspaceName={workspaceName} plan={plan} />
      <div className="flex flex-1 flex-col md:ml-0">
        <Header title={title} notificationCount={notificationCount} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
