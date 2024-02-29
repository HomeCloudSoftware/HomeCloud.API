/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `folder` DROP FOREIGN KEY `Folder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_homeFolderId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_homeFolderId_fkey` FOREIGN KEY (`homeFolderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
