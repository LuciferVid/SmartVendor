import cron from 'node-cron'
import { prisma } from '@/lib/db'
import { sendInvoiceOverdueReminder } from '@/lib/email-server'
import { formatCurrency, formatDate } from '@/lib/format'

/**
 * Checks for overdue invoices and sends reminders
 * Marks invoices as OVERDUE if past due date
 * Sends escalating alerts (1, 7, 14, 30 days overdue)
 * Runs daily at 9 AM UTC
 */
export function scheduleInvoiceOverdueChecker() {
  // Run at 9 AM UTC every day
  const task = cron.schedule('0 9 * * *', async () => {
    console.log('[InvoiceOverdueChecker] Running scheduled task...')

    try {
      // Get all unpaid and overdue invoices
      const invoices = await prisma.invoice.findMany({
        where: {
          status: {
            in: ['UNPAID', 'OVERDUE'],
          },
        },
        include: {
          vendor: true,
          po: {
            include: {
              workspace: {
                include: {
                  users: true,
                },
              },
            },
          },
        },
      })

      const now = new Date()
      let checked = 0
      let updated = 0
      let alerted = 0

      for (const invoice of invoices) {
        checked++
        const dueDate = new Date(invoice.dueDate)
        const daysOverdue = Math.ceil(
          (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Update status to OVERDUE if past due date
        if (invoice.status === 'UNPAID' && daysOverdue > 0) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'OVERDUE' },
          })
          updated++
        }

        // Send alerts at 1, 7, 14, 30 days overdue
        if (
          (invoice.status === 'OVERDUE' || daysOverdue > 0) &&
          [1, 7, 14, 30].includes(daysOverdue)
        ) {
          const workspace = invoice.po?.workspace
          if (!workspace) continue

          // Send alert to finance users
          const financeUsers = workspace.users.filter((u) => u.role === 'FINANCE')

          for (const user of financeUsers) {
            try {
              await sendInvoiceOverdueReminder(
                user.email,
                invoice.invoiceNumber,
                invoice.vendor.name,
                formatCurrency(invoice.amount),
                daysOverdue,
                formatDate(dueDate)
              )
              alerted++
            } catch (emailError) {
              console.error(
                `Failed to send invoice overdue reminder to ${user.email}:`,
                emailError
              )
            }
          }

          // Update notification timestamp
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { lastReminderSent: now },
          })
        }
      }

      console.log(
        `[InvoiceOverdueChecker] Checked ${checked} invoices, updated ${updated}, sent ${alerted} alerts`
      )
    } catch (error) {
      console.error('[InvoiceOverdueChecker] Error:', error)
    }
  })

  return task
}

export function stopInvoiceOverdueChecker(task: cron.ScheduledTask) {
  task.stop()
  console.log('[InvoiceOverdueChecker] Stopped')
}
