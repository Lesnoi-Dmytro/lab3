/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `DamageReport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `damagereport` ADD COLUMN `paymentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DamageReport_paymentId_key` ON `DamageReport`(`paymentId`);

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `PaymentDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
