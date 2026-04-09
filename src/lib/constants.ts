export const APP_NAME = 'SmartVendor'
export const APP_DESCRIPTION = 'Vendor & Supplier Management Platform'

export const PLAN_LIMITS = {
  STARTER: {
    vendors: 10,
    hasApiAccess: false,
    hasExport: false,
    maxStorage: 1, // GB
  },
  GROWTH: {
    vendors: 50,
    hasApiAccess: false,
    hasExport: true,
    maxStorage: 10,
  },
  ENTERPRISE: {
    vendors: Infinity,
    hasApiAccess: true,
    hasExport: true,
    maxStorage: 100,
  },
}

export const VENDOR_CATEGORIES = [
  'Raw Materials',
  'Components',
  'Packaging',
  'Services',
  'Consulting',
  'Logistics',
  'Technology',
  'Office Supplies',
  'Other',
]

export const INDUSTRIES = [
  'Manufacturing',
  'Retail',
  'E-commerce',
  'Agency',
  'Consulting',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Other',
]

export const USER_ROLES = {
  ADMIN: 'Administrator',
  PROCUREMENT: 'Procurement Officer',
  FINANCE: 'Finance Manager',
}

export const VENDOR_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  BLACKLISTED: 'bg-red-100 text-red-800',
}

export const PO_STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  SENT: 'bg-indigo-100 text-indigo-800',
  FULFILLED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export const INVOICE_STATUS_COLORS = {
  UNPAID: 'bg-amber-100 text-amber-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-purple-100 text-purple-800',
}

export const CONTRACT_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  EXPIRING_SOON: 'bg-amber-100 text-amber-800',
  EXPIRED: 'bg-red-100 text-red-800',
}

export const DASHBOARD_CHECKLIST = [
  { id: 'vendor', label: 'Add your first vendor', path: '/vendors' },
  { id: 'po', label: 'Create a purchase order', path: '/purchase-orders' },
  { id: 'contract', label: 'Upload a contract', path: '/contracts' },
  { id: 'team', label: 'Invite a team member', path: '/settings/team' },
]

export const NOTIFICATION_TYPES = {
  CONTRACT_EXPIRY: 'Contract Expiry',
  INVOICE_DUE: 'Invoice Due',
  PO_APPROVAL: 'PO Approval',
  PO_CREATED: 'PO Created',
  VENDOR_ADDED: 'Vendor Added',
}
