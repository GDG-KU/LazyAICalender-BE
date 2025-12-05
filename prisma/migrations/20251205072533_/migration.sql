/*
  Warnings:

  - The `weekOfMonth` column on the `ScheduleRule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `monthOfYear` column on the `ScheduleRule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dayOfWeek` column on the `ScheduleRule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ScheduleRule" ADD COLUMN     "term" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "weekOfMonth",
ADD COLUMN     "weekOfMonth" INTEGER[],
DROP COLUMN "monthOfYear",
ADD COLUMN     "monthOfYear" INTEGER[],
DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" INTEGER[];
