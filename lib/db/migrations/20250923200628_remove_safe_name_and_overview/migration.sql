/*
  Warnings:

  - You are about to drop the column `name` on the `Safe` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Safe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Safe" DROP COLUMN "name",
DROP COLUMN "overview";
