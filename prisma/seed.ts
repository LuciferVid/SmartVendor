import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.notification.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.user.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.workspace.deleteMany()

  // Create a sample workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Manufacturing',
      slug: 'acme-manufacturing',
      plan: 'STARTER',
      industry: 'Manufacturing',
      timezone: 'Asia/Kolkata',
    },
  })

  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      clerkId: 'clerk_admin_001',
      email: 'admin@acme.com',
      name: 'John Doe',
      role: 'ADMIN',
      workspaceId: workspace.id,
    },
  })

  const procurementUser = await prisma.user.create({
    data: {
      clerkId: 'clerk_procurement_001',
      email: 'procurement@acme.com',
      name: 'Sarah Smith',
      role: 'PROCUREMENT',
      workspaceId: workspace.id,
    },
  })

  const financeUser = await prisma.user.create({
    data: {
      clerkId: 'clerk_finance_001',
      email: 'finance@acme.com',
      name: 'Mike Johnson',
      role: 'FINANCE',
      workspaceId: workspace.id,
    },
  })

  // Create sample vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Global Steel Suppliers',
      contactName: 'Rajesh Kumar',
      email: 'rajesh@globalsteel.com',
      phone: '+91-9876543210',
      address: '123 Industrial Park, Mumbai, India',
      category: 'Raw Materials',
      gstin: '27ABCDE1234F2Z5',
      rating: 4,
      status: 'ACTIVE',
      tags: JSON.stringify(['steel', 'industrial', 'long-term']),
      totalSpend: 250000,
      workspaceId: workspace.id,
    },
  })

  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'TechParts India',
      contactName: 'Priya Sharma',
      email: 'priya@techparts.com',
      phone: '+91-8765432109',
      address: '456 Tech Hub, Bangalore, India',
      category: 'Components',
      gstin: '29ABCDE1234F2Z5',
      rating: 5,
      status: 'ACTIVE',
      tags: JSON.stringify(['electronics', 'components']),
      totalSpend: 450000,
      workspaceId: workspace.id,
    },
  })

  const vendor3 = await prisma.vendor.create({
    data: {
      name: 'Packaging Solutions Ltd',
      contactName: 'Amit Patel',
      email: 'amit@packaging.com',
      phone: '+91-7654321098',
      address: '789 Commerce Street, Delhi, India',
      category: 'Packaging',
      gstin: '07ABCDE1234F2Z5',
      rating: 3,
      status: 'ACTIVE',
      tags: JSON.stringify(['packaging', 'eco-friendly']),
      totalSpend: 120000,
      workspaceId: workspace.id,
    },
  })

  const vendor4 = await prisma.vendor.create({
    data: {
      name: 'Quality Logistics',
      contactName: 'David Chen',
      email: 'david@qlogistics.com',
      phone: '+91-6543210987',
      address: '321 Warehouse Ave, Chennai, India',
      category: 'Services',
      rating: 4,
      status: 'ACTIVE',
      tags: JSON.stringify(['logistics', 'delivery']),
      totalSpend: 850000,
      workspaceId: workspace.id,
    },
  })

  const vendor5 = await prisma.vendor.create({
    data: {
      name: 'Innovation Labs',
      contactName: 'Lisa Wong',
      email: 'lisa@innovationlabs.com',
      phone: '+91-5432109876',
      address: '555 R&D Park, Pune, India',
      category: 'Consulting',
      rating: 2,
      status: 'INACTIVE',
      tags: JSON.stringify(['consulting', 'design']),
      totalSpend: 45000,
      workspaceId: workspace.id,
    },
  })

  // Create sample contracts
  const today = new Date()
  const contract1 = await prisma.contract.create({
    data: {
      title: 'Annual Steel Supply Agreement',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2025, 0, 1),
      value: 500000,
      currency: 'INR',
      status: 'ACTIVE',
      tags: JSON.stringify(['annual', 'steel', 'strategic']),
      vendorId: vendor1.id,
      workspaceId: workspace.id,
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      title: 'Electronics Supply Contract',
      startDate: new Date(2024, 6, 1),
      endDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      value: 750000,
      currency: 'INR',
      status: 'EXPIRING_SOON',
      tags: JSON.stringify(['components', 'tech']),
      vendorId: vendor2.id,
      workspaceId: workspace.id,
    },
  })

  // Create sample purchase orders
  const po1 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2024-0001',
      items: JSON.stringify([
        { name: 'Steel Coils', qty: 50, unitPrice: 2000 },
        { name: 'Steel Plates', qty: 30, unitPrice: 1500 },
      ]),
      subtotal: 145000,
      tax: 26100,
      total: 171100,
      status: 'APPROVED',
      approvedBy: adminUser.id,
      vendorId: vendor1.id,
      workspaceId: workspace.id,
    },
  })

  const po2 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2024-0002',
      items: JSON.stringify([
        { name: 'Microcontroller Units', qty: 100, unitPrice: 500 },
        { name: 'Capacitors', qty: 500, unitPrice: 50 },
      ]),
      subtotal: 75000,
      tax: 13500,
      total: 88500,
      status: 'PENDING_APPROVAL',
      vendorId: vendor2.id,
      workspaceId: workspace.id,
    },
  })

  const po3 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2024-0003',
      items: JSON.stringify([
        { name: 'Corrugated Boxes', qty: 1000, unitPrice: 100 },
      ]),
      subtotal: 100000,
      tax: 18000,
      total: 118000,
      status: 'DRAFT',
      vendorId: vendor3.id,
      workspaceId: workspace.id,
    },
  })

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      amount: 171100,
      dueDate: new Date(2024, 3, 15),
      status: 'PAID',
      paidAt: new Date(2024, 3, 10),
      paymentReference: 'TXN-20240410-001',
      vendorId: vendor1.id,
      poId: po1.id,
      workspaceId: workspace.id,
    },
  })

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-002',
      amount: 88500,
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'UNPAID',
      vendorId: vendor2.id,
      poId: po2.id,
      workspaceId: workspace.id,
    },
  })

  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-003',
      amount: 98500,
      dueDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days overdue
      status: 'OVERDUE',
      vendorId: vendor3.id,
      workspaceId: workspace.id,
    },
  })

  // Create sample notifications
  await prisma.notification.create({
    data: {
      type: 'CONTRACT_EXPIRY',
      message: 'Electronics Supply Contract expiring in 20 days',
      link: `/contracts/${contract2.id}`,
      userId: adminUser.id,
      workspaceId: workspace.id,
    },
  })

  await prisma.notification.create({
    data: {
      type: 'INVOICE_DUE',
      message: 'Invoice INV-2024-003 is overdue by 10 days',
      link: `/invoices/${invoice3.id}`,
      userId: financeUser.id,
      workspaceId: workspace.id,
    },
  })

  console.log('✅ Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
