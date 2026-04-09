'use client'

import React from 'react'
import { clsx } from 'clsx'

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('w-full', className)} {...props} />
  )
)
Tabs.displayName = 'Tabs'

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex gap-2 border-b border-slate-200', className)}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none border-b-2 border-transparent hover:border-slate-300',
        'data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600',
        className
      )}
      data-trigger={value}
      {...props}
    />
  )
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('w-full', className)}
      data-content={value}
      {...props}
    />
  )
)
TabsContent.displayName = 'TabsContent'
