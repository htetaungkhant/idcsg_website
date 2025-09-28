/*
  Warnings:

  - You are about to drop the `DentalTechnologyCard1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DentalTechnologyCard2` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DentalTechnologyCard1" DROP CONSTRAINT "DentalTechnologyCard1_dentalTechnologyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DentalTechnologyCard2" DROP CONSTRAINT "DentalTechnologyCard2_dentalTechnologyId_fkey";

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."DentalTechnologyCard1";

-- DropTable
DROP TABLE "public"."DentalTechnologyCard2";

-- CreateTable
CREATE TABLE "public"."DentalTechnologyCard" (
    "id" TEXT NOT NULL,
    "dentalTechnologyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTechnologyCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DentalTechnologyCard" ADD CONSTRAINT "DentalTechnologyCard_dentalTechnologyId_fkey" FOREIGN KEY ("dentalTechnologyId") REFERENCES "public"."DentalTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
