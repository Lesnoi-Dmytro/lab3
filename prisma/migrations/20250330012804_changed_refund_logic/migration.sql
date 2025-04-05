/*
  Warnings:

  - You are about to drop the `refund` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `paymentdetails` MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `refund`;
