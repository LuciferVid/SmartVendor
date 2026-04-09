-- AlterTable
ALTER TABLE "contracts" ADD COLUMN "expiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "lastAlertSent" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "lastReminderSent" TIMESTAMP(3);
