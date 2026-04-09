/**
 * Helper functions to send various emails via Resend
 * Accessible only from API routes and server-side code
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendContractExpiryAlert = async (
  email: string,
  contractName: string,
  vendor: string,
  expiryDate: string,
  daysUntilExpiry: number
) => {
  try {
    const result = await resend.emails.send({
      from: 'SmartVendor <alerts@smartvendor.app>',
      to: email,
      subject: `Alert: Contract "${contractName}" expiring in ${daysUntilExpiry} days`,
      html: `
        <h2>Contract Expiring Soon</h2>
        <p>The contract <strong>${contractName}</strong> with <strong>${vendor}</strong> expires on <strong>${expiryDate}</strong>.</p>
        <p>You have ${daysUntilExpiry} days to prepare for renewal or renegotiation.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/contracts">Review Contract</a></p>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send contract expiry alert:', error)
    throw error
  }
}

export const sendInvoiceOverdueReminder = async (
  email: string,
  invoiceNumber: string,
  vendor: string,
  amount: string,
  daysOverdue: number,
  dueDate: string
) => {
  try {
    const result = await resend.emails.send({
      from: 'SmartVendor <alerts@smartvendor.app>',
      to: email,
      subject: `Payment Reminder: Invoice #${invoiceNumber} from ${vendor}`,
      html: `
        <h2>Payment Reminder</h2>
        <p><strong>Invoice #${invoiceNumber}</strong></p>
        <p>Vendor: ${vendor}</p>
        <p>Amount: ${amount}</p>
        <p>Status: <span style="color: red; font-weight: bold;">OVERDUE (${daysOverdue} days)</span></p>
        <p>Due Date: ${dueDate}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/invoices">View Invoice</a></p>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send invoice overdue reminder:', error)
    throw error
  }
}

export const sendTeamInvitation = async (
  email: string,
  invitedBy: string,
  invitedByCompany: string,
  role: string,
  inviteLink: string
) => {
  try {
    const result = await resend.emails.send({
      from: 'SmartVendor <invites@smartvendor.app>',
      to: email,
      subject: `You're invited to join ${invitedByCompany} on SmartVendor`,
      html: `
        <h2>You're Invited to SmartVendor</h2>
        <p><strong>${invitedBy}</strong> from <strong>${invitedByCompany}</strong> has invited you to join their team.</p>
        <p>Role: <strong>${role}</strong></p>
        <p><a href="${inviteLink}">Accept Invitation</a></p>
        <p>This invitation expires in 30 days.</p>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send team invitation:', error)
    throw error
  }
}

export const sendWeeklyDigest = async (
  email: string,
  weekStartDate: string,
  weekEndDate: string,
  totalSpend: string,
  topVendor: string,
  topVendorSpend: string,
  overduInvoices: number,
  expiringContracts: number,
  newPOs: number
) => {
  try {
    const result = await resend.emails.send({
      from: 'SmartVendor <digest@smartvendor.app>',
      to: email,
      subject: 'Your Weekly Vendor Management Summary',
      html: `
        <h2>Weekly Vendor Management Summary</h2>
        <p>Week of ${weekStartDate} – ${weekEndDate}</p>
        
        <h3>Key Metrics</h3>
        <ul>
          <li>Total Spend: <strong>${totalSpend}</strong></li>
          <li>Top Vendor: <strong>${topVendor}</strong> (${topVendorSpend})</li>
          <li>Overdue Invoices: <strong>${overduInvoices}</strong></li>
          <li>Expiring Contracts: <strong>${expiringContracts}</strong></li>
          <li>New Purchase Orders: <strong>${newPOs}</strong></li>
        </ul>
        
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Full Dashboard</a></p>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send weekly digest:', error)
    throw error
  }
}
