/*
  Warnings:

  - You are about to drop the column `endDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `dayofWeek` on the `ScheduleRule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `ScheduleRule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `ScheduleRule` table. All the data in the column will be lost.
  - Added the required column `startDatetime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDatetime` to the `ScheduleRule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "endDate",
DROP COLUMN "endTime",
DROP COLUMN "startDate",
DROP COLUMN "startTime",
ADD COLUMN     "endDatetime" TIMESTAMP(3),
ADD COLUMN     "isAllDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDatetime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleRule" DROP COLUMN "dayofWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "dayOfWeek" INTEGER,
ADD COLUMN     "endDatetime" TIMESTAMP(3),
ADD COLUMN     "isAllDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDatetime" TIMESTAMP(3) NOT NULL;
