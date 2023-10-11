/*
  Warnings:

  - You are about to drop the column `subDistrict_id` on the `placer` table. All the data in the column will be lost.
  - You are about to drop the `district` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `province` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subdistrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `district` DROP FOREIGN KEY `District_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `placer` DROP FOREIGN KEY `Placer_subDistrict_id_fkey`;

-- DropForeignKey
ALTER TABLE `subdistrict` DROP FOREIGN KEY `SubDistrict_district_id_fkey`;

-- AlterTable
ALTER TABLE `placer` DROP COLUMN `subDistrict_id`;

-- DropTable
DROP TABLE `district`;

-- DropTable
DROP TABLE `province`;

-- DropTable
DROP TABLE `subdistrict`;
