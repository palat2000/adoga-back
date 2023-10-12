/*
  Warnings:

  - You are about to drop the column `category_id` on the `room` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desc` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximum_number_people` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_category_id_fkey`;

-- AlterTable
ALTER TABLE `room` DROP COLUMN `category_id`,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `maximum_number_people` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL;

-- DropTable
DROP TABLE `category`;
