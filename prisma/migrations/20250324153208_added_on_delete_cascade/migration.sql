-- DropForeignKey
ALTER TABLE `damagereport` DROP FOREIGN KEY `DamageReport_reservationId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentdetails` DROP FOREIGN KEY `PaymentDetails_reservationId_fkey`;

-- DropForeignKey
ALTER TABLE `regularuser` DROP FOREIGN KEY `RegularUser_userId_fkey`;

-- DropIndex
DROP INDEX `PaymentDetails_reservationId_fkey` ON `paymentdetails`;

-- AddForeignKey
ALTER TABLE `RegularUser` ADD CONSTRAINT `RegularUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentDetails` ADD CONSTRAINT `PaymentDetails_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
