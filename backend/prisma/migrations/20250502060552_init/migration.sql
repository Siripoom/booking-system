/*
  Warnings:

  - You are about to drop the column `userCode` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `UserCode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `numberOfPeople` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCode" DROP CONSTRAINT "UserCode_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userCode",
ADD COLUMN     "numberOfPeople" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "citizenId" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserCode";
