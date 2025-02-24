/*
  Warnings:

  - You are about to drop the column `citizen_id` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_citizen_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "citizen_id";
