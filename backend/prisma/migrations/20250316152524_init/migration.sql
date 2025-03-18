/*
  Warnings:

  - The `bookingTime` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "time" TEXT[];

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingTime",
ADD COLUMN     "bookingTime" TEXT[];
