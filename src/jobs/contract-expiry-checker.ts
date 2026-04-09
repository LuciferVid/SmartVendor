import cron from 'node-cron'
import { prisma } from '@/lib/db'
import { sendContractExpiryAlert } from '@/lib/email-server'
import { formatDate } from '@/lib/format'

/**
 * Checks for contracts expiring soon (30, 14, 7 days)
 * Sends alerts to workspace members
 * Runs daily at 8 AM UTC
 */
export function scheduleContractExpiryChecker() {
  // Run at 8 AM UTC every day
  const task = cron.schedule('0 8 * * *', async () => {
    console.log('[ContractExpiryChecker] Running scheduled task...')

    try {
      // Get all active contracts
      const contracts = await prisma.contract.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          vendor: true,
          workspace: {
            include: {
              users: true,
            },
          },
        },
      })

      const now = new Date()
      let checked = 0
      let alerted = 0

      for (const contract of contracts) {
        checked++
        const expiryDate = new Date(contract.endDate)
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Check if contract is expiring in 30, 14, or 7 days
        if ([30, 14, 7].includes(daysUntilExpiry)) {
          // Send alert to all admin and procurement users
          const eligibleUsers = contract.workspace.users.filter(
            (u) => u.role === 'ADMIN' || u.role === 'PROCUREMENT'
          )

          for (const user of eligibleUsers) {
            try {
              await sendContractExpiryAlert(
                user.email,
                contract.title,
                contract.vendor.name,
                formatDate(expiryDate),
                daysUntilExpiry
              )
              alerted++
            } catch (emailError) {
              console.error(
                `Failed to send contract expiry alert to ${user.email}:`,
                emailError
              )
            }
          }

          // Update notification flag on contract
          await prisma.contract.update({
            where: { id: contract.id },
            data: { lastAlertSent: now },
          })
        }
      }

      console.log(
        `[ContractExpiryChecker] Checked ${checked} contracts, sent ${alerted} alerts`
      )
    } catch (error) {
      console.error('[ContractExpiryChecker] Error:', error)
    }
  })

  return task
}

export function stopContractExpiryChecker(task: cron.ScheduledTask) {
  task.stop()
  console.log('[ContractExpiryChecker] Stopped')
}
