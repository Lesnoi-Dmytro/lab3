-- AlterTable
ALTER TABLE `damagereport` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 3;

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
