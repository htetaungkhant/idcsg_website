/*
  Warnings:

  - Made the column `imageUrl` on table `FirstVisitInformationSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `FirstVisitInformationSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `FirstVisitSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `FirstVisitSection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FirstVisitInformationSection" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."FirstVisitSection" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
