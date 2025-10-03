/*
  Warnings:

  - Added the required column `cardStyle` to the `DentalTechnology` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TechnologyCardStyle" AS ENUM ('CARDSTYLE1', 'CARDSTYLE2');

-- AlterTable
ALTER TABLE "public"."DentalTechnology" ADD COLUMN     "cardStyle" "public"."TechnologyCardStyle" NOT NULL,
ADD COLUMN     "descriptionTitle" TEXT;
