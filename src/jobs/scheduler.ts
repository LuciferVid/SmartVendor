import cron from 'node-cron'
import { scheduleContractExpiryChecker } from './contract-expiry-checker'
import { scheduleInvoiceOverdueChecker } from './invoice-overdue-checker'

let contractExpiryTask: cron.ScheduledTask | null = null
let invoiceOverdueTask: cron.ScheduledTask | null = null

/**
 * Initialize all scheduled background jobs
 * Should be called once during application startup
 */
export function initializeJobs() {
  console.log('[JobScheduler] Initializing background jobs...')

  try {
    // Schedule contract expiry checker (8 AM UTC daily)
    contractExpiryTask = scheduleContractExpiryChecker()
    console.log('[JobScheduler] Contract expiry checker scheduled')

    // Schedule invoice overdue checker (9 AM UTC daily)
    invoiceOverdueTask = scheduleInvoiceOverdueChecker()
    console.log('[JobScheduler] Invoice overdue checker scheduled')

    console.log('[JobScheduler] All background jobs initialized successfully')
  } catch (error) {
    console.error('[JobScheduler] Failed to initialize jobs:', error)
  }
}

/**
 * Gracefully shutdown all scheduled jobs
 * Should be called on application termination
 */
export function shutdownJobs() {
  console.log('[JobScheduler] Shutting down background jobs...')

  try {
    if (contractExpiryTask) {
      contractExpiryTask.stop()
      console.log('[JobScheduler] Contract expiry checker stopped')
    }

    if (invoiceOverdueTask) {
      invoiceOverdueTask.stop()
      console.log('[JobScheduler] Invoice overdue checker stopped')
    }

    console.log('[JobScheduler] All background jobs stopped')
  } catch (error) {
    console.error('[JobScheduler] Error shutting down jobs:', error)
  }
}

// Export for testing/debugging
export const _internal = {
  getContractExpiryTask: () => contractExpiryTask,
  getInvoiceOverdueTask: () => invoiceOverdueTask,
}
