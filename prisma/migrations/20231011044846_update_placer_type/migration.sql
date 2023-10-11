/*
  Warnings:

  - You are about to drop the column `customerId` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrictId` on the `placer` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `placer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `categoryId` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `placerId` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `subdistrict` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `subdistrict` table. All the data in the column will be lost.
  - Added the required column `province_id` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDistrict_id` to the `Placer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placer_id` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district_id` to the `SubDistrict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `SubDistrict` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_userId_fkey`;

-- DropForeignKey
ALTER TABLE `district` DROP FOREIGN KEY `District_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `placer` DROP FOREIGN KEY `Placer_subDistrictId_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_placerId_fkey`;

-- DropForeignKey
ALTER TABLE `subdistrict` DROP FOREIGN KEY `SubDistrict_districtId_fkey`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `customerId`,
    DROP COLUMN `userId`,
    ADD COLUMN `customer_id` VARCHAR(191) NULL,
    ADD COLUMN `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `district` DROP COLUMN `provinceId`,
    ADD COLUMN `province_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `bookId`,
    ADD COLUMN `book_id` VARCHAR(191) NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `placer` DROP COLUMN `subDistrictId`,
    ADD COLUMN `subDistrict_id` INTEGER NOT NULL,
    MODIFY `type` ENUM('HOTEL', 'VACATION_HOME', 'VILLA', 'CONDO_APARTMENT') NOT NULL;

-- AlterTable
ALTER TABLE `room` DROP COLUMN `categoryId`,
    DROP COLUMN `placerId`,
    ADD COLUMN `category_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `placer_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subdistrict` DROP COLUMN `districtId`,
    DROP COLUMN `postId`,
    ADD COLUMN `district_id` INTEGER NOT NULL,
    ADD COLUMN `post_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Placer` ADD CONSTRAINT `Placer_subDistrict_id_fkey` FOREIGN KEY (`subDistrict_id`) REFERENCES `SubDistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_placer_id_fkey` FOREIGN KEY (`placer_id`) REFERENCES `Placer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `District` ADD CONSTRAINT `District_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubDistrict` ADD CONSTRAINT `SubDistrict_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `District`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
