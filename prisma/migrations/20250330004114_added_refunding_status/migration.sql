-- AlterTable
ALTER TABLE `reservation` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'PAYED', 'REFUNDING', 'DAMAGED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    MODIFY `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `issuedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
