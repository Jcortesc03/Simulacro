/*
  Warnings:

  - A unique constraint covering the columns `[simulation_name]` on the table `simulations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feedback` to the `simulation_attempts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `simulation_attempts` ADD COLUMN `feedback` VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `simulations_simulation_name_key` ON `simulations`(`simulation_name`);
