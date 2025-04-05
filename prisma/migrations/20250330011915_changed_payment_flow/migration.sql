/*
  Warnings:

  - You are about to drop the column `reservationId` on the `paymentdetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `paymentdetails` DROP FOREIGN KEY `PaymentDetails_reservationId_fkey`;

-- DropIndex
DROP INDEX `PaymentDetails_reservationId_fkey` ON `paymentdetails`;

-- AlterTable
ALTER TABLE `paymentdetails` DROP COLUMN `reservationId`;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `paymentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_paymentId_key` ON `Reservation`(`paymentId`);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `PaymentDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
