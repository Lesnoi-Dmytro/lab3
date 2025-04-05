/*
  Warnings:

  - You are about to drop the column `fueTtype` on the `car` table. All the data in the column will be lost.
  - Added the required column `fuelType` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `fueTtype`,
    ADD COLUMN `fuelType` ENUM('GASOLINE', 'PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID') NOT NULL;
